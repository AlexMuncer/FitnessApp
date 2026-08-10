"""One-off icon generator for the fitness PWA. Run: python scripts/gen_icons.py"""
from PIL import Image, ImageDraw
import math
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "icons")
os.makedirs(OUT, exist_ok=True)

BG = (15, 118, 110)      # deep teal
FG = (255, 255, 255)     # white glyph
ACCENT = (94, 234, 212)  # light teal accent dot

def draw_icon(size, corner_radius_ratio=0.0):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if corner_radius_ratio > 0:
        radius = int(size * corner_radius_ratio)
        draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=radius, fill=BG)
    else:
        draw.rectangle([(0, 0), (size - 1, size - 1)], fill=BG)

    # Pulse / heartbeat line glyph, centered, scaled to icon size
    cx, cy = size / 2, size / 2
    w = size * 0.62
    h = size * 0.20
    lw = max(2, int(size * 0.045))

    x0 = cx - w / 2
    y = cy
    points = [
        (x0, y),
        (x0 + w * 0.22, y),
        (x0 + w * 0.32, y - h),
        (x0 + w * 0.45, y + h),
        (x0 + w * 0.58, y - h * 0.6),
        (x0 + w * 0.68, y),
        (x0 + w, y),
    ]
    draw.line(points, fill=FG, width=lw, joint="curve")

    # small accent dot at the pulse peak
    peak = points[3]
    r = size * 0.035
    draw.ellipse([peak[0] - r, peak[1] - r, peak[0] + r, peak[1] + r], fill=ACCENT)

    return img

# Maskable/manifest icons (rounded square, transparent corners ok — any-purpose)
draw_icon(192, corner_radius_ratio=0.22).save(os.path.join(OUT, "icon-192.png"))
draw_icon(512, corner_radius_ratio=0.22).save(os.path.join(OUT, "icon-512.png"))

# Apple touch icon must be fully opaque/square — iOS applies its own mask
apple = draw_icon(180, corner_radius_ratio=0.0)
apple_bg = Image.new("RGB", apple.size, BG)
apple_bg.paste(apple, mask=apple.split()[3])
apple_bg.save(os.path.join(OUT, "apple-touch-icon.png"))

# Favicon
draw_icon(32, corner_radius_ratio=0.18).save(os.path.join(OUT, "favicon-32.png"))

print("Icons written to", os.path.abspath(OUT))
