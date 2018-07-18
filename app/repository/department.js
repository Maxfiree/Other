/** @module repository/Department */
const moment = require('moment-timezone');
const path = require('path');
const fs = require('fs');
// const R = require('ramda');

module.exports = app => {
  const connector = app.datasource.kingdeeCommon;

  /**
   * @property {string} deptId 科室代码.
   * @property {string} deptName 科室名称.
   * @property {number} type 1专科2 专家.
   * @property {string} parentId 上级科室代码.
   * @property {string} location 门诊三楼。
   * @property {string} phone 手机号码.
   * @property {string} description 医生简介.
   * @property {string} status 状态.
   * @property {string} extend 补充.
   * @property {Object} _raw his接口原始数据.
   */
  class Department {
    /**
     * repository department
     * @param {string} deptId 科室代码.
     * @param {string} deptName 科室名称.
     * @param {number} type 1专科2 专家.
     * @param {string} parentId 上级科室代码.
     * @param {string} location 门诊三楼。
     * @param {string} phone 手机号码.
     * @param {string} description 医生简介.
     * @param {string} status 状态.
     * @param {string} extend 补充.
     */
    constructor(deptId, deptName, type, parentId, location, phone, description, status, extend) {
      Object.assign(this, { deptId, deptName, type, parentId, location, phone, description, status, extend });
    }
    static getType() {
      return 'adapter';
    }
    static async findById(deptId) {
      const hospitalId = app.config.datasource.KingdeeCommon.hospitalId;
      const res = await connector.request('getDeptInfo', { hospitalId, deptId });
      const deptList = res.deptInfo ? res.deptInfo instanceof Array ? res.deptInfo : [ res.deptInfo ] : [];
      if (deptList.length > 0) {
        const dept = deptList[0];
        const department = new Department(dept.deptId, dept.deptName, dept.deptType, dept.parentId, '', '', dept.description);
        department._raw = dept;
        department._raw.hospitalId = hospitalId;
        return department;
      }
      return null;
    }

    static async findAll() {
      const hospitalId = app.config.datasource.KingdeeCommon.hospitalId;
      const res = await connector.request('getDeptInfo', { hospitalId });
      const deptList = res.deptInfo ? res.deptInfo instanceof Array ? res.deptInfo : [ res.deptInfo ] : [];
      const departments = deptList.map(dept => {
        const department = new Department(dept.deptId, dept.deptName, dept.deptType, dept.parentId, '', '', dept.description);
        department._raw = dept;
        department._raw.hospitalId = hospitalId;
        return department;
      });
      return { count: departments.length, rows: departments };
    }

    /**
     * 获取挂号医生
     * @param {string} startDate 开始日期YYYY-MM-DD，默认值是今天
     * @param {string} endDate 结束日期YYYY-MM-DD，默认值是今天
     * @param {string} deptType 科室类型
     * @return {Array} 返回医生列表
     */
    async getRegisterDoctors(startDate, endDate, deptType) {
      const hospitalId = this._raw.hospitalId;
      if (!startDate) {
        startDate = moment().tz('Asia/Shanghai').format('YYYY-MM-DD');
        endDate = startDate;
      }
      const res = await connector.request('getRegInfoToday', { hospitalId, deptId: this.deptId, startDate, endDate, deptType });
      const doctorList = res.regInfo ? res.regInfo instanceof Array ? res.regInfo : [ res.regInfo ] : [];
      const promises = doctorList.map(async doctor => {
        const resDoctor = new app.repository.Doctor(doctor.doctorId, doctor.doctorName, '', doctor.doctorTitle,
          this.deptId, this.deptName, 1, '', '', doctor.desc, 1);
        if (!doctor.TimeRegInfoList) {
          doctor.status = 2;
        }
        const imageUrl = path.join(app.config.static.dir, 'doctorImage', `${doctor.doctorId}.png`);
        if (fs.existsSync(imageUrl)) {
          doctor.imageUrl = `public/doctorImage/${doctor.doctorId}.png`;
        }
        return resDoctor;
      });
      const doctors = await Promise.all(promises);
      return { count: doctors.length, rows: doctors };
      // return doctorList;
    }
  }
  return Department;
};
