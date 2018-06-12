#!/bin/bash

npm run nuxt-generate && cp -r app/web/dist/ dist && cp -r app/web-mobile/dist-mobile/ dist-mobile && npm run start-prod