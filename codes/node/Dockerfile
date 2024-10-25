# Dockerfile

# Node.js'in resmi LTS sürümünü temel al
FROM node:18

# Çalışma dizinini oluştur
WORKDIR /usr/src/app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Uygulama kodunu kopyala
COPY . .

# Sunucu portunu aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "index.js"]
