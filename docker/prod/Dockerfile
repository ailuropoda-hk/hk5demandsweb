FROM node:12.9-buster-slim 

RUN apt-get update
RUN apt-get install -y iproute2 iproute2-doc inetutils-ping
RUN apt-get install -y git

RUN npm install -g babel-cli
RUN npm install babel-plugin-transform-react-jsx
RUN npm install babel-preset-babili
RUN npm install -g html-minifier

WORKDIR /usr/app/hk5demandsweb
COPY ./package.json .
COPY ./package-lock.json .
COPY ./yarn.lock .
COPY ./bower.json .

RUN yarn install
RUN npm install -g bower
RUN bower --allow-root install

COPY ./bin ./bin
COPY ./controllers ./controllers
COPY ./modules ./modules
COPY ./public ./public
COPY ./views ./views
COPY ./app.js .

COPY ./docker_scripts/minify_js.sh /usr/local/bin/minify_js.sh
RUN chmod +x /usr/local/bin/minify_js.sh
RUN minify_js.sh ./public/js/*.js
# RUN minify_js.sh ./public/js/*/*.js

WORKDIR /usr/local/bin
ENV PATH /usr/local/bin:$PATH
COPY ./docker_scripts/docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

WORKDIR /usr/app/hk5demandsweb
ENTRYPOINT ["docker-entrypoint.sh"]