FROM node:18-alpine
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci --only=production || npm install --production

# copy source
COPY . .

CMD ["node", "src/index.js"]
