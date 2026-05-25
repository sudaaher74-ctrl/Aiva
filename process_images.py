import os
import subprocess
from PIL import Image

mapping = {
    "63923D00-C912-43FF-AB6B-3BF07D91C9C3.png": "process-1-sourcing",
    "05DB8734-D530-4767-9EB7-1EADD42E9583.png": "process-2-inspection",
    "5D9615BE-44EB-4331-87BE-ED5AFF428767.png": "process-3-processing",
    "4C348579-D3B5-493A-9C27-49BBDDFE62C5.png": "process-4-export"
}

for old, new_base in mapping.items():
    old_path = os.path.join('assets/images/products', old)
    png_path = os.path.join('assets/images/products', new_base + '.png')
    webp_path = os.path.join('assets/images/products', new_base + '.webp')
    
    if os.path.exists(old_path):
        os.rename(old_path, png_path)
        print(f"Renamed to {png_path}")
        
        # Optimize to WebP
        try:
            with Image.open(png_path) as img:
                img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                img.save(webp_path, 'WEBP', quality=80)
            print(f"Optimized to {webp_path}")
            
            # git rm old, git add new
            os.remove(png_path)
            subprocess.run(['git', 'add', webp_path])
        except Exception as e:
            print(f"Failed to optimize {png_path}: {e}")

print("Done optimizing process images.")
