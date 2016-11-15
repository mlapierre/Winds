# Start always from Node 6.9 LTS
FROM node:boron

RUN curl https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y yarn

# Create the app user and home directory
ENV APP_CONTENT /home/app
RUN groupadd app && useradd --create-home --home-dir "$APP_CONTENT" -g app app \
    && rm -Rf "$APP_CONTENT" \
    && mkdir -p "$APP_CONTENT" \
    && chown -R app:app "$APP_CONTENT"
WORKDIR $APP_CONTENT

# install global dependencies
RUN npm install -g sails pm2

COPY package.json "$APP_CONTENT"/package.json
RUN git config --global url."https://".insteadOf git:// && \
    yarn install
COPY . "$APP_CONTENT"

VOLUME [ "$APP_CONTENT" ]

EXPOSE 1337
CMD ["pm2-docker", "process.json"]
