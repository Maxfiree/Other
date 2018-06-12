module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const ScheduleInfo = app.model.define('ScheduleInfo', { // 模型json结构
    scheduleDate: {
      type: STRING(36),
      allowNull: false,
      unique: false,
      comment: '出诊日期',
    },
    shiftCode: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '用户描述',
    },
    shiftName: {
      type: STRING(36),
      allowNull: false,
      unique: false,
      comment: '班别名称',
    },
    scheduleId: {
      type: STRING(36),
      allowNull: false,
      unique: true,
      comment: '排班编号',
    },
    startTime: {
      type: STRING(20),
      allowNull: false,
      unique: false,
      comment: '开始时间',
    },
    endTime: {
      type: STRING(20),
      allowNull: false,
      unique: false,
      comment: '结束时间',
    },
    clinicUnitId: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '诊疗单元编号',
    },
    clinicUnitName: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '诊疗单元名称',
    },
    hasPeriodInfo: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      comment: '1无2有',
    },
    totalCount: {
      type: INTEGER,
      allowNull: false,
      unique: false,
      comment: '号源总数',
    },
    leftCount: {
      type: INTEGER,
      allowNull: true,
      unique: false,
      comment: '剩余总数',
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
    medicareFee: {
      type: INTEGER,
      allowNull: true,
      unique: false,
      comment: '社保费',
    },
    status: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 2,
      unique: false,
      comment: '1停诊2出诊3未开放',
    },
  }, {
    comment: '医生排班表',
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    freezeTableName: true,
    tableName: 'hau_schedule_info',
  });

  return ScheduleInfo;
};
