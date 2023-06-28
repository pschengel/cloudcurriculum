FROM node:16

# WORKDIR /usr/src/app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4001

# CMD ["node", "dist/main.js"]

CMD ["npm", "run", "start:prod"]