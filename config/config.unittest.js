const path = require('path');

const datasources = require('./datasources.unittest');
module.exports = app => {
  const exports = {};

  exports.static = {
    maxAge: 0, // maxAge 缓存，默认 1 年
  };

  exports.sequelize = datasources.sequelize;
  exports.logger = {
    consoleLevel: 'DEBUG',
    dir: path.join(app.baseDir, 'logs/test'),
  };
  exports.customLogger = {
    datasourceLogger: {
      file: path.join(app.baseDir, 'logs/test/datasource.log'),
    },
  };
  exports.rsa = {
    privateKey: '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEowIBAAKCAQEAo0MfjagSHAzfjUBS5iGyBnrxBbAKcjReFiubIoSJqCsAZKH3\n' +
    '+hcKNqpmQ7iQu/5FxJfdYDZXmQfwYq/FgSj49nmw2Qfa6HO71d3YZfdBF9HedHr3\n' +
    'v6eXIR8wlivXqisfcSy7AcYDV9LbotW4uuZzmEanuVLQBKnYD+VtjqCUQiNkm9Ed\n' +
    'V65eqlILZ5VXJDg2gQ/+Pu0duY1bw1FebprMCwn2RtV6Jn6Vnyhg1hHfQuzWEFVO\n' +
    'vd7rRYidcYHZ7lE4g5bD7juB5yRGT45bI+xPqxa+o5F9LeaDGb+DpQXgZyhx0j6U\n' +
    'pLxRIxYQI7yVlBqcuW7dQV5ZAuY+wUE9dp1IYQIDAQABAoIBACWG0EHnWAJKkzgM\n' +
    'iQGMzTbgG3aLOFt33giKjWYpwNp+x+BZun4pvZdDI659RgdwMuk1XxU2aHwsbvzA\n' +
    'Gk3N9SvyXMwGGjNEJvDJxWvqoXOwMcnkWf4br4lVef2Kpk/fCaMh/PozYaFWPlX3\n' +
    'eja7seZWl0bp2ha4U4mT2tLl5i4tReQv5lSc1SvStb/0x92mN8gTvsyBqQOMMmZv\n' +
    '6j0hDQ3z0fYAkJR002W/DsDgNqoxnUPFpgKyBm+DcSrLNNEFava3jNVw3VLPaGtu\n' +
    'I6Mo2ozKFvZs0Ax5vklWHTy6imwdZrSfH95nrdnN/x7w5qDAMecNd0SQY/THuy1P\n' +
    '6gGtiIECgYEA5PzcFRAaWuAZEoGdR0Bxq5UjvLjvVD63Qci7hp33hrM41kcWfUae\n' +
    'VQqPdTF6IHQzAmLjRbKQ654KgSf0XsqiT0iryXEzZeHpx0HuvOum7QRsGCbHNVXG\n' +
    'SXMTl8PvmQm09toJB2CUZHzZuLpxteTu/Ld6s6sP+UZ98nLPAhAKmF0CgYEAtoVv\n' +
    'e8Nguuhn/EB4inpxwGFTmXsbd4wmWUnOhihFj9zDqsa9G8laEaID1tfdXHjvRATz\n' +
    'KR+PpRVPmliRs8KTG97VtZx52vjpjJmuC4EQz3QmKwh8Z8V4RqZ1+OHoEa+0sKMA\n' +
    '3JGoMSUDxOfdVjUauMOP24P1UNRFxER4FvAqX9UCgYBo2wkEdB09Y8TXXpbgm7fx\n' +
    'dBerQZwGHbnY28xTNl60RblPFbpMn1u9YVqTtZZQ6iS5gQLFVaFa40G4Js2V4oA0\n' +
    'gfh4A+gfTTW50o054UbM3euJm6g42hA0bgeYxVYf4/wD1Y+w2x7YbPtdxbJwMmbl\n' +
    'PjdnsntcEFV4Ae6c6S+Q2QKBgDXGmLMhPGW1RbXnlNxP+SXSRxxITi5px361JTkX\n' +
    'sm8Rf0DYryz5pSTe1Dy/ewPcyboDr1TlbKAZ6Es0XzFUWZ1ziQmqIajnf4AiY0oW\n' +
    'a8qDkR9Kr8SvRKGkN8vtWz+iwhzs2bsi2ygnnLWuDuNwYAAh9keZ2HRJJokOF0fC\n' +
    '2OlFAoGBAL+uHnbEqIB4V/YTIEZFDFZzMx0i6PCu9WCXi48oaZinUe1LrCkyekZQ\n' +
    '2xvt8q6ZVZCIoF+k9yeGa2L27cSElxGo0/KX0sYiIKYLkyeAfFOS7Rm+SPahqX6C\n' +
    'bUnfruL5i1h+nmcJN3xomUpDRdMpHbtb9p6C5GIZzo5uodgYTuVe\n' +
    '-----END RSA PRIVATE KEY-----',
    publicKey: '-----BEGIN RSA PUBLIC KEY-----\n' +
    'MIIBCgKCAQEAo0MfjagSHAzfjUBS5iGyBnrxBbAKcjReFiubIoSJqCsAZKH3+hcK\n' +
    'NqpmQ7iQu/5FxJfdYDZXmQfwYq/FgSj49nmw2Qfa6HO71d3YZfdBF9HedHr3v6eX\n' +
    'IR8wlivXqisfcSy7AcYDV9LbotW4uuZzmEanuVLQBKnYD+VtjqCUQiNkm9EdV65e\n' +
    'qlILZ5VXJDg2gQ/+Pu0duY1bw1FebprMCwn2RtV6Jn6Vnyhg1hHfQuzWEFVOvd7r\n' +
    'RYidcYHZ7lE4g5bD7juB5yRGT45bI+xPqxa+o5F9LeaDGb+DpQXgZyhx0j6UpLxR\n' +
    'IxYQI7yVlBqcuW7dQV5ZAuY+wUE9dp1IYQIDAQAB\n' +
    '-----END RSA PUBLIC KEY-----',
  };
  return exports;
};
