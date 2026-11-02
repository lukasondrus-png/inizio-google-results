
# Použijeme Node.js 24
FROM node:24-alpine

# Pracovní adresář uvnitř kontejneru
WORKDIR /app

# Zkopírujeme informace o závislostech
COPY package.json package-lock.json ./

# Nainstalujeme pouze produkční závislosti
RUN npm ci --omit=dev

# Zkopírujeme zdrojový kód aplikace
COPY server.js searchResults.js ./
COPY public ./public

# Produkční prostředí
ENV NODE_ENV=production

# Port naší aplikace
EXPOSE 3000

# Spustíme aplikaci pod neprivilegovaným uživatelem
USER node

# Spuštění serveru
CMD ["npm", "start"]
