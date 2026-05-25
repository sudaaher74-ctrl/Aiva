import os

replacements = {
    # RGB values for rgba()
    "18, 53, 36": "11, 36, 71",
    "10, 31, 21": "4, 18, 38",
    # Hex values in SVGs
    "%23123524": "%23000000",
}

css_vars_old = """  /* Brand Colors */
  --deep-green: #d1ad7f;
  --forest-depth: #bec093;
  --natural-beige: #F5F1E8;
  --gold-leaf: rgb(97, 218, 202);
  --gold-light: #c3a238;"""

css_vars_new = """  /* Brand Colors */
  --deep-green: #000000;
  --forest-depth: #041226;
  --natural-beige: #F4F7F9;
  --gold-leaf: #B08D57;
  --gold-light: #C5A365;"""

directory = '/Users/milquu/Documents/Aiva 2'

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith(('.html', '.css', '.js')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
                
            if filepath.endswith('styles.css'):
                new_content = new_content.replace(css_vars_old, css_vars_new)
            
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
