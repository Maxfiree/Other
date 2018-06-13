module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Register = app.model.define('Register', { // 模型json结构
    regId: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '挂号编号 (预约挂号预约号，当天挂号his锁号)',
    },
    patientId: {
      type: STRING(36),
      allowNull: false,
      unique: false,
      comment: '病人编号',
    },
    outpatientId: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '门诊号',
    },
    receiptId: {
      type: STRING(36),
      allowNull: true,
      unique: true,
      comment: '收据编号',
    },
    orderId: {
      type: STRING(36),
      allowNull: true,
      unique: true,
      comment: '支付流水号',
    },
    cancelSerialId: {
      type: STRING(36),
      allowNull: true,
      unique: true,
      comment: '取消单号',
    },
    doctorId: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '医生编号',
    },
    doctorName: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '医生名称',
    },
    deptId: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '科室编号',
    },
    deptName: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '科室名称',
    },
    location: {
      type: STRING,
      allowNull: true,
      unique: false,
      comment: '就诊位置',
    },
    queueNo: {
      type: STRING(5),
      allowNull: true,
      unique: false,
      comment: '排队号',
    },
    waitingCount: {
      type: STRING(5),
      allowNull: true,
      unique: false,
      comment: '前面就诊人数',
    },
    visitTime: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '就诊时间',
    },
    takeTime: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '取号时间',
    },
    regFee: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      defaultValue: 0,
      comment: '挂号费',
    },
    treatFee: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      defaultValue: 0,
      comment: '诊疗费',
    },
    discountFee: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      defaultValue: 0,
      comment: '折扣费用',
    },
    registerTypeId: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '可选挂号类型AB号',
    },
    scheduleId: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '排班编号',
    },
    periodId: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '分时编号',
    },
    regType: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      defaultValue: 1,
      comment: '1预约挂号，2当天挂号',
    },
    cancelable: {
      type: INTEGER,
      allowNull: true,
      unique: false,
      defaultValue: 2,
      comment: '1不可以取消。2可以取消',
    },
    barcode: {
      type: STRING(1024),
      allowNull: true,
      unique: false,
      comment: '条形码',
    },
    description: {
      type: STRING(1024),
      allowNull: true,
      unique: false,
      comment: '描述',
    },
    status: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      unique: false,
      comment: '1未取号，2 已取号，3已退费，4已就诊，5已取消，6已报道，7已过期（爽约），8缴费超时，9未支付',
    },
  }, {
    comment: '病人挂号记录表',
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    freezeTableName: true,
    tableName: 'hau_register',
  });

  return Register;
};
