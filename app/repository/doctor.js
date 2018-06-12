/** @module repository/Doctor */

const moment = require('moment');
const path = require('path');
const fs = require('fs');
const R = require('ramda');
module.exports = app => {
  const connector = app.datasource.kingdeeCommon;


  /**
     * @property {string} doctorId 医生ID.
     * @property {string} doctorName 医生姓名.
     * @property {string} levelCode 职称代码.
     * @property {string} level 职称.
     * @property {string} deptId 科室代码.
     * @property {string} deptName 科室名称.
     * @property {number} sex 1男2女.
     * @property {string} imageUrl 医生头像路径.
     * @property {string} phone 手机号码.
     * @property {string} description 医生简介.
     * @property {string} status 状态.
     * @property {string} extend 补充.
     * @property {Object} _raw his接口原始数据.
     */
  class Doctor {
    /**
     * repository doctor.
     * @param {string} doctorId 医生ID.
     * @param {string} doctorName 医生姓名.
     * @param {string} levelCode 职称代码.
     * @param {string} level 职称.
     * @param {string} deptId 科室代码.
     * @param {string} deptName 科室名称.
     * @param {number} sex 1男2女.
     * @param {string} imageUrl 医生头像路径.
     * @param {string} phone 手机号码.
     * @param {string} description 医生简介.
     * @param {string} status 状态.
     * @param {string} extend 补充.
     */
    constructor(doctorId, doctorName, levelCode, level, deptId, deptName, sex, imageUrl, phone, description, status, extend) {
      Object.assign(this, { doctorId, doctorName, levelCode, level, deptId, deptName, sex, imageUrl, phone, description, status, extend });
    }
    static getType() {
      return 'adapter';
    }
    static async findById(hospitalId, doctorId, deptId) {
      deptId = deptId ? deptId : '';
      const res = await connector.request('getDoctorInfo', { hospitalId, doctorId, deptId });
      const doctorList = res.doctorInfo ? res.doctorInfo instanceof Array ? res.doctorInfo : [ res.doctorInfo ] : [];
      if (doctorList.length > 0) {
        const doctor = doctorList[0];
        const imageUrl = path.join(app.config.static.dir, 'doctorImage', `${doctor.doctorId}.png`);
        if (fs.existsSync(imageUrl)) {
          doctor.imageUrl = `public/doctorImage/${doctor.doctorId}.png`;
        }
        const resDoctor = new Doctor(doctor.doctorId, doctor.doctorName, doctor.doctorLevelCode, doctor.doctorLevel,
          doctor.deptId, doctor.deptName, 1, doctor.imageUrl, '', doctor.description);
        resDoctor._raw = doctor;
        resDoctor._raw.hospitalId = hospitalId;
        return resDoctor;
      }
      const doctor = new Doctor(doctorId, '', '', '', deptId, '', 1, '', '', '', 1);
      doctor._raw = { hospitalId: app.config.datasource.KingdeeCommon.hospitalId };

      return doctor;
    }

    static async findAll(hospitalId) {
      const res = await connector.request('getDoctorInfo', { hospitalId });
      const doctorList = res.doctorInfo ? res.doctorInfo instanceof Array ? res.doctorInfo : [ res.doctorInfo ] : [];
      return doctorList.map(doctor => {
        const resDoctor = new Doctor(doctor.doctorId, doctor.doctorName, doctor.doctorLevelCode, doctor.doctorLevel,
          doctor.deptId, doctor.deptName, 1, doctor.imgUrl, '', doctor.description);
        resDoctor._raw = doctor;
        resDoctor._raw.hospitalId = hospitalId;
        return resDoctor;
      });
    }

    /**
     * 获取排班信息
     * @param {string} startDate 开始日期YYYY-MM-DD，默认值是今天
     * @param {string} endDate 开始日期YYYY-MM-DD，默认值是今天
     * @param {string} deptType 科室类型
     * @return {Array} 返回排班信息列表
     */
    async getScheduleInfos(startDate, endDate, deptType) {
      const hospitalId = this._raw.hospitalId;
      if (!startDate) {
        startDate = moment().format('YYYY-MM-DD');
        endDate = startDate;
      }
      const res = await connector.request('getRegInfoToday', { hospitalId,
        deptId: this.deptId, doctorId: this.doctorId, startDate, endDate, deptType });
      const regList = res.regInfo ? res.regInfo instanceof Array ? res.regInfo : [ res.regInfo ] : [];
      if (regList.length < 1) {
        return [];
      }
      const timeRegInfoList = regList[0].TimeRegInfoList ? regList[0].TimeRegInfoList instanceof Array ? regList[0].TimeRegInfoList : [ regList[0].TimeRegInfoList ] : [];
      let resScheduleIdList = [];
      for (const timeRegInfo of timeRegInfoList) {
        let scheduleInfoList = timeRegInfo.timeRegInfo ? timeRegInfo.timeRegInfo instanceof Array ? timeRegInfo.timeRegInfo : [ timeRegInfo.timeRegInfo ] : [];
        scheduleInfoList = R.uniq(scheduleInfoList);
        for (const scheduleInfo of scheduleInfoList) {
          const scheduleId = this.doctorId + moment().format('YYYYMMDD') + scheduleInfo.timeFlag;
          let resScheduleInfo = await app.repository.ScheduleInfo.findOne({ where: { scheduleId } });
          resScheduleIdList.push(scheduleId);
          if (resScheduleInfo) {
            await resScheduleInfo.update({
              scheduleDate: timeRegInfo.regDate,
              shiftCode: scheduleInfo.timeFlag,
              shiftName: app.repository.ScheduleInfo.transformTimeFlag(scheduleInfo.timeFlag),
              scheduleId,
              startTime: '',
              endTime: '',
              clinicUnitId: scheduleInfo.cliunitId,
              clinicUnitName: '',
              hasPeriodInfo: parseInt(scheduleInfo.isTimeReg) + 1,
              totalCount: scheduleInfo.regTotalCount,
              leftCount: scheduleInfo.regleaveCount,
              regFee: scheduleInfo.regFee ? parseInt(scheduleInfo.regFee) : 0,
              treatFee: scheduleInfo.treatFee ? parseInt(scheduleInfo.treatFee) : 0,
              medicareFee: 0,
              status: parseInt(scheduleInfo.regStatus) + 1,
            });
            continue;
          }
          resScheduleInfo = await app.repository.ScheduleInfo.create({
            scheduleDate: timeRegInfo.regDate,
            shiftCode: scheduleInfo.timeFlag,
            shiftName: app.repository.ScheduleInfo.transformTimeFlag(scheduleInfo.timeFlag),
            scheduleId,
            startTime: '',
            endTime: '',
            clinicUnitId: scheduleInfo.cliunitId,
            clinicUnitName: '',
            hasPeriodInfo: parseInt(scheduleInfo.isTimeReg) + 1,
            totalCount: scheduleInfo.regTotalCount,
            leftCount: scheduleInfo.regleaveCount,
            regFee: scheduleInfo.regFee ? parseInt(scheduleInfo.regFee) : 0,
            treatFee: scheduleInfo.treatFee ? parseInt(scheduleInfo.treatFee) : 0,
            medicareFee: 0,
            status: parseInt(scheduleInfo.regStatus) + 1,
          });
        }
      }
      resScheduleIdList = R.uniq(resScheduleIdList);
      const resScheduleInfoList = await app.repository.ScheduleInfo.findAll({ where: { scheduleId: resScheduleIdList } });
      if (!resScheduleInfoList) return [];
      return resScheduleInfoList;
    }
  }
  return Doctor;
};
