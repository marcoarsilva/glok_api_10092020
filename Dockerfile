FROM node:latest as node
WORKDIR /
COPY . .
RUN npm install
EXPOSE 5555
CMD [ "npm", "start" ]
