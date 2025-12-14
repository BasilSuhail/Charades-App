#!/usr/bin/env python3
"""
Generate PWA icons for Holiday Charades app
Requires: pip install pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Installing Pillow...")
    import subprocess
    subprocess.check_call(["pip3", "install", "pillow"])
    from PIL import Image, ImageDraw, ImageFont

def create_icon(size, filename):
    # Create image with gradient-like background
    img = Image.new('RGB', (size, size), color='#FF3366')
    draw = ImageDraw.Draw(img)

    # Draw a circle background
    draw.ellipse([size//8, size//8, size - size//8, size - size//8],
                 fill='#FF3366', outline='#FFD93D', width=size//20)

    # Try to draw emoji text (theater masks)
    try:
        # Use a large font size
        font_size = int(size * 0.5)
        font = ImageFont.truetype("/System/Library/Fonts/Apple Color Emoji.ttc", font_size)
        text = "🎭"

        # Get text bounding box for centering
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        position = ((size - text_width) // 2, (size - text_height) // 2)
        draw.text(position, text, font=font, embedded_color=True)
    except Exception as e:
        print(f"Could not add emoji (using fallback): {e}")
        # Fallback: draw simple geometric shape
        draw.rectangle([size//4, size//3, size*3//4, size*2//3], fill='white')
        draw.ellipse([size//3, size//6, size*2//3, size//2], fill='white')

    # Save the image
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

if __name__ == "__main__":
    create_icon(192, "icon-192.png")
    create_icon(512, "icon-512.png")
    print("\nIcons generated successfully!")
    print("Note: For better-looking icons, consider using a design tool like Figma or Canva.")
