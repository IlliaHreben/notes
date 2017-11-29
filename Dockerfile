FROM node:8-alpine
RUN mkdir /notes
WORKDIR /notes
COPY client client
COPY server server
WORKDIR server
RUN npm install
CMD npm start
