import urllib.request
import os

urls = {
    'FSSAI': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/FSSAI_logo.svg/512px-FSSAI_logo.svg.png',
    'APEDA': 'https://logowik.com/content/uploads/images/apeda-agricultural-and-processed-food-products-export9940.jpg',
    'BRC': 'https://logowik.com/content/uploads/images/brcgs-brand-reputation-through-compliance-global-standard1562.jpg',
    'FSSC 22000': 'https://logowik.com/content/uploads/images/fssc-22000-food-safety-system-certification8854.jpg',
    'ISO 22000': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/ISO_Logo_%28Red_square%29.svg/512px-ISO_Logo_%28Red_square%29.svg.png',
    'ISO 14001': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/ISO_Logo_%28Red_square%29.svg/512px-ISO_Logo_%28Red_square%29.svg.png',
    'GLOBALG.A.P.': 'https://logowik.com/content/uploads/images/globalgap-ifa-v61514.logowik.com.webp',
    'Halal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Halal_logo.svg/512px-Halal_logo.svg.png',
    'Kosher': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Hechsher_ou.svg/512px-Hechsher_ou.svg.png',
    'SGF': 'https://www.sgf.org/assets/images/layout/SGF_Logo.svg',
    'AQA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/AQA_Logo.svg/512px-AQA_Logo.svg.png'
}

os.makedirs('frontend/public/assets/images/certs', exist_ok=True)

for name, url in urls.items():
    filename = f"frontend/public/assets/images/certs/{name.replace(' ', '_').replace('.', '')}.png"
    print(f"Downloading {name}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(filename, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
    except Exception as e:
        print(f"Failed to fetch {name}: {e}")

