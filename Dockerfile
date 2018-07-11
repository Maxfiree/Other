FROM ccr.ccs.tencentyun.com/wiredmed-research/nodejs:8.11.3
LABEL maintainer="relzhong@wiredmed.com"

RUN apt install vim wget libXext* libXrender* -y
RUN wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz && tar -xvf wkhtmltox-0.12.4_linux-generic-amd64.tar.xz && ln wkhtmltox/bin/wkhtmltopdf  /usr/bin/wkhtmltopdf

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm config set loglevel warn
RUN yarn install
ENV NODE_ENV production
RUN chmod +x /usr/src/app/script/docker-entrypoint.sh
ENTRYPOINT ["script/docker-entrypoint.sh"]

# replace this with your application's default port
EXPOSE 7001
