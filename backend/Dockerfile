FROM node:22-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y openssl
RUN apt-get update && apt-get install -y libssl1.1 || true


COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
