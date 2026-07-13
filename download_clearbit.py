import urllib.request
import os

logos = {
    'APEDA.png': 'https://logo.clearbit.com/apeda.gov.in',
    'BRCGS.png': 'https://logo.clearbit.com/brcgs.com',
    'FSSC_22000.png': 'https://logo.clearbit.com/fssc.com',
    'ISO_22000.png': 'https://logo.clearbit.com/iso.org',
    'ISO_14001.png': 'https://logo.clearbit.com/iso.org',
    'GLOBALGAP.png': 'https://logo.clearbit.com/globalgap.org',
    'Halal.png': 'https://logo.clearbit.com/halalcertification.ie',
    'Kosher.png': 'https://logo.clearbit.com/oukosher.org',
    'SGF.png': 'https://logo.clearbit.com/sgf.org',
    'AQA.png': 'https://logo.clearbit.com/aqa.org.uk'
}

for name, url in logos.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        img_data = urllib.request.urlopen(req).read()
        with open(f"frontend/public/assets/images/certs/{name}", 'wb') as f:
            f.write(img_data)
        print(f"Success for {name}")
    except Exception as e:
        print(f"Error for {name}: {e}")
