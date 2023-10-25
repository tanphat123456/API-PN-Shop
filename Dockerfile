FROM node:16

# Create app directory , this is in our image directory ( Docker images )
WORKDIR /pn-shop/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080

RUN npm run build

CMD [ "node", "dist/main" ]