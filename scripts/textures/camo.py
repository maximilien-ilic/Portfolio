"""Generates public/textures/camo-canvas.webp, the project cards' background.

Blue watercolour camouflage printed on woven canvas, dark and quiet: the
blobs are a seamless noise field (filtered in the frequency domain, so the
tile wraps without a seam) cut into four tone levels; the canvas is a small
twill weave multiplied over it.

Run:  python3 scripts/textures/camo.py
"""

import numpy as np
from PIL import Image

N = 512
rng = np.random.default_rng(7)


def field(power, lowcut=0.0):
    """Periodic noise: white noise shaped to a 1/f^power spectrum, with the
    very lowest frequencies removed so the tile is many blobs, not one."""
    noise = rng.standard_normal((N, N))
    fx = np.fft.fftfreq(N)[:, None]
    fy = np.fft.fftfreq(N)[None, :]
    f = np.sqrt(fx**2 + fy**2)
    f[0, 0] = 1
    spectrum = np.fft.fft2(noise) / f**power
    spectrum *= 1 - np.exp(-((f / lowcut) ** 2)) if lowcut else 1
    spectrum[0, 0] = 0
    out = np.real(np.fft.ifft2(spectrum))
    return (out - out.min()) / (out.max() - out.min())


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


# Big blobs, with a finer field nudging the thresholds so edges wander like
# pigment soaking into cloth.
base = field(2.1, lowcut=0.012)
detail = field(1.4)
v = base + (detail - 0.5) * 0.3

# Dark rendition of the reference: navy cloth, blobs in three lighter blues.
TONES = np.array([
    [12, 21, 33],    # cloth
    [17, 34, 54],
    [24, 49, 80],
    [33, 67, 108],   # the deepest blue of the reference, here the lightest
], dtype=float)

l1 = smoothstep(0.44, 0.46, v)
l2 = smoothstep(0.53, 0.55, v)
l3 = smoothstep(0.62, 0.64, v)
img = TONES[0] * (1 - l1)[..., None] + TONES[1] * (l1 - l2)[..., None] \
    + TONES[2] * (l2 - l3)[..., None] + TONES[3] * l3[..., None]

# Twill weave: 2 px threads, the over/under pattern stepping one thread per
# row, which is what draws the diagonal ribs of canvas. Each thread is
# shaded across its width so it reads as round.
y, x = np.mgrid[0:N, 0:N]
over = ((x // 2) - (y // 2)) % 4 < 2
across_h = np.cos((y % 2 - 0.5) * np.pi / 2.2)
across_v = np.cos((x % 2 - 0.5) * np.pi / 2.2)
weave = np.where(over, across_h, across_v * 0.55)
img *= (0.66 + 0.46 * weave)[..., None]

# A little grain, then save.
img *= (1 + rng.normal(0, 0.035, (N, N)))[..., None]
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(
    "public/textures/camo-canvas.webp", quality=82, method=6
)
print("public/textures/camo-canvas.webp")
