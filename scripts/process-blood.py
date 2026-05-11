#!/usr/bin/env python3
"""
处理 img/blood/ 下的原始血迹图，输出到 img/bg/。

处理逻辑：
- 自动检测背景色（采样四角像素，取最常见的颜色）
- 把背景色变透明（容差范围内的像素都变透明）
- 把保留的像素重新染色为项目主题血色 #8b2222
- 输出 PNG，保留透明度
- 命名：blood1.png → blood-bg-1.png
"""

from __future__ import annotations

import os
from collections import Counter

from PIL import Image


TARGET_COLOR = (139, 34, 34)
SRC_DIR = "img/blood"
DST_DIR = "img/bg"
BG_TOLERANCE = 30
EDGE_SOFTNESS = 15


def detect_background_color(img: Image.Image) -> tuple[int, int, int]:
    width, height = img.size
    samples: list[tuple[int, int, int]] = []
    corners = [
        (0, 0),
        (max(width - 5, 0), 0),
        (0, max(height - 5, 0)),
        (max(width - 5, 0), max(height - 5, 0)),
    ]

    for x, y in corners:
        for dx in range(5):
            for dy in range(5):
                px = x + dx
                py = y + dy
                if 0 <= px < width and 0 <= py < height:
                    samples.append(img.getpixel((px, py))[:3])

    return Counter(samples).most_common(1)[0][0]


def color_distance(c1: tuple[int, int, int], c2: tuple[int, int, int]) -> float:
    return sum((a - b) ** 2 for a, b in zip(c1, c2)) ** 0.5


def process_image(src_path: str, dst_path: str) -> tuple[tuple[int, int, int], str]:
    original = Image.open(src_path).convert("RGB")
    bg_color = detect_background_color(original)
    print(f"  原始背景色: RGB{bg_color}")

    image = Image.open(src_path).convert("RGBA")
    pixels = image.load()
    width, height = image.size

    transparent_count = 0
    soft_count = 0
    kept_count = 0

    for x in range(width):
        for y in range(height):
            r, g, b, _ = pixels[x, y]
            distance = color_distance((r, g, b), bg_color)

            if distance <= BG_TOLERANCE:
                pixels[x, y] = (0, 0, 0, 0)
                transparent_count += 1
            elif distance <= BG_TOLERANCE + EDGE_SOFTNESS:
                ratio = (distance - BG_TOLERANCE) / EDGE_SOFTNESS
                alpha = int(255 * ratio)
                pixels[x, y] = (*TARGET_COLOR, alpha)
                soft_count += 1
            else:
                pixels[x, y] = (*TARGET_COLOR, 255)
                kept_count += 1

    print(f"  透明像素: {transparent_count} | 软边像素: {soft_count} | 主体像素: {kept_count}")
    image.save(dst_path, "PNG", optimize=True)
    print(f"  已输出: {dst_path}")
    return bg_color, dst_path


def main() -> None:
    if not os.path.isdir(SRC_DIR):
        print(f"源目录不存在: {SRC_DIR}")
        print("请确认原始血迹图已放到该目录")
        return

    os.makedirs(DST_DIR, exist_ok=True)

    src_files = sorted(
        f
        for f in os.listdir(SRC_DIR)
        if f.lower().startswith("blood") and f.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))
    )

    if not src_files:
        print(f"{SRC_DIR} 下没有找到 blood*.png/jpg/jpeg/webp 文件")
        return

    print(f"找到 {len(src_files)} 张原始图\n")

    results: list[tuple[str, tuple[int, int, int], str]] = []
    for index, name in enumerate(src_files, 1):
        src_path = os.path.join(SRC_DIR, name)
        dst_path = os.path.join(DST_DIR, f"blood-bg-{index}.png")
        print(f"[{index}/{len(src_files)}] 处理 {name}")
        bg_color, output_path = process_image(src_path, dst_path)
        results.append((name, bg_color, output_path))
        print()

    print("全部完成。")
    print("\n输出文件:")
    for _, _, output_path in results:
        print(f"  {output_path}")


if __name__ == "__main__":
    main()
