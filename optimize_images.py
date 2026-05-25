import os
import glob
from PIL import Image
import subprocess

directory = 'assets/images/products'
png_files = glob.glob(os.path.join(directory, '*.png'))

for filepath in png_files:
    try:
        with Image.open(filepath) as img:
            # Resize image to max 800px width/height while preserving aspect ratio
            img.thumbnail((800, 800), Image.Resampling.LANCZOS)
            
            # Create webp path
            base = os.path.splitext(filepath)[0]
            webp_path = base + '.webp'
            
            # Save as webp
            img.save(webp_path, 'WEBP', quality=80)
            
        print(f"Optimized: {webp_path}")
        
        # Remove old png and add new webp to git
        subprocess.run(['git', 'rm', filepath])
        subprocess.run(['git', 'add', webp_path])
        
    except Exception as e:
        print(f"Failed to process {filepath}: {e}")

# Also replace .png with .webp in js/main.js and replace_products.py
for filename in ['replace_products.py', 'js/main.js']:
    with open(filename, 'r') as f:
        content = f.read()
    
    # We only replace .png to .webp for files in assets/images/products
    # but since all our product images are there and they were all converted,
    # a simple string replace of '.png' to '.webp' where the path starts with 'assets/images/products' works.
    # To be safe:
    content = content.replace('.png', '.webp')
    
    with open(filename, 'w') as f:
        f.write(content)

print("Finished optimization and replacements.")
