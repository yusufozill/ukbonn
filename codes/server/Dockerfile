# Node.js image'ını kullan
FROM node:16

# Çalışma dizinini oluştur ve belirle
WORKDIR /usr/src/app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Gerekli bağımlılıkları yükle
RUN npm install

# Proje dosyalarını kopyala
COPY . .

# Sunucuyu başlatmak için komut
CMD [ "node", "index.js" ]

# Uygulama için dinlenecek port
EXPOSE 3000
