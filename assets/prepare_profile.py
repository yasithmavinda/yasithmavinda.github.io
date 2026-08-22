import os
from PIL import Image, ImageDraw, ImageOps
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph

def make_circular_profile(input_path, output_path, size=(300, 300)):
    """Creates a circular cropped profile picture with a clean white ring border."""
    img = Image.open(input_path).convert("RGBA")
    
    # Square crop center
    min_dim = min(img.size)
    left = (img.width - min_dim) // 2
    top = (img.height - min_dim) // 2
    right = left + min_dim
    bottom = top + min_dim
    img = img.crop((left, top, right, bottom))
    img = img.resize(size, Image.Resampling.LANCZOS)
    
    # Create mask for circular crop
    mask = Image.new('L', size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size[0], size[1]), fill=255)
    
    # Apply circular mask
    circular_img = Image.new('RGBA', size, (0, 0, 0, 0))
    circular_img.paste(img, (0, 0), mask=mask)
    
    # Create white ring border canvas
    border_size = (size[0] + 16, size[1] + 16)
    final_img = Image.new('RGBA', border_size, (0, 0, 0, 0))
    
    border_mask = Image.new('L', border_size, 0)
    draw_border = ImageDraw.Draw(border_mask)
    draw_border.ellipse((0, 0, border_size[0], border_size[1]), fill=255)
    
    white_bg = Image.new('RGBA', border_size, (255, 255, 255, 255))
    final_img.paste(white_bg, (0, 0), mask=border_mask)
    final_img.paste(circular_img, (8, 8), mask=circular_img)
    
    final_img.save(output_path, "PNG")
    print("Circular profile photo saved to:", output_path)

if __name__ == '__main__':
    img_in = r"c:\Users\yasit\OneDrive\Desktop\all\Private\portfolio\images\profile.jpg"
    img_out = r"c:\Users\yasit\OneDrive\Desktop\all\Private\portfolio\assets\profile_circle.png"
    make_circular_profile(img_in, img_out)
