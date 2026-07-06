import os
import glob
from PIL import Image

def trim_transparency(img_path):
    try:
        with Image.open(img_path) as img:
            # Ensure image has alpha channel
            img = img.convert("RGBA")
            # Get bounding box of non-transparent pixels
            bbox = img.getbbox()
            if bbox:
                # Crop to bounding box
                cropped_img = img.crop(bbox)
                # Save the image, overwrite
                cropped_img.save(img_path)
                print(f"Trimmed: {img_path}")
            else:
                print(f"Empty or fully transparent: {img_path}")
    except Exception as e:
        print(f"Error processing {img_path}: {e}")

def main():
    base_dir = "frontend/public/assets/images/products"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.lower().endswith(('.png', '.webp')):
                trim_transparency(os.path.join(root, file))

if __name__ == "__main__":
    main()
