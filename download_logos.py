import urllib.request
import urllib.parse
import json
import re
import os

logos = ['FSSAI logo', 'APEDA logo', 'BRCGS logo', 'FSSC 22000 logo', 'ISO 22000 logo', 'ISO 14001 logo', 'GLOBALG.A.P. logo', 'Halal certification logo', 'Kosher certification logo', 'SGF logo', 'AQA certification logo']

os.makedirs('frontend/public/assets/images/certs', exist_ok=True)

for logo in logos:
    print(f"Searching for {logo}...")
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(logo + ' transparent png')}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # DuckDuckGo HTML doesn't have image search results easily extractable in the same way, let's use Yahoo Image Search or similar
        # Actually, let's use Wikipedia API to search for the logo
    except Exception as e:
        print(f"Failed to fetch {logo}: {e}")

