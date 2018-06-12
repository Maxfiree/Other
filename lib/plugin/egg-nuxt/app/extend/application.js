const { Nuxt } = require('nuxt');
const NUXT = Symbol('Application#nuxt');
module.exports = {
  get nuxt() {
    if (!this[NUXT]) {
      this[NUXT] = new Nuxt(this.config.nuxt.webConfig);
    }
    return this[NUXT];
  },
};

