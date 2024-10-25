# Python 3.9 imajını kullan
FROM python:3.9-slim

# Çalışma dizinini oluştur
WORKDIR /app

# Gerekli dosyaları kopyala
COPY . .

# Gerekli paketleri yükle
RUN pip install -r requirements.txt

# Flask'i başlat
CMD ["python", "app.py"]