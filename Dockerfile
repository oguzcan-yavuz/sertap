FROM node:10.4
COPY . /sertap
WORKDIR /sertap
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]

