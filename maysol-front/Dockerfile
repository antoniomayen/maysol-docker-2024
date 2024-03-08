# Utiliza una imagen base oficial de Node
FROM node:10.23

# Crea un directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración del proyecto
COPY package*.json ./
#COPY .env* ./

# Instala las dependencias del proyecto, incluyendo las de desarrollo para testing y linting
RUN npm install

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Construye la aplicación para producción
RUN npm run build

# El puerto en el que se expone la aplicación
EXPOSE 8080

# Inicia la aplicación
CMD ["npm", "run", "dev"]
