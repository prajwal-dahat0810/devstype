FROM node:20-alpine

WORKDIR WORKDIR /app

COPY . . 
RUN cd backend && npx prisma generate && npx prisma migrate dev

RUN cd backend && npm install && npm run dev

RUN cd frontend && npm install && npm run build

RUN 
