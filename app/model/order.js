module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Order = app.model.define('Order', { // 模型json结构
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
      unique: true,
      primaryKey: true,
      comment: '订单ID',
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
    payTime: {
      type: DATE,
      allowNull: true,
      unique: false,
      comment: '支付时间',
    },
    price: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      comment: '交易金额',
    },
    refundPrice: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      unique: false,
      comment: '已退款金额',
    },
    status: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      unique: false,
      comment: '状态(1待支付,2已支付，3支付失败，4-已退费，5-退费中, 6已关闭(取消支付), 7 部分退费)',
    },
    operatorId: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      comment: '操作用户编号',
    },
    description: {
      type: STRING(1024),
      allowNull: true,
      unique: false,
      comment: '订单详情',
    },
  }, {
    comment: '交易记录表',
    timestamps: true,
    indexes: [{
      unique: true,
      fields: [ 'tradeId' ],
    }],
    charset: 'utf8',
    collate: 'utf8_general_ci',
    freezeTableName: true,
    tableName: 'hau_order',
  });
  Order.associate = function() {
    app.model.Order.hasMany(app.model.Refund, { foreignKey: 'orderId' });
    app.model.Refund.belongsTo(app.model.Order, { foreignKey: 'orderId' });
  };
  return Order;
};
