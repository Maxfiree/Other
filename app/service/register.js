/** @module service/Register */

const moment = require('moment');

module.exports = app => {
  const connector = app.datasource.kingdeeCommon;
  const normalRegister = Symbol('normalRegister');
  /**
   * @class
   */
  class Register extends app.Service {

    /**
     * 创建挂号订单。
     * 接口更据挂号日期判断当天挂号或者是预约挂号，根据支付类型创建订单，支付失败需调用取消订单接口cancelOrder. 创建失败会抛出异常.
     * @param {object} patient 病人entity
     * @param {object} doctor 医生entity
     * @param {object} scheduleInfo 出诊信息entity
     * @param {object} periodInfo 排班分时entity
     * @param {object} payType 支付类型 支付类型（1微信 2 支付宝 3 银联卡 4 余额 5预付费）
     * @return {object} 订单entity
     */
    async createOrder(patient, doctor, scheduleInfo, periodInfo, payType) {
      // 挂号时间
      payType = 5;
      if (scheduleInfo.scheduleDate === moment().tz('Asia/Shanghai').format('YYYY-MM-DD')) {
        return this[normalRegister](patient, doctor, scheduleInfo, '', payType);
      }
    }

    // 当天挂号
    async [normalRegister](patient, doctor, scheduleInfo, periodInfo, payType) {
      const orderId = 'wired' + (new Date()).getTime() % 10000000000 + Math.floor(Math.random() * 10);
      const requestParameter = {
        lockId: orderId,
        hospitalId: app.config.datasource.KingdeeCommon.hospitalId,
        deptId: scheduleInfo.clinicUnitId,
        doctorId: doctor.doctorId,
        regDate: scheduleInfo.scheduleDate,
        timeFlag: scheduleInfo.shiftCode,
        startTime: '',
        endTime: '',
        scheduleId: '',
        queueSn: '',
        applyId: '',
        userJKK: patient.healthCardNo,
        regFee: scheduleInfo.regFee,
        treatFee: scheduleInfo.treatFee,
      };
      console.log(requestParameter);
      // 创建his订单
      const res = await connector.request('lockRegToday', requestParameter);
      if (parseInt(res.resultCode) !== 0) throw Error('创建失败');

      const t = await app.model.transaction();
      try {
        const register = await app.repository.Register.create({
          regId: orderId,
          orderId,
          deptId: scheduleInfo.clinicUnitId,
          deptName: doctor.deptName,
          doctorId: doctor.doctorId,
          doctorName: doctor.doctorName,
          scheduleId: scheduleInfo.scheduleId,
          regFee: scheduleInfo.regFee,
          treatFee: scheduleInfo.treatFee,
          patientId: patient.id,
          status: 2,
        }, { transaction: t });
        if (payType === 5) { // 预支付
        }
        await t.commit();
        return register;
      } catch (e) {
        // 取消订单
        app.logger.error('[service]', e);
        if (res && parseInt(res.resultCode) === 0) {
          await connector.request('unlockRegToday', {
            lockId: orderId,
          });
        }
        await t.rollback();
      }
    }

  }
  return Register;
};
