from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/enemies/Inital_enemies.png"
OUTPUT_DIR = ROOT / "src/assets/enemies/extracted"


@dataclass(frozen=True)
class Region:
    name: str
    box: tuple[int, int, int, int]


@dataclass(frozen=True)
class Box:
    x: int
    y: int
    w: int
    h: int


REGIONS = [
    Region("glitch_bug_exact_sheet", (12, 12, 1092, 940)),
    Region("legacy_beast_exact_sheet", (1118, 12, 2294, 940)),
    Region("stakeholder_exact_sheet", (12, 1036, 2294, 1844)),
]

GLITCH_BOXES = [
    Box(58, 174, 126, 133),
    Box(322, 173, 127, 133),
    Box(580, 172, 128, 134),
    Box(839, 172, 128, 134),
    Box(58, 448, 138, 124),
    Box(321, 446, 144, 126),
    Box(577, 437, 165, 136),
    Box(833, 431, 188, 143),
    Box(58, 704, 112, 100),
    Box(319, 675, 164, 150),
    Box(577, 659, 207, 176),
    Box(835, 652, 212, 180),
]

LEGACY_BOXES = [
    Box(1178, 118, 252, 272),
    Box(1440, 116, 262, 276),
    Box(1702, 118, 255, 272),
    Box(1962, 116, 252, 276),
    Box(1148, 414, 334, 184),
    Box(1492, 414, 338, 184),
    Box(1838, 414, 334, 184),
    Box(1162, 648, 308, 184),
    Box(1474, 644, 360, 192),
    Box(1802, 634, 424, 206),
]

STAKEHOLDER_BOXES = [
    Box(52, 1308, 228, 424),
    Box(356, 1082, 166, 224),
    Box(621, 1084, 182, 224),
    Box(914, 1080, 182, 226),
    Box(1207, 1078, 190, 232),
    Box(340, 1396, 232, 338),
    Box(598, 1398, 240, 336),
    Box(866, 1392, 228, 342),
    Box(1132, 1392, 234, 342),
    Box(1398, 1388, 244, 346),
]

GLITCH_ROWS = [
    (49, 164, 984, 304),
    (49, 438, 1042, 582),
    (120, 691, 1060, 840),
]

LEGACY_ROWS = [
    (1235, 118, 2218, 388),
    (1200, 414, 2180, 600),
    (1200, 640, 2230, 842),
]

STAKEHOLDER_ROWS = [
    (334, 1140, 1400, 1308),
    (44, 1308, 1735, 1738),
]


def remove_page_background(image: Image.Image) -> Image.Image:
    out = image.convert("RGBA")
    pixels = out.load()
    width, height = out.size
    visited = set()
    queue: deque[tuple[int, int]] = deque()

    def is_background(x: int, y: int) -> bool:
        r, g, b, a = pixels[x, y]
        if a == 0:
            return False
        value = (r + g + b) / 3
        saturation = max(r, g, b) - min(r, g, b)
        return value >= 220 and saturation <= 22

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


def trim_alpha(image: Image.Image, padding: int = 8) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        return image

    left, top, right, bottom = bbox
    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(image.width, right + padding)
    bottom = min(image.height, bottom + padding)
    return image.crop((left, top, right, bottom))


def build_sheet(source: Image.Image, boxes: list[Box], cell_size: tuple[int, int], columns: int) -> Image.Image:
    cell_w, cell_h = cell_size
    rows = (len(boxes) + columns - 1) // columns
    out = Image.new("RGBA", (cell_w * columns, cell_h * rows), (0, 0, 0, 0))
    for index, box in enumerate(boxes):
        crop = source.crop((box.x, box.y, box.x + box.w, box.y + box.h))
        transparent = remove_page_background(crop)
        trimmed = trim_alpha(transparent, padding=4)
        ox = (index % columns) * cell_w + (cell_w - trimmed.width) // 2
        oy = (index // columns) * cell_h + (cell_h - trimmed.height) // 2
        out.alpha_composite(trimmed, (ox, oy))
    return out


def build_row_sheet(source: Image.Image, rows: list[tuple[int, int, int, int]], padding: int = 18) -> Image.Image:
    crops = []
    max_width = 0
    total_height = padding
    for left, top, right, bottom in rows:
        crop = source.crop((left, top, right, bottom))
        transparent = remove_page_background(crop)
        trimmed = trim_alpha(transparent, padding=4)
        crops.append(trimmed)
        max_width = max(max_width, trimmed.width)
        total_height += trimmed.height + padding

    out = Image.new("RGBA", (max_width + padding * 2, total_height), (0, 0, 0, 0))
    y = padding
    for crop in crops:
        x = (out.width - crop.width) // 2
        out.alpha_composite(crop, (x, y))
        y += crop.height + padding
    return out


def remove_small_components(image: Image.Image, min_area: int) -> Image.Image:
    out = image.convert("RGBA")
    pixels = out.load()
    width, height = out.size
    alpha = out.getchannel("A")
    alpha_pixels = alpha.load()
    visited = set()

    for y in range(height):
        for x in range(width):
            if alpha_pixels[x, y] == 0 or (x, y) in visited:
                continue

            queue = deque([(x, y)])
            visited.add((x, y))
            component = []

            while queue:
                cx, cy = queue.popleft()
                component.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < width and 0 <= ny < height and alpha_pixels[nx, ny] != 0 and (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))

            if len(component) < min_area:
                for cx, cy in component:
                    r, g, b, _ = pixels[cx, cy]
                    pixels[cx, cy] = (r, g, b, 0)

    return out


def clear_rectangles(image: Image.Image, rects: list[tuple[int, int, int, int]]) -> Image.Image:
    out = image.convert("RGBA")
    pixels = out.load()
    for left, top, right, bottom in rects:
        for y in range(max(0, top), min(out.height, bottom)):
            for x in range(max(0, left), min(out.width, right)):
                r, g, b, _ = pixels[x, y]
                pixels[x, y] = (r, g, b, 0)
    return out


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGBA")

    for region in REGIONS:
        cropped = source.crop(region.box)
        transparent = remove_page_background(cropped)
        trimmed = trim_alpha(transparent)
        out_path = OUTPUT_DIR / f"{region.name}.png"
        trimmed.save(out_path)
        print(f"saved {out_path.name} {trimmed.size}")

    glitch_art = remove_small_components(build_row_sheet(source, GLITCH_ROWS), 2500)
    glitch_art = clear_rectangles(glitch_art, [(0, 310, 140, 390)])
    glitch_art.save(OUTPUT_DIR / "glitch_bug_art_only.png")
    print("saved glitch_bug_art_only.png")
    legacy_art = remove_small_components(build_row_sheet(source, LEGACY_ROWS), 2500)
    legacy_art = clear_rectangles(
        legacy_art,
        [
            (0, 0, 160, 90),
            (0, 250, 220, 400),
            (0, 560, 220, 760),
        ],
    )
    legacy_art.save(OUTPUT_DIR / "legacy_beast_art_only.png")
    print("saved legacy_beast_art_only.png")
    stakeholder_art = remove_small_components(build_row_sheet(source, STAKEHOLDER_ROWS), 2500)
    stakeholder_art = clear_rectangles(
        stakeholder_art,
        [
            (620, 0, 1260, 90),
            (0, 150, 180, 280),
        ],
    )
    stakeholder_art.save(OUTPUT_DIR / "stakeholder_art_only.png")
    print("saved stakeholder_art_only.png")


if __name__ == "__main__":
    main()
