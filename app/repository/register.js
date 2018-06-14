/** @module repository/Register */
const moment = require('moment-timezone');

module.exports = app => {
  const connector = app.datasource.kingdeeCommon;
  const payConnector = app.datasource.kingdeeCommonPay;
  // const rsa = new NodeRSA(app.config.rsa.privateKey, { signingScheme: 'sha1' });
  /**
     * @property {string} regId 挂号编号 (预约挂号预约号，当天挂号his锁号).4e
     * @property {string} outPatientId 门诊号.
     * @property {string} patientId 病人编号
     * @property {string} receiptId 收据.
     * @property {string} orderId 支付流水号.
     * @property {string} cancelSerialId 取消单号.
     * @property {string} doctorId 医生编号.
     * @property {string} doctorName 医生名字.
     * @property {string} deptId 科室编号.
     * @property {string} deptName 科室名字.
     * @property {string} location 就诊位置.
     * @property {number} queueNo 排队号.
     * @property {number} waitingCount 前面就诊人数.
     * @property {string} visitTime 就诊时间.
     * @property {string} takeTime 取号时间.
     * @property {string} regFee 挂号费.
     * @property {string} treatFee 诊疗费.
     * @property {string} discountFee 优惠费用.
     * @property {string} registerTypeId 挂号类型编号（AB号）.
     * @property {number} regType 1预约挂号，2当天挂号
     * @property {number} cancelable 1不可以取消，2可以取消.
     * @property {number} status 1未取号，2已取号，3已退费，4已就诊，5已取消，6已报到，7已过期（爽约），8缴费超时，9未支付.
     * @property {string} barcode 条形码.
     * @property {string} description 挂号说明.
     * @property {string} extend 补充.
     * @property {Object} _raw his接口原始数据.
     */
  class Register {

    static getType() {
      return 'sequelizeModel';
    }

    async getPatient() {
      return await app.repository.Patient.findOne({ where: { id: this.patientId } });
    }
    async getOrder() {
      return await app.repository.Order.findOne({ where: { orderId: this.orderId } });
    }

    /**
     * 确认挂号订单。需要RSA签名
     * 订单支付完成后向his确认支付成功. 创建失败会抛出异常.
     * @return {Register} 操作成功返回Register
     */
    async confirmRegister() {
      const hospitalId = app.config.datasource.KingdeeCommon.hospitalId;
      const register = this;
      const patient = await this.getPatient();
      if (register.regType === 1) {
        const data = {
          hospitalId,
          lockId: register.orderId,
          orderId: register.orderId,
          userJKK: patient.healthCardNo,
          orderTime: moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'),
          orderType: '',
          fee: '',
          treatfee: '',
          payAmout: this.regFee + this.treatFee,
          payMode: 97,
          oprId: app.config.datasource.KingdeeCommon.oprId,
          orderIdPAY: register.orderId,
        };
        try {
          const res = await connector.request('addOrderToday', {
            data,
          });
          if (parseInt(res.resultCode) !== 0) {
            throw Error('支付写单失败');
          }
          await register.update({ location: res.roomAddress, queueNo: res.queueNo, outpatientId: res.clinicSeq, visitTime: res.clinicTime ? res.clinicTime : '', status: 1 });
          if (res.oppatNo) await patient.update({ oppatNo: res.oppatNo });
        } catch (e) {
          app.logger.error('[service]', e);
          const data = {
            lockId: register.orderId,
            scheduleId: '',
            queueSn: '',
          };
          await connector.request('unlockRegToday', {
            data,
          });
          throw e;
        }
        return register;
      }
    }


    /**
     * 取消挂号订单.
     * 取消挂号订单, 取消三方支付订单, 创建失败会抛出异常.
     * @return {Register} 操作成功返回Register
     */
    async cancelOrder() {
      const register = this;
      const patient = await this.getPatient();
      const order = await this.getOrder();
      await order.update({ status: 5 });
      if (register.regType === 1) {
        let res = await payConnector.request('order.closeOrder', {
          businessId: order.orderId,
        });
        if (parseInt(res.resultCode) !== 0) throw Error('取消挂号失败');
        res = await connector.request('appointment.cancelOrder', {
          orderId: order.orderId,
          healthCardNo: patient.healthCardNo,
          patientId: patient.patientId,
          bookingNo: register.regId ? register.regId : '',
          scheduleId: register.scheduleId,
          periodId: register.periodId,
          cancelTime: moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'),
        });
        if (parseInt(res.resultCode) !== 0) throw Error('取消挂号失败');
      } else if (register.regType === 2) {
        let res = await payConnector.request('order.closeOrder', {
          businessId: order.orderId,
        });
        if (parseInt(res.resultCode) !== 0) throw Error('取消挂号失败');
        res = await connector.request('register.unlockReg', {
          lockId: order.orderId,
          infoSeq: register.regId ? register.regId : '',
          scheduleId: register.scheduleId,
          periodId: register.periodId,
        });
        if (parseInt(res.resultCode) !== 0) throw Error('取消挂号失败');
      }
      await order.update({ status: 6 });
      await register.update({ status: 5 });
      return register;
    }

    /**
     * @param {number} status his订单状态
     * 转换his订单状态到repository的订单状态.
     * @return {number} repository的订单状态
     */
    static transformRegisterStatus(status) {
      status = parseInt(status);
      switch (status) {
        case 0: return 1;
        case 1: return 2;
        case 2: return 3;
        case 3: return 4;
        case 4: return 5;
        case 5: return 5;
        case 6: return 6;
        case 7: return 7;
        default : return 5;
      }
    }

  }
  return Register;
};
