FROM mhart/alpine-node:8
RUN mkdir /notes
WORKDIR /notes
COPY client client
COPY server server
WORKDIR server
RUN npm install
CMD npm run start:prod
