exports.sequelize = {
  dialect: 'postgres', // support: mysql, mariadb, postgres, mssql
  database: 'wiredpay',
  host: 'db.lbsmed.com',
  port: '9103',
  username: 'postgres',
  password: 'pg@Wiredmed2017',
  pool: {
    max: 20,
    min: 5,
    idle: 4000,
  },
};

