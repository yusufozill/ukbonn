# Python 3.9 imajını kullan
FROM python:3.9-slim

# Çalışma dizinini oluştur
WORKDIR /app

# Gerekli dosyaları kopyala
COPY requirements.txt requirements.txt
COPY app.py app.py
COPY index.html index.html
COPY word.html word.html

# Gerekli paketleri yükle
RUN pip install -r requirements.txt

# Flask'i başlat
CMD ["python", "app.py"]
