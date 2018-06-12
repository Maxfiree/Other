const js2xmlparser = require('js2xmlparser');
const xml2js = require('xml2js');
const soap = require('strong-soap').soap;

module.exports = app => {
  class KingdeeCommon {
    constructor() {
      const config = app.config.datasource.KingdeeCommon ? app.config.datasource.KingdeeCommon : {};
      Object.assign(this, {
        url: config.url, channelCode: config.channelCode, secret: config.secret,
      });
    }

    async prepareClient() {
      if (app.locals.kingdeeCommonClient) return app.locals.kingdeeCommonClient;
      return await new Promise((resolve, reject) => {
        soap.createClient(this.url, {}, function(err, client) {
          if (err) { reject(err); return; }
          app.locals.kingdeeCommonClient = client;
          resolve(client);
        });
      });
    }

    static getType() {
      return 'datasource';
    }

    static parseString(data) {
      return new Promise(function(resolve, reject) {
        xml2js.parseString(data, { explicitArray: false }, function(err, result) {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    }

    async request(path, data) {
      const req = js2xmlparser.parse('req', data, { declaration: { encoding: 'utf-8' }, format: { doubleQuotes: true } });
      const client = await this.prepareClient();
      try {
        return await new Promise((resolve, reject) => {
          client[path]({ xmlParam: req }, async function(err, result) {
            app.getLogger('datasourceLogger').info('[kingdee-common-datasource]', path + ' req: '
            + req.replace(/[\r\n]/g, ''));
            if (err) {
              reject(err);
              return;
            }
            app.getLogger('datasourceLogger').info('[kingdee-common-datasource]', path + ' res: '
            + result[path + 'Result'].replace(/[\r\n]/g, ''));
            const response = await KingdeeCommon.parseString(result[path + 'Result']);
            resolve(response.res);
          });
        });
      } catch (e) {
        app.getLogger('datasourceLogger').error('[kingdee-common-datasource]', e);
        throw e;
      }
    }
  }
  return KingdeeCommon;
};
