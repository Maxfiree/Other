const path = require('path');
const { UniqueConstraintError } = require('sequelize');

module.exports = app => {
  const config = {};

  // 'mobileStaticHandler', 'staticHandler'
  config.middleware = [ 'restc', 'access', 'notFoundHandler', 'saveSession' ];

  config.onerror = {
    all(err, ctx) {
      if (err instanceof UniqueConstraintError) {
        err.status = 403; err.code = 1009;
      }
      if (err.status && !err.code) {
        switch (err.status) {
          case 400: err.code = 1001; break;
          case 401: err.code = 1002; break;
          case 500: err.code = 1000; break;
          default: break;
        }
      }
      if (err.status) {
        ctx.body = { error: err.code, message: err.message };
      } else {
        ctx.body = { error: 1000, message: err.message };
      }
      if (ctx.app.config.env === 'prod') {
        // 生产环境时错误的详细错误内容不返回给客户端，因为可能包含敏感信息
        ctx.body.message = ctx.app.config.dicts.errorCode[ctx.body.error];
      }
    },
    accepts() {
      return 'json';
    },
  };

  config.static = {
    dir: path.join(app.baseDir, 'public'),
  };

  config.access = {
    ignorePaths: [
      '/api/v1/base/authorize/*',
      '/api/v1/iu/user/*',
      '/api/v1/ku/devices/*',
      '/api/v1/ku/devices',
      '/home',
    ],
  };

  config.authorize = {
    expiresIn: 7200,
    refreshTokenExpireTime: 30 * 24 * 60 * 60, // 1 month
  };

  config.security = {
    domainWhiteList: [ 'http://localhost:3000', 'null' ],
    csrf: {
      enable: false,
    },
  };

  config.keys = app.name + '_1505574041727_9916';

  config.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(app.baseDir, 'logs'),
  };

  config.customLogger = {
    datasourceLogger: {
      file: path.join(app.baseDir, 'logs/datasource.log'),
    },
  };

  config.development = { ignoreDirs: [ 'app/web-mobile', 'app/web' ] };

  // config.session = {
  //   key: 'WIRED_EGG_SESSION',
  //   maxAge: 24 * 3600 * 1000, // 1 天
  //   httpOnly: true,
  //   encrypt: true,
  // };
  config.session = {
    enable: false,
  };

  config.i18n = {
    defaultLocale: 'zh-CN',
    queryField: 'locale',
    cookieField: 'locale',
  };

  config.passportJWT = {
    jwtKey: 'wiredmed_egg',
    options: {
      algorithm: 'HS256',
      expiresIn: 24 * 60 * 60, // 1 天

    },
  };

  config.joi = {
    options: {
      // allowUnknown: true,
    },
    locale: {
      'zh-CN': {},
    },
  };

  config.cors = {
    credentials: true,
  };

  config.graphql = {
    router: '/graphql',
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
    // 是否加载开发者工具 graphiql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
    graphiql: true,
    // graphQL 路由前的拦截器
    // async onPreGraphQL(ctx, next) {},
    // 开发工具 graphiQL 路由前的拦截器，建议用于做权限操作(如只提供开发者使用)
    // async onPreGraphiQL(ctx, next) {},
  };

  config.datasource = {
    KingdeeCommon: {
      // mock: true,
      hospitalId: '100251001',
      url: 'http://200.100.100.240:5566/Kingdee.SelfService.Service.KDYHISService.svc?wsdl',
      oprId: '012',
      channelCode: '1507885448002',
      secret: '196862B9EEDB4DB08B66D9F2D3FD7E2E',
    },
  };

  config.dicts = {
    errorCode: require('./dicts/error-code'),
  };

  config.cache = {
    default: 'memory',
    stores: {
      memory: {
        driver: 'memory',
        max: 100,
        ttl: 0,
      },
    },
  };

  config.upload = {
    default: 'minio',
    minio: {
      endPoint: 'dev.lbsmed.com',
      port: 8200,
      secure: false,
      accessKey: 'devops',
      secretKey: 'Wiredmed@2017..',
      bucket: 'wiredpay',
    },
  };

  config.servicesInfo = {
    hau: {
      host: '127.0.0.1',
      port: 7002,
    },
    iu: {
      host: '127.0.0.1',
      port: 7003,
    },
    pu: {
      host: '127.0.0.1',
      port: 7004,
    },
    ku: {
      host: '127.0.0.1',
      port: 7005,
    },
    gateway: {
      host: '127.0.0.1',
      port: 7001,
    },
  };

  return config;
};
