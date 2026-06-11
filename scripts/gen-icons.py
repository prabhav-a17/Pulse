"""Generate Pulse PWA icons: deep black rounded square, blue->cyan pulse waveform dot."""
from PIL import Image, ImageDraw
import os

os.makedirs('public/icons', exist_ok=True)

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

BLUE = (0, 102, 255)
CYAN = (0, 212, 255)
BG = (7, 7, 15)

def make_icon(size, path, maskable=False):
    img = Image.new('RGBA', (size, size), BG + (255,))
    d = ImageDraw.Draw(img)
    cx, cy = size / 2, size / 2
    pad = size * (0.30 if maskable else 0.22)

    # radial glow
    glow = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for r in range(int(size * 0.45), 0, -2):
        t = r / (size * 0.45)
        alpha = int(38 * (1 - t))
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=CYAN + (alpha,))
    img = Image.alpha_composite(img, glow)
    d = ImageDraw.Draw(img)

    # pulse waveform (EKG-style) across the middle
    w = size - 2 * pad
    pts_norm = [(0.0, 0.5), (0.25, 0.5), (0.36, 0.18), (0.5, 0.82), (0.62, 0.36), (0.72, 0.5), (1.0, 0.5)]
    pts = [(pad + x * w, pad + y * w) for x, y in pts_norm]
    lw = max(3, size // 28)
    for i in range(len(pts) - 1):
        t = i / (len(pts) - 2)
        d.line([pts[i], pts[i + 1]], fill=lerp(BLUE, CYAN, t) + (255,), width=lw)
        r = lw // 2
        for p in (pts[i], pts[i + 1]):
            d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=lerp(BLUE, CYAN, t) + (255,))

    # bright cyan dot at the peak
    peak = pts[3]
    pr = max(4, size // 24)
    d.ellipse([peak[0] - pr, peak[1] - pr, peak[0] + pr, peak[1] + pr], fill=CYAN + (255,))

    if not maskable:
        # rounded-square mask
        mask = Image.new('L', (size, size), 0)
        md = ImageDraw.Draw(mask)
        md.rounded_rectangle([0, 0, size, size], radius=int(size * 0.22), fill=255)
        out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        out.paste(img, mask=mask)
        img = out

    img.save(path)
    print(path)

make_icon(192, 'public/icons/icon-192.png')
make_icon(512, 'public/icons/icon-512.png')
make_icon(512, 'public/icons/icon-512-maskable.png', maskable=True)
make_icon(180, 'public/icons/apple-touch-icon.png', maskable=True)
