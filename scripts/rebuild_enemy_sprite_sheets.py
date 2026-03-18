from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/enemies/Gemini_Generated_Image_omwqnsomwqnsomwq.png"
OUT = ROOT / "src/assets/enemies/repaired"


@dataclass(frozen=True)
class Box:
    x: int
    y: int
    w: int
    h: int


GLITCH = [
    Box(55, 55, 130, 120),
    Box(235, 55, 135, 120),
    Box(420, 55, 135, 120),
    Box(605, 55, 135, 120),
    Box(35, 225, 155, 130),
    Box(210, 220, 185, 145),
    Box(395, 215, 185, 150),
    Box(585, 215, 190, 150),
    Box(45, 385, 150, 145),
    Box(205, 350, 250, 230),
    Box(390, 340, 275, 240),
    Box(590, 335, 285, 245),
]

LEGACY = [
    Box(1220, 35, 250, 225),
    Box(1420, 25, 270, 255),
    Box(1610, 35, 260, 235),
    Box(1810, 35, 265, 235),
    Box(1160, 245, 360, 240),
    Box(1450, 245, 365, 240),
    Box(1750, 250, 370, 240),
    Box(1150, 470, 370, 245),
    Box(1440, 455, 420, 260),
    Box(1735, 450, 470, 265),
]

STAKEHOLDER = [
    Box(560, 1040, 185, 220),
    Box(830, 1040, 200, 220),
    Box(1120, 1040, 190, 220),
    Box(1415, 1040, 205, 220),
    Box(0, 1270, 230, 445),
    Box(280, 1270, 255, 445),
    Box(600, 1270, 275, 445),
    Box(960, 1270, 285, 445),
    Box(1295, 1270, 290, 445),
    Box(1650, 1260, 300, 455),
]


def build_sheet(source: Image.Image, boxes: list[Box], cell_size: tuple[int, int], columns: int) -> Image.Image:
    cell_w, cell_h = cell_size
    rows = (len(boxes) + columns - 1) // columns
    out = Image.new("RGBA", (cell_w * columns, cell_h * rows), (0, 0, 0, 0))
    for i, box in enumerate(boxes):
        crop = source.crop((box.x, box.y, box.x + box.w, box.y + box.h))
        ox = (i % columns) * cell_w + (cell_w - crop.width) // 2
        oy = (i // columns) * cell_h + (cell_h - crop.height) // 2
        out.alpha_composite(crop, (ox, oy))
    return out


def repaint_glitch(sheet: Image.Image) -> None:
    draw = ImageDraw.Draw(sheet)
    black = (8, 8, 8, 255)
    neon = (61, 239, 173, 255)
    lime = (181, 255, 55, 255)
    cell_w, cell_h = 260, 250
    # Only repaint the oversized bottom row.
    for idx in (9, 10, 11):
        ox = (idx % 4) * cell_w
        oy = (idx // 4) * cell_h
        # Add missing lower legs.
        for x, y in [
            (114, 185), (124, 194), (136, 202), (151, 188), (162, 196), (173, 205),
            (188, 184), (198, 194), (209, 206),
        ]:
            draw.rectangle((ox + x, oy + y, ox + x + 3, oy + y + 5), fill=black)
        # Add a few corrupted trailing pixels below the body.
        for x, y, c in [
            (93, 176, neon), (102, 202, neon), (219, 182, neon), (228, 198, neon),
            (120, 210, lime), (207, 212, lime),
        ]:
            draw.rectangle((ox + x, oy + y, ox + x + 5, oy + y + 5), fill=c)


def repaint_stakeholder(sheet: Image.Image) -> None:
    cell_w, cell_h = 320, 260
    src_ox = 4 * cell_w
    dst_ox = 5 * cell_w
    oy = cell_h
    muzzle = sheet.crop((src_ox + 170, oy + 95, src_ox + 255, oy + 170))
    sheet.alpha_composite(muzzle, (dst_ox + 182, oy + 92))
    draw = ImageDraw.Draw(sheet)
    white = (242, 242, 240, 255)
    outline = (18, 18, 18, 255)
    red = (197, 50, 54, 255)
    draw.rectangle((dst_ox + 241, oy + 107, dst_ox + 248, oy + 152), fill=white)
    draw.rectangle((dst_ox + 236, oy + 102, dst_ox + 241, oy + 157), fill=outline)
    draw.rectangle((dst_ox + 216, oy + 102, dst_ox + 224, oy + 156), fill=red)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGBA")

    glitch = build_sheet(source, GLITCH, (260, 250), 4)
    repaint_glitch(glitch)
    glitch.save(OUT / "glitch_bug_repainted_sheet.png")

    legacy = build_sheet(source, LEGACY, (360, 280), 4)
    legacy.save(OUT / "legacy_beast_repainted_sheet.png")

    stakeholder = build_sheet(source, STAKEHOLDER, (320, 260), 6)
    repaint_stakeholder(stakeholder)
    stakeholder.save(OUT / "stakeholder_repainted_sheet.png")

    projectile = source.crop((1860, 1240, 2288, 1608))
    projectile.save(OUT / "stakeholder_asap_repainted_projectile.png")

    print("saved repainted sheets")


if __name__ == "__main__":
    main()
