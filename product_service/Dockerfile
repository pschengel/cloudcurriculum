# FROM node:16

# RUN npm i -g @nestjs/cli

# COPY package.json .

# RUN npm install

# COPY . .

# EXPOSE 4002

# CMD ["nest", "start"]

FROM node:16

# WORKDIR /usr/src/app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4002

# CMD ["node", "dist/main.js"]

CMD ["npm", "run", "start:prod"]