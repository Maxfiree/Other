'use strict';

module.exports = appInfo => {
  const config = exports = {
    security: {
      csrf: false
    },
    
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1532419676673_3291';

  // add your config here
  config.middleware = [];

  return config;
};


// module.exports = {
//   security: {
//     csrf: false
//   },
// };
