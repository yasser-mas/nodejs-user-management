FROM node:8-alpine

#ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package*.json",".env" , "./"]
#RUN npm install --production --silent && mv node_modules ../
RUN npm install --production --silent 
COPY . .
EXPOSE 8082
CMD npm start