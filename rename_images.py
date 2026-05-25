import os
import subprocess

image_mapping = {
    "5E2D75B7-929E-4247-8D16-C10AFA26C36A.png": "pomegranate-juice.png",
    "E5E59F30-070B-4A56-99D2-EF66F31AF09F.png": "raw-mango-pulp.png",
    "CC4A17FF-6823-4612-B974-17CDECEF5F40.png": "banana-puree.png",
    "4F5F14BC-C896-466D-A766-D831F69FBB13.png": "amla-pulp.png",
    "095E1745-6ACE-4AE2-8BD6-534DAA19080A.png": "sugarcane-juice.png",
    "54BB1EED-E852-4FFA-A01C-EA4D9F34A485.png": "pineapple-pulp.png",
    "B2B7DA52-8FAB-4BEF-A3F3-3F6BC8B74D4C.png": "lime-juice.png",
    "5783E58E-1CF7-4F4F-90F4-D9A0FA0CC103.png": "green-peas.png",
    "4743C0DC-F681-488F-B319-0619E50EABAD.png": "green-beans-cut.png",
    "280FB8E5-1ABF-4F00-B9FC-65C5DEE013E3.png": "baby-corn.png",
    "9434F3ED-9DF3-4DC5-A80C-03A57025E086.png": "papaya-puree.png",
    "A4EDA861-BCAE-48B4-97AD-9DD77AC70E6F.png": "sapota-pulp.png",
    "C4691FDB-EBB3-4704-AF4C-5380C5753FC6.png": "jamun-pulp.png",
    "E59376D7-F7CC-4615-8B02-FCA1AC6F2E05.png": "sweet-corn-kernels.png",
    "bacb0bfcb965bf1c19ab235f14e1162bd70b292c46041eba500fd6c85a65e5db.png": "corn-cob-cuts.png",
    "52980acb3f8746be5010fafc89796da76b58847f1a04fc8b799f54f34bc09450.png": "pineapple-dices.png",
    "3f4e978001d5cbd462686fdf6ceeacd10d5a4d94325cfeb0fdd51224f44c9925.png": "strawberry-whole-dices.png",
    "dc95e677b46e62ea5198d21cd0026e1c094f917d6501ec0c1ff1bde18eb1bdc4.png": "pomegranate-arils.png",
    "dd97056c1d617a567791ab45547cb903b7ad53d81d5cf45c8b55c38fddc83481.png": "papaya-dices.png",
    "016986398bb165b0172495d629de2315932e7a9c8be29a3b90b6d2c066c30a9f.png": "okra-cuts.png",
    "256097bc57dd57767442b67db6cf8757e386a8b53dab89c997437fef5c5c7424.png": "cauliflower-florets.png",
    "41a91c913767b4fb4124a5a8ecc9c049ba8751085fb34d3f07ad427faaa6aed0.png": "beetroot-dices.png",
    "4EF38E46-5DD9-4B1D-99B7-54BE4FE3B8FC.png": "mixed-vegetables.png"
}

os.makedirs('assets/images/products', exist_ok=True)

for old_name, new_name in image_mapping.items():
    old_path = os.path.join('assets/images', old_name)
    new_path = os.path.join('assets/images/products', new_name)
    if os.path.exists(old_path):
        subprocess.run(['git', 'mv', old_path, new_path])
        print(f"Moved {old_name} to {new_path}")

# Update replace_products.py and js/main.js
for filename in ['replace_products.py', 'js/main.js']:
    with open(filename, 'r') as f:
        content = f.read()
    
    for old_name, new_name in image_mapping.items():
        content = content.replace(f'assets/images/{old_name}', f'assets/images/products/{new_name}')
        
    with open(filename, 'w') as f:
        f.write(content)
    
print("Replaced all occurrences in JS and Python files.")
