const createError = require('http-errors');
const moment = require('moment');

module.exports = app => {
  const uuidv4 = require('uuid/v4');
  const bcrypt = require('bcrypt');

  class Authorize extends app.Service {
    async token(username, password) {
      const { ctx } = this;
      const user = await ctx.repository.User.findOne({ where: { username } });
      if (user && user.status === 1) {
        if (await bcrypt.compare(password, user.password)) {
          await this.updateToken(user);
          return { accessToken: user.accessToken, refreshToken: user.refreshToken, expiresIn: app.config.authorize.expiresIn };
        }
        throw createError(401, null, { code: 1004 });
      }
      throw createError(401, null, { code: 1003 });
    }

    async refresh(refreshToken) {
      const { ctx } = this;
      const user = await ctx.repository.User.findOne({ where: { refreshToken } });
      if (!user || ((new Date()).getTime() - user.expireTime > app.config.authorize.refreshTokenExpireTime * 1000)) {
        throw createError(401, null, { code: 1002 });
      }
      await this.updateToken(user);
      return { accessToken: user.accessToken, refreshToken: user.refreshToken, expiresIn: app.config.authorize.expiresIn };
    }

    async revoke(id) {
      const { ctx } = this;
      const user = await ctx.repository.User.findById(id);
      if (user && user.status === 1) {
        await this.updateToken(user);
      } else {
        throw createError(403, 'revoke fail', { code: 1006 });
      }
    }

    async updateToken(user) {
      await app.cache.set(`userToken_${user.accessToken}`, null);
      user.accessToken = uuidv4();
      user.refreshToken = uuidv4();
      user.lastLoginTime = user.loginTime ? user.loginTime : new Date();
      user.loginTime = moment().toISOString();
      user.expireTime = (new Date()).getTime() + app.config.authorize.expiresIn * 1000;
      await user.save();
    }

  }
  return Authorize;
};
