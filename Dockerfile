FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN npm install
RUN npm install -g typescript@4.4.2
RUN npm run build
# If you are building your code for production
# RUN npm install --only=production
EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]
