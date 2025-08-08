# Simple container for running the WishWander app
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install -g expo-cli && npm install --production
COPY . .
EXPOSE 8081
CMD ["npx", "expo", "start", "--tunnel"]
