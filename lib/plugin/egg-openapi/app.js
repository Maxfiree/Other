const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const openapiSequelize = require('./lib/openapi-sequelize');

module.exports = app => {
  const swaggerSpec = yaml.safeLoad(fs.readFileSync(path.join(app.baseDir, 'config/openapi.yaml'), 'utf8'));

  console.log(openapiSequelize.generate(swaggerSpec.components.schemas.User));
  // const MyModel = sequelize.define('MyModel', swaggerSequelize.generate(swaggerSpec.definitions.MyModel));

  // ... do stuff with MyModel e.g. to setup your tables:
};

