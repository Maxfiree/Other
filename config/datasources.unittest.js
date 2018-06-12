exports.sequelize = {
  dialect: 'postgres', // support: mysql, mariadb, postgres, mssql
  database: 'test',
  host: '192.168.1.5',
  port: '3432',
  username: 'postgres',
  password: 'wiredmed12345678',
  pool: {
    max: 20,
    min: 5,
    idle: 4000,
  },
};
