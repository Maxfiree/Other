const path = require('path');

exports.static = true;

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.passportJWT = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-passport-jwt'),
};

exports.passportBearer = {
  enable: false,
  path: path.join(__dirname, '../lib/plugin/egg-passport-bearer'),
};

exports.passport = {
  enable: true,
  package: 'egg-passport',
};

exports.datasource = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-datasource'),
};

exports.repository = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-repository'),
};

exports.joi = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-joi'),
};

exports.openapi = {
  enable: false,
  path: path.join(__dirname, '../lib/plugin/egg-openapi'),
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.graphql = {
  enable: false,
  package: 'egg-graphql',
};

exports.connector = {
  enable: false,
  path: path.join(__dirname, '../lib/plugin/egg-connector'),
};

exports.cache = {
  enable: true,
  package: 'egg-cache',
};
