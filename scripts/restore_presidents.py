from __future__ import annotations

import os
from pathlib import Path

import cv2
import numpy as np
import torch
from basicsr.archs.rrdbnet_arch import RRDBNet
from gfpgan import GFPGANer
from realesrgan import RealESRGANer

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUT = ASSETS / "presidents"
WEIGHTS = ROOT / ".restore-weights"

SPRITES = [
    (1, 20, ASSETS / "past-presidents-01-20.webp"),
    (21, 40, ASSETS / "past-presidents-21-40.webp"),
    (41, 59, ASSETS / "past-presidents-41-60.webp"),
]


def split_cell(sprite: np.ndarray, number: int, start: int) -> np.ndarray:
    h, w = sprite.shape[:2]
    cell_w = w // 4
    cell_h = h // 5
    idx = number - start
    row, col = divmod(idx, 4)
    x0, y0 = col * cell_w, row * cell_h
    x1 = w if col == 3 else (col + 1) * cell_w
    y1 = h if row == 4 else (row + 1) * cell_h
    return sprite[y0:y1, x0:x1].copy()


def historical_bw(img: np.ndarray) -> bool:
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    return float(hsv[:, :, 1].mean()) < 16.0


def finish(img: np.ndarray, preserve_bw: bool) -> np.ndarray:
    if preserve_bw:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

    # Gentle local contrast + restrained sharpening after model restoration.
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=1.35, tileGridSize=(8, 8))
    l = clahe.apply(l)
    img = cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)

    blur = cv2.GaussianBlur(img, (0, 0), 1.0)
    img = cv2.addWeighted(img, 1.10, blur, -0.10, 0)
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    WEIGHTS.mkdir(parents=True, exist_ok=True)

    real_model_path = WEIGHTS / "RealESRGAN_x2plus.pth"
    face_model_path = WEIGHTS / "GFPGANv1.4.pth"
    if not real_model_path.exists() or not face_model_path.exists():
        raise SystemExit("Model weights are missing. The workflow downloads them before this script runs.")

    rrdb = RRDBNet(
        num_in_ch=3,
        num_out_ch=3,
        num_feat=64,
        num_block=23,
        num_grow_ch=32,
        scale=2,
    )

    upsampler = RealESRGANer(
        scale=2,
        model_path=str(real_model_path),
        model=rrdb,
        tile=256,
        tile_pad=16,
        pre_pad=0,
        half=False,
        device=torch.device("cpu"),
    )

    restorer = GFPGANer(
        model_path=str(face_model_path),
        upscale=2,
        arch="clean",
        channel_multiplier=2,
        bg_upsampler=upsampler,
        device=torch.device("cpu"),
    )

    restored_count = 0
    face_count = 0

    for start, end, sprite_path in SPRITES:
        sprite = cv2.imread(str(sprite_path), cv2.IMREAD_COLOR)
        if sprite is None:
            raise RuntimeError(f"Could not read {sprite_path}")
        if sprite.shape[1] < 1000 or sprite.shape[0] < 1800:
            raise RuntimeError(f"{sprite_path.name} is unexpectedly low resolution: {sprite.shape[1]}x{sprite.shape[0]}")

        for number in range(start, end + 1):
            source = split_cell(sprite, number, start)
            preserve_bw = historical_bw(source)

            # AI restoration. We keep the blend conservative so facial identity stays
            # anchored to the historical source instead of being reinterpreted.
            try:
                _, restored_faces, restored = restorer.enhance(
                    source,
                    has_aligned=False,
                    only_center_face=True,
                    paste_back=True,
                    weight=0.50,
                )
            except Exception as exc:
                print(f"GFPGAN failed for #{number}: {exc}; falling back to Real-ESRGAN")
                restored, _ = upsampler.enhance(source, outscale=2)
                restored_faces = []

            if restored is None:
                restored, _ = upsampler.enhance(source, outscale=2)

            # Blend some original photographic evidence back into the AI result.
            base = cv2.resize(source, (restored.shape[1], restored.shape[0]), interpolation=cv2.INTER_LANCZOS4)
            restored = cv2.addWeighted(restored, 0.72, base, 0.28, 0)
            restored = finish(restored, preserve_bw)

            out_path = OUT / f"president-{number:02d}.webp"
            ok = cv2.imwrite(str(out_path), restored, [cv2.IMWRITE_WEBP_QUALITY, 94])
            if not ok:
                raise RuntimeError(f"Could not write {out_path}")

            restored_count += 1
            if restored_faces:
                face_count += 1
            print(f"#{number:02d}: {source.shape[1]}x{source.shape[0]} -> {restored.shape[1]}x{restored.shape[0]} | face={'yes' if restored_faces else 'fallback'}")

    print(f"Restored {restored_count} portraits; GFPGAN detected a face in {face_count}.")


if __name__ == "__main__":
    main()
