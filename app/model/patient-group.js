module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const PatientGroup = app.model.define('patientGroup', { // 模型json结构
    hospitalId: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '医院代码',
    },
    masterId: {
      type: INTEGER,
      allowNull: true,
      unique: true,
      comment: '主患者Id',
    },
    name: {
      type: STRING(36),
      allowNull: true,
      unique: false,
      comment: '名称',
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
    comment: '患者家庭组信息表',
    timestamps: true,
    indexes: [],
    charset: 'utf8',
    collate: 'utf8_general_ci',
    freezeTableName: true,
    tableName: 'hau_patient_group',
  });
  PatientGroup.associate = function() {
    app.model.PatientGroup.hasMany(app.model.Patient, { foreignKey: 'patientGroupId' });
    app.model.Patient.belongsTo(app.model.PatientGroup, { foreignKey: 'patientGroupId' });
    app.model.Account.belongsTo(app.model.PatientGroup, { foreignKey: 'patientGroupId' });
  };
  return PatientGroup;
};
