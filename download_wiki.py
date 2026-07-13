import urllib.request
import json
import os
import time

logos = {
    'APEDA': 'Agricultural_and_Processed_Food_Products_Export_Development_Authority',
    'BRCGS': 'British_Retail_Consortium',
    'FSSC 22000': 'FSSC_22000',
    'ISO 22000': 'ISO_22000',
    'ISO 14001': 'ISO_14000',
    'GLOBAL GAP': 'GlobalGAP',
    'Halal': 'Halal',
    'Kosher': 'Kosher_foods',
    'SGF': 'SGF_International',
    'AQA': 'AQA'
}

os.makedirs('frontend/public/assets/images/certs', exist_ok=True)

for name, page in logos.items():
    try:
        url = f"https://en.wikipedia.org/w/api.php?action=query&titles={page}&prop=pageimages&format=json&pithumbsize=500"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req).read()
        data = json.loads(response)
        
        pages = data['query']['pages']
        page_id = list(pages.keys())[0]
        
        if 'thumbnail' in pages[page_id]:
            img_url = pages[page_id]['thumbnail']['source']
            print(f"Downloading {name} from {img_url}")
            
            filename = f"frontend/public/assets/images/certs/{name.replace(' ', '_').replace('.', '')}.png"
            req_img = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            img_data = urllib.request.urlopen(req_img).read()
            with open(filename, 'wb') as f:
                f.write(img_data)
            print(f"Success for {name}")
        else:
            print(f"No image found for {name}")
    except Exception as e:
        print(f"Error for {name}: {e}")
    time.sleep(1)
