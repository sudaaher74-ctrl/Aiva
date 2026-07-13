import os
import urllib.request
from duckduckgo_search import DDGS
import time

logos = ['FSSAI', 'APEDA', 'BRCGS', 'FSSC 22000', 'ISO 22000', 'ISO 14001', 'GLOBALG.A.P.', 'Halal certification', 'Kosher certification', 'SGF safe green food', 'AQA certification']

os.makedirs('frontend/public/assets/images/certs', exist_ok=True)
ddgs = DDGS()

for logo in logos:
    filename = f"frontend/public/assets/images/certs/{logo.replace(' ', '_').replace('.', '')}.png"
    if os.path.exists(filename):
        continue
    
    print(f"Searching for {logo} logo...")
    try:
        results = ddgs.images(f"{logo} logo transparent", max_results=3)
        for res in results:
            url = res['image']
            print(f"Downloading from {url}")
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=10) as response, open(filename, 'wb') as out_file:
                    out_file.write(response.read())
                print(f"Success for {logo}")
                break # downloaded successfully
            except Exception as e:
                print(f"Failed to download from {url}: {e}")
                continue
    except Exception as e:
        print(f"Search failed for {logo}: {e}")
    time.sleep(1)

