const { Nuxt } = require('nuxt');
const NUXT = Symbol('Application#nuxtMobile');
module.exports = {
  get nuxtMobile() {
    if (!this[NUXT]) {
      this[NUXT] = new Nuxt(this.config.nuxtMobile.webConfig);
    }
    return this[NUXT];
  },
};

