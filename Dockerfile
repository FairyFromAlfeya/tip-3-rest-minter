FROM node:20.14.0-alpine

RUN apk add --no-cache make python3 git

WORKDIR /app

# Sources
COPY src /app/src

# Install
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

# Config
COPY tsconfig.json /app/tsconfig.json
COPY tsconfig.build.json /app/tsconfig.build.json

# Build
RUN yarn
RUN yarn build

# Clean
RUN rm -rf /app/yarn.lock
RUN rm -rf /app/tsconfig.json
RUN rm -rf /app/tsconfig.build.json
RUN rm -rf /app/src

EXPOSE 3000

CMD yarn start:prod
