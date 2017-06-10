FROM node:boron

RUN mkdir /app
WORKDIR /app

COPY app/ /app/
RUN npm install

EXPOSE 3000
