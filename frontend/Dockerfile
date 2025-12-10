FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN rm -rf package-lock.json && npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
