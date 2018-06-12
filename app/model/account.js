module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Account = app.model.define('account', { // 模型json结构
    balance: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      defaultValue: 0,
      comment: '余额 分',
    },
    type: {
      type: INTEGER,
      allowNull: true,
      defaultValue: 0,
      unique: false,
      comment: '类型',
    },
    description: {
      type: STRING(1024),
      allowNull: true,
      unique: false,
      comment: '账户描述',
    },
    status: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      unique: false,
      comment: '状态',
    },
    patientGroupId: {
      type: INTEGER,
      allowNull: true,
      unique: false,
      comment: '患者组Id',
    },
    patientId: {
      type: INTEGER,
      allowNull: true,
      unique: false,
      comment: '患者Id',
    },
  }, {
    comment: '预存金账户表',
    timestamps: true,
    indexes: [],
    charset: 'utf8',
    collate: 'utf8_general_ci',
    freezeTableName: true,
    tableName: 'hau_account',
  });
  Account.associate = function() {
    app.model.Account.hasMany(app.model.Order, { as: ' Expenditure', foreignKey: 'fromId' });
    app.model.Account.hasMany(app.model.Order, { as: ' Income', foreignKey: 'toId' });
  };
  return Account;
};
