FROM node:17-bullseye-slim
WORKDIR /usr/src/app

RUN apt update -y
RUN apt install curl -y
RUN npm install -g n
RUN n latest

COPY ./entrypoint.sh .
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
