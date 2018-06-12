module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Patient = app.model.define('patient', { // 模型json结构
    hospitalId: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '医院代码',
    },
    patientGroupId: {
      type: INTEGER,
      allowNull: true,
      unique: false,
      comment: '患者组Id',
    },
    patientName: {
      type: STRING(36),
      allowNull: false,
      unique: false,
      comment: '姓名',
    },
    healthCardNo: {
      type: STRING(36),
      allowNull: false,
      unique: true,
      comment: '诊疗卡号',
    },
    idCardNo: {
      type: STRING(18),
      allowNull: true,
      unique: true,
      comment: '身份证号',
    },
    medicareCardNo: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '医保卡号',
    },
    oppatNo: {
      type: STRING(36),
      allowNull: true,
      unique: true,
      comment: '病案号',
    },
    admissionNo: {
      type: STRING(36),
      allowNull: true,
      unique: true,
      comment: '住院号',
    },
    phone: {
      type: STRING(20),
      allowNull: true,
      unique: false,
      comment: '手机号码',
    },
    sex: {
      type: INTEGER,
      allowNull: true,
      unique: false,
      comment: '性别，1男2女',
    },
    age: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      comment: '年龄',
      defaultValue: 0,
    },
    birthday: {
      type: DATE,
      allowNull: true,
      unique: false,
      comment: '生日',
    },
    type: {
      type: INTEGER,
      allowNull: true,
      unique: false,
      comment: '类型，1成人2儿童',
    },
    address: {
      type: STRING,
      allowNull: true,
      unique: false,
      comment: '住址',
    },
    description: {
      type: STRING(1024),
      allowNull: true,
      unique: false,
      comment: '患者描述',
    },
    status: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      unique: false,
      comment: '状态',
    },
  }, {
    comment: '患者信息表',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: [ 'idCardNo' ],
      },
      {
        unique: true,
        fields: [ 'healthCardNo' ],
      },
    ],
    charset: 'utf8',
    collate: 'utf8_general_ci',
    freezeTableName: true,
    tableName: 'hau_patient',
  });
  Patient.associate = function() {
    app.model.Account.belongsTo(app.model.Patient, { foreignKey: 'patientId' });
  };
  return Patient;
};
