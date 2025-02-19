FROM  node:20-alpine

WORKDIR /backend


COPY package.json package-lock.json  ./

RUN npm install

COPY . .

RUN npx prisma generate 

EXPOSE 8080

CMD ["npm", "run", "dev"]