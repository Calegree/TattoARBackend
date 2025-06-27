# Usa una imagen ligera de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia archivos de dependencias y los instala
COPY package*.json ./
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto de tu backend
EXPOSE 4000

# Comando para iniciar la app
CMD ["node", "index.js"]