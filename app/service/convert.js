const path = require('path');
const { exec } = require('child_process');

module.exports = app => {
  class Convert extends app.Service {
    async html2pdf(url, filename, option) {
      option = option ? option : '';
      const resFilename = path.join(app.config.static.dir, 'pdf', filename);
      return new Promise((resolve, reject) => {
        exec(`wkhtmltopdf ${option} "${url}" ${resFilename}`, (error, stdout, stderr) => {
          if (error) {
            app.logger.info('[service-convert]', 'converting ' + url + ' status : ' + error);
            app.logger.error('[service-convert]', stderr);
            reject(new Error('convert fail'));
          }
          app.logger.info('[service-convert]', 'converting ' + url + ' status : finish');
          resolve({ filename: resFilename });
        });
      });
    }
  }
  return Convert;
};
