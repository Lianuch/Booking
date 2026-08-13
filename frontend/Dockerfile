FROM node:latest

WORKDIR /app

COPY package*.json yarn.lock ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5000"]