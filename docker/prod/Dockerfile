FROM node:12.9-buster-slim 

RUN apt-get update
RUN apt-get install -y iproute2 iproute2-doc inetutils-ping
RUN apt-get install -y git

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


WORKDIR /usr/local/bin
ENV PATH /usr/local/bin:$PATH
COPY ./docker_scripts/docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

WORKDIR /usr/app/hk5demandsweb
ENTRYPOINT ["docker-entrypoint.sh"]