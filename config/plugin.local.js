const path = require('path');


exports.nuxtMobile = {
  enable: false,
  path: path.join(__dirname, '../lib/plugin/egg-nuxt-mobile'),
};

exports.nuxt = {
  enable: false,
  path: path.join(__dirname, '../lib/plugin/egg-nuxt'),
};
