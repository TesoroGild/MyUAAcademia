FROM node:lts

WORKDIR /MyUAAcademia

COPY ./frontend .

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "dev"]