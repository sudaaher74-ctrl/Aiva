import os
import urllib.request

urls = {
    'FSSAI': 'https://upload.wikimedia.org/wikipedia/commons/1/15/FSSAI_logo.svg',
    'APEDA': 'https://cdn.worldvectorlogo.com/logos/apeda.svg',
    'ISO_22000': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/ISO_Logo_%28Red_square%29.svg',
    'ISO_14001': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/ISO_Logo_%28Red_square%29.svg',
    'Halal_certification': 'https://upload.wikimedia.org/wikipedia/commons/6/67/Halal_logo.svg',
    'Kosher_certification': 'https://upload.wikimedia.org/wikipedia/commons/6/60/Hechsher_ou.svg',
    'AQA_certification': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/AQA_Logo.svg'
}

for name, url in urls.items():
    filename = f"frontend/public/assets/images/certs/{name}.svg"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(filename, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed {name}: {e}")

