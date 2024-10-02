# Dockerfile
FROM python:3.9

# Çalışma dizini oluştur
WORKDIR /app

# Gereksinimleri kopyala ve yükle
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodunu kopyala
COPY . .

# Uvicorn ile uygulamayı çalıştır
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]
