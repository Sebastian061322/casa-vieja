#!/usr/bin/env python3
"""Generate deterministic PNG icons without external image dependencies."""

from __future__ import annotations

import struct
import zlib
from pathlib import Path


ROOT = Path(__file__).parent


def png(width: int, height: int, pixels: bytes) -> bytes:
    def chunk(kind: bytes, body: bytes) -> bytes:
        return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF)
    rows = b"".join(b"\0" + pixels[y * width * 4:(y + 1) * width * 4] for y in range(height))
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(rows, 9)) + chunk(b"IEND", b"")


def build(size: int) -> bytes:
    dark = (36, 27, 21, 255)
    cream = (247, 241, 231, 255)
    green = (56, 99, 73, 255)
    data = bytearray(dark * (size * size))
    radius = size * 0.35
    cx = cy = size / 2
    for y in range(size):
        for x in range(size):
            dx, dy = x - cx, y - cy
            color = dark
            if dx * dx + dy * dy <= radius * radius:
                color = cream
                leaf_x = dx / radius
                leaf_y = dy / radius
                if ((leaf_x + 0.15) / 0.65) ** 2 + ((leaf_y - 0.02) / 0.92) ** 2 <= 1 and leaf_x + leaf_y < 0.8:
                    color = green
                if abs(leaf_y + 0.72 * leaf_x) < 0.055 and -0.65 < leaf_x < 0.65:
                    color = cream
            offset = (y * size + x) * 4
            data[offset:offset + 4] = bytes(color)
    return png(size, size, bytes(data))


for dimension in (192, 512):
    (ROOT / f"icon-{dimension}.png").write_bytes(build(dimension))
