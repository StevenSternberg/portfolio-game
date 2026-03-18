from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from collections import deque
from statistics import median

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/enemies/Gemini_Generated_Image_omwqnsomwqnsomwq.png"
OUTPUT_DIR = ROOT / "src/assets/enemies/extracted"
TILE_SIZE = 32


@dataclass(frozen=True)
class Region:
    name: str
    box: tuple[int, int, int, int]


REGIONS = [
    Region("glitch_bug_sheet", (20, 20, 1140, 930)),
    Region("legacy_beast_sheet", (1010, 20, 2304, 1145)),
    Region("stakeholder_sheet", (30, 1040, 1975, 1856)),
    Region("stakeholder_asap_projectile", (1850, 1210, 2304, 1660)),
]


def parity_color(image: Image.Image, parity: int) -> tuple[int, int, int]:
    samples: list[tuple[int, int, int]] = []
    width, height = image.size

    for x in range(width):
        for y in (0, height - 1):
            if ((x // TILE_SIZE) + (y // TILE_SIZE)) % 2 == parity:
                samples.append(image.getpixel((x, y))[:3])

    for y in range(height):
        for x in (0, width - 1):
            if ((x // TILE_SIZE) + (y // TILE_SIZE)) % 2 == parity:
                samples.append(image.getpixel((x, y))[:3])

    return tuple(int(median(channel)) for channel in zip(*samples))


def remove_checkerboard(
    image: Image.Image,
    dark: tuple[int, int, int],
    light: tuple[int, int, int],
    origin: tuple[int, int],
) -> Image.Image:
    out = image.copy()
    pixels = out.load()
    width, height = out.size
    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()
    origin_x, origin_y = origin

    def is_background(x: int, y: int) -> bool:
        r, g, b, _ = pixels[x, y]
        saturation = max(r, g, b) - min(r, g, b)
        value = (r + g + b) / 3
        return saturation <= 38 and 55 <= value <= 205

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited or not (0 <= x < width and 0 <= y < height):
            continue
        visited.add((x, y))

        if is_background(x, y):
            r, g, b, _ = pixels[x, y]
            pixels[x, y] = (r, g, b, 0)
            queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return out


def trim_alpha(image: Image.Image, padding: int = 6) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return image

    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(image.width, right + padding)
    bottom = min(image.height, bottom + padding)
    return image.crop((left, top, right, bottom))


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGBA")
    dark = parity_color(source, 0)
    light = parity_color(source, 1)

    for region in REGIONS:
        cropped = source.crop(region.box)
        cleaned = remove_checkerboard(cropped, dark, light, (region.box[0], region.box[1]))
        trimmed = trim_alpha(cleaned)
        trimmed.save(OUTPUT_DIR / f"{region.name}.png")
        print(f"saved {region.name}.png {trimmed.size}")


if __name__ == "__main__":
    main()
