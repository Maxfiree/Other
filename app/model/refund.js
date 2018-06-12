module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Refund = app.model.define('Refund', { // 模型json结构
    fromId: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      comment: '支出账号编号',
    },
    toId: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      comment: '收款账号编号',
    },
    orderId: {
      type: STRING(36),
      allowNull: false,
      unique: false,
      comment: '订单ID',
    },
    refundId: {
      type: STRING(36),
      allowNull: false,
      unique: true,
      primaryKey: true,
      comment: '退款订单ID',
    },
    tradeId: {
      type: STRING(36),
      allowNull: true,
      unique: true,
      comment: '渠道订单ID',
    },
    type: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      unique: false,
      comment: '交易类型', // 1挂号费2诊疗费
    },
    refundTime: {
      type: DATE,
      allowNull: true,
      unique: false,
      comment: '退款时间',
    },
    price: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      comment: '退款金额',
    },
    operatorId: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      comment: '操作用户编号',
    },
    status: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      unique: false,
      comment: '状态',
    },
    description: {
      type: STRING(1024),
      allowNull: true,
      unique: false,
      comment: '订单详情',
    },
  }, {
    comment: '退款记录表',
    timestamps: true,
    indexes: [{
      unique: true,
      fields: [ 'tradeId' ],
    }],
    charset: 'utf8',
    collate: 'utf8_general_ci',
    freezeTableName: true,
    tableName: 'hau_refund',
  });
  return Refund;
};
