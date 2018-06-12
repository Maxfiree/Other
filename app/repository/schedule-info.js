/** @module repository/ScheduleInfo */

module.exports = app => {
  const connector = app.datasource.kingdeeCommon;

  /**
     * @property {string} scheduleDate 出诊日期.
     * @property {string} shiftCode 班别代码.
     * @property {string} shiftName 班别名称，上午班.
     * @property {string} scheduleId 排班编号.
     * @property {string} startTime 开始时间.
     * @property {string} endTime 结束时间.
     * @property {string} clinicUnitId 诊疗单元编号
     * @property {string} clinicUnitName 诊疗单元名称
     * @property {number} hasPeriodInfo 1无2有.
     * @property {number} totalCount 号源总数.
     * @property {number} leftCount 剩余总数.
     * @property {string} regFee 挂号费.
     * @property {string} treatFee 诊疗费.
     * @property {string} medicareFee 社保费.
     * @property {number} status 1停诊2出诊3未开放.
     * @property {string} extend 补充.
     * @property {Object} _raw his接口原始数据.
     */
  class ScheduleInfo {

    static getType() {
      return 'sequelizeModel';
    }

    /**
     * 获取排班分时信息
     * @return {Array} 返回排班分时信息列表
     */
    async getPeriodInfos() {
      const scheduleInfo = this;
      const res = await connector.request('appointment.getTimeInfo', { hospitalId: app.config.datasource.KingdeeCommon.hospitalId, scheduleId: this.scheduleId,
        regDate: scheduleInfo.scheduleDate, clinicUnitId: this.clinicUnitId });
      const periodInfoList = res.timeRegInfo ? res.timeRegInfo instanceof Array ? res.timeRegInfo : [ res.timeRegInfo ] : [];
      const promises = periodInfoList.map(async periodInfo => {
        let resPeriodInfo = await app.repository.PeriodInfo.findOne({ where: { periodId: periodInfo.periodId } });
        if (resPeriodInfo) {
          await resPeriodInfo.update({
            periodId: periodInfo.periodId,
            startTime: periodInfo.startTime,
            endTime: periodInfo.endTime,
            totalCount: periodInfo.regTotalCount,
            leftCount: periodInfo.regLeaveCount,
            regFee: scheduleInfo.regFee,
            treatFee: scheduleInfo.treatFee,
            medicareFee: scheduleInfo.medicareFee,
            status: scheduleInfo.status,
          });
          resPeriodInfo._raw = periodInfo;
          resPeriodInfo._raw.hospitalId = scheduleInfo._raw.hospitalId;
          return resPeriodInfo;
        }
        resPeriodInfo = await app.repository.PeriodInfo.create({
          periodId: periodInfo.periodId,
          startTime: periodInfo.startTime,
          endTime: periodInfo.endTime,
          totalCount: periodInfo.regTotalCount,
          leftCount: periodInfo.regLeaveCount,
          regFee: scheduleInfo.regFee,
          treatFee: scheduleInfo.treatFee,
          medicareFee: scheduleInfo.medicareFee,
          status: scheduleInfo.status,
        });
        resPeriodInfo._raw = periodInfo;
        resPeriodInfo._raw.hospitalId = scheduleInfo._raw.hospitalId;
        return resPeriodInfo;
      });
      return await Promise.all(promises);
    }

    /**
     * 获取可选挂号类型
     * @param {string} regDate 日期
     * @return {Array} 返回排班分时信息列表
     */
    async getRegisterType() {
      const scheduleInfo = this;
      const res = await connector.request('support.getRegisterTypeList', { hospitalId: app.config.datasource.KingdeeCommon.hospitalId, scheduleId: scheduleInfo.scheduleId,
        clinicUnitId: this.clinicUnitId, deptId: scheduleInfo.deptId, doctorId: scheduleInfo.doctorId, shiftCode: scheduleInfo.shiftCode });
      const registerType = res.registerType ? res.registerType instanceof Array ? res.registerType : [ res.registerType ] : [];
      const promises = registerType.map(async registerType => {
        const resRegisterType = new app.repository.RegisterType(registerType.registerTypeId, registerType.registerTypeName, registerType.remark);
        resRegisterType._raw = registerType;
        return resRegisterType;
      });
      return await Promise.all(promises);
    }

    static transformTimeFlag(timeFlag) {
      timeFlag = parseInt(timeFlag);
      switch (timeFlag) {
        case 1: return '上午';
        case 2: return '下午';
        case 3: return '晚上';
        case 4: return '中午';
        case 5: return '上夜';
        case 6: return '下夜';
        case 7: return '白天';
        case 8: return '昼夜';
        default : return '';
      }
    }
  }
  return ScheduleInfo;
};
