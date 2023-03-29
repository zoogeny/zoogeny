# * uses the node:alpine image
FROM node:alpine as build

# * sets the working directory to /home/node/app
WORKDIR /home/node/app

# * copie files from the host to the container
COPY ./api ./api
COPY ./shared ./shared

# * switch to the app directory
WORKDIR /home/node/app/api

# * installs the dependencies
RUN npm install

# * builds the web-server directory into the container
RUN npm run build

FROM node:alpine

WORKDIR /home/node/app

COPY --from=build --chown=node:node /home/node/app/api/dist dist
COPY --from=build --chown=node:node /home/node/app/api/node_modules node_modules
COPY --from=build --chown=node:node /home/node/app/api/package.json package.json

# * sets the environment variable to production
ENV NODE_ENV=production

# * changes the user to the node user
USER node

# * runs the server as the default command
CMD ["npm", "start"]

# * exposes port 3000
EXPOSE 3000
