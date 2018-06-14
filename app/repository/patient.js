/** @module repository/Patient */
const R = require('ramda');
const moment = require('moment-timezone');
module.exports = app => {
  const connector = app.datasource.kingdeeCommon;
  /**
   * @property {string} hospitalId 医院编码.
   * @property {string} patientId 病人编号.
   * @property {string} patientName 病人名字.
   * @property {string} healthCardNo 诊疗卡号.
   * @property {string} idCardNo 身份证号.
   * @property {string} medicareCardNo 医保卡号.
   * @property {string} oppatNo 病案号.
   * @property {string} admissionNo 住院号.
   * @property {string} phone 手机号.
   * @property {number} sex 性别，1成人2儿童.
   * @property {number} type 类型,1成人2儿童.
   * @property {string} address 住址.
   * @property {string} description 描述.
   * @property {number} status 状态.
   * @property {string} extend 补充.
   * @property {Object} _raw his接口原始数据.
   */
  class Patient {
    static getType() {
      return 'sequelizeModel';
    }

    static async findAndCountAll(option) {
      const hospitalId = app.config.datasource.KingdeeCommon.hospitalId;
      if (option.where && option.where.healthCardNo) {
        let hisPatient = await connector.request('confirmUser', {
          hospitalId, typeNme: 2, userJKK: option.where.healthCardNo, oprId: app.config.datasource.KingdeeCommon.oprId });
        if (hisPatient) hisPatient = hisPatient.res;
        if (hisPatient.patId) {
          let patient = await app.repository.Patient.findOne({ where: { healthCardNo: hisPatient.userJKK } });
          if (patient) {
            await patient.update({
              hospitalId: hisPatient.patId,
              patientName: hisPatient.userName,
              healthCardNo: hisPatient.userJKK,
              idCardNo: hisPatient.userIdCard,
              birthday: hisPatient.userBirthday,
              medicareCardNo: hisPatient.userYbCard,
              oppatNo: hisPatient.oppatNo,
              sex: hisPatient.userGender === 'M' ? 1 : 2,
              type: 1,
            });
          } else {
            patient = await app.repository.Patient.create({
              hospitalId: hisPatient.patId,
              patientName: hisPatient.userName,
              healthCardNo: hisPatient.userJKK,
              idCardNo: hisPatient.userIdCard,
              birthday: hisPatient.userBirthday,
              medicareCardNo: hisPatient.userYbCard,
              oppatNo: hisPatient.oppatNo,
              sex: hisPatient.userGender === 'M' ? 1 : 2,
              type: 1,
            });
          }
          return { count: 1, rows: [ patient ] };
        }
      }
      return { count: 0 };
    }

    /**
     * 获取病历信息
     * @param {string} startDate 开始日期YYYY-MM-DD，不传查询所有记录
     * @param {string} endDate 开始日期YYYY-MM-DD，
     * @return {Array} 返回病历信息列表
     */
    async getMedicalRecords(startDate, endDate) {
      const patient = this;
      let res;
      if (startDate) {
        res = await connector.request('outpatient.getMedicalRecord', { patientId: this.patientId, healthCardNo: this.healthCardNo, startDate, endDate });
      } else {
        res = await connector.request('outpatient.getMedicalRecord', { patientId: this.patientId, healthCardNo: this.healthCardNo });
      }
      const medicalRecordList = res.medicalInfo ? res.medicalInfo instanceof Array ? res.medicalInfo : [ res.medicalInfo ] : [];
      const promises = medicalRecordList.map(async medicalRecord => {
        let resMedicalRecord = await app.repository.MedicalRecord.findOne({ where: { outpatientId: medicalRecord.clinicSeq } });
        if (resMedicalRecord) {
          await resMedicalRecord.update({
            patientId: patient.patientId,
            outpatientId: medicalRecord.clinicSeq,
            inpatientId: null,
            deptId: medicalRecord.deptId,
            deptName: medicalRecord.deptName,
            doctorId: medicalRecord.doctorId,
            doctorName: medicalRecord.doctorName,
            medicalTime: medicalRecord.medicalDate,
            description: medicalRecord.remark,
            extend: medicalRecord.detailUrl });
          resMedicalRecord._raw = medicalRecord;
          return resMedicalRecord;
        }
        resMedicalRecord = await app.repository.MedicalRecord.create({
          patientId: patient.patientId,
          outpatientId: medicalRecord.clinicSeq,
          inpatientId: null,
          deptId: medicalRecord.deptId,
          deptName: medicalRecord.deptName,
          doctorId: medicalRecord.doctorId,
          doctorName: medicalRecord.doctorName,
          medicalTime: medicalRecord.medicalDate,
          description: medicalRecord.remark,
          extend: medicalRecord.detailUrl });
        resMedicalRecord._raw = medicalRecord;
        return resMedicalRecord;
      });
      return await Promise.all(promises);
    }

    /**
     * 获取检查报告
     * @param {string} startDate 开始日期YYYY-MM-DD，默认值是当前日期前10天
     * @param {string} endDate 开始日期YYYY-MM-DD，默认值是报告日期
     * @return {Array} 检查报告
     */
    async getExamineReports(startDate, endDate) {
      const patient = this;
      if (!startDate) {
        startDate = moment().subtract(10, 'day').tz('Asia/Shanghai').format('YYYY-MM-DD');
        endDate = moment().tz('Asia/Shanghai').format('YYYY-MM-DD');
      }
      const res = await connector.request('pacs.getReport', { patientId: patient.patientId, healthCardNo: patient.healthCardNo, beginDate: startDate, endDate });
      const reportList = res.report ? res.report instanceof Array ? res.report : [ res.report ] : [];
      const promises = reportList.map(async report => {
        // const res = await connector.request('pacs.getReportDetail', { reportId: report.reportId });
        const resExamineReport = new app.repository.ExamineReport(
          report.reportId,
          report.reportTitle,
          '',
          '',
          '',
          '',
          '',
          '',
          report.examination,
          report.reportDate,
          '',
          report.clinicalDiagnosis,
          report.clinicalDiagnosis,
          report.status + 1,
          report.detailUrl
        );
        resExamineReport._raw = R.merge(report, res);
        return resExamineReport;
      });
      return await Promise.all(promises);
    }

    /**
     * 获取检验报告
     * @param {string} startDate 开始日期YYYY-MM-DD，默认值是当前日期前10天
     * @param {string} endDate 开始日期YYYY-MM-DD，默认值是报告日期
     * @return {Array} 检验报告
     */
    async getInspectionReports(startDate, endDate) {
      const patient = this;
      if (!startDate) {
        startDate = moment().subtract(10, 'day').tz('Asia/Shanghai').format('YYYY-MM-DD');
        endDate = moment().tz('Asia/Shanghai').format('YYYY-MM-DD');
      }
      const res = await connector.request('lis.getReport', { patientId: patient.patientId, healthCardNo: patient.healthCardNo, beginDate: startDate, endDate });
      const reportList = res.report ? res.report instanceof Array ? res.report : [ res.report ] : [];
      const promises = reportList.map(async report => {
        let res = {};
        if (parseInt(report.report) === 2) {
          res = await connector.request('lis.getPathologicalReport', { inspectionId: report.inspectionId });
        }
        const resInspectionReport = new app.repository.InspectionReport(
          report.inspectionId,
          report.inspectionName,
          report.receiveDate,
          res.verifyTime,
          report.verifyTime,
          report.reportType + 1,
          '',
          report.deptName,
          '',
          report.clinicalDiagnosis,
          report.reportDoctorName,
          '',
          '',
          res.submitDoctorName,
          report.status + 1
        );
        resInspectionReport._raw = R.merge(report, res);
        return resInspectionReport;
      });
      return await Promise.all(promises);
    }

    /**
     * 获取诊间费用
     * @param {string} status 支付状态
     * @param {string} startDate 开始日期YYYY-MM-DD，默认值是当前日期前10天
     * @param {string} endDate 开始日期YYYY-MM-DD，默认值是报告日期
     * @return {Array} 诊间费用
     */
    async getOutpatientFees(status, startDate, endDate) {
      const hospitalId = app.config.datasource.KingdeeCommon.hospitalId;
      const patient = this;
      if (!startDate) {
        startDate = moment().subtract(10, 'day').tz('Asia/Shanghai').format('YYYY-MM-DD');
        endDate = moment().tz('Asia/Shanghai').format('YYYY-MM-DD');
      }
      const outpatientFees = [];
      if (parseInt(status) === 2) {
        const res = await connector.request('outpatient.getCompletedPayInfo', { hospitalId, healthCardNo: patient.healthCardNo,
          patientId: patient.patientId, startDate, endDate });
        const payListInfoList = res.payListInfo ? res.payListInfo instanceof Array ? res.payListInfo : [ res.payListInfo ] : [];
        const promises = payListInfoList.map(async payListInfo => {
          const res = await connector.request('outpatient.getCompletedPayDetailInfo', { clinicSeq: payListInfo.clinicSeq, receiptId: payListInfo.receiptId });
          res.orderDetailInfo = res.orderDetailInfo ? res.orderDetailInfo instanceof Array ? res.orderDetailInfo : [ res.orderDetailInfo ] : [];
          const orderId = 'wired' + (new Date()).getTime() % 10000000000 + Math.floor(Math.random() * 10);
          if (payListInfo.clinicSeq) {
            // create relative medical record.
            let resMedicalRecord = await app.repository.MedicalRecord.findOne({ where: { outpatientId: payListInfo.clinicSeq } });
            if (resMedicalRecord) {
              await resMedicalRecord.update({
                patientId: patient.patientId,
                outpatientId: payListInfo.clinicSeq,
                inpatientId: null,
                deptId: payListInfo.deptId,
                deptName: payListInfo.deptName,
                doctorId: payListInfo.doctorId,
                doctorName: payListInfo.doctorName,
                medicalTime: payListInfo.clinicTime,
                description: payListInfo.remark,
              });
            } else {
              resMedicalRecord = await app.repository.MedicalRecord.create({
                patientId: patient.patientId,
                outpatientId: payListInfo.clinicSeq,
                inpatientId: null,
                deptId: payListInfo.deptId,
                deptName: payListInfo.deptName,
                doctorId: payListInfo.doctorId,
                doctorName: payListInfo.doctorName,
                medicalTime: payListInfo.clinicTime,
                description: payListInfo.remark,
              });
            }
            const description = '收费单: ' + (payListInfo.clinicTime ? moment(payListInfo.clinicTime, 'YYYY-MM-DDHH:mm:ss').tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm') : moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm'));
            let resOutpatientFee = await app.repository.OutpatientFee.findOne({ where: { feeId: payListInfo.clinicSeq } });
            if (resOutpatientFee) {
              await resOutpatientFee.update({
                receiptId: payListInfo.receiptId,
                payAmount: payListInfo.payAmout ? parseInt(payListInfo.payAmout) : 0,
                recAmount: payListInfo.recPayAmout ? parseInt(payListInfo.recPayAmout) : 0,
                patientId: patient.patientId,
                totalAmount: payListInfo.totalPayAmout ? parseInt(payListInfo.totalPayAmout) : 0,
                outpatientId: payListInfo.clinicSeq,
                prescriptionIds: payListInfo.prescriptionIds,
                chargeTime: payListInfo.chargeDate,
                status: 2,
                description: description.length > 100 ? description.substring(0, 100) + '...' : description,
              });
              if (parseInt(res.resultCode) !== 0) return;
              outpatientFees.push(resOutpatientFee);
              return resOutpatientFee;
            }
            resOutpatientFee = await app.repository.OutpatientFee.create({
              receiptId: payListInfo.receiptId,
              payAmount: payListInfo.payAmout ? parseInt(payListInfo.payAmout) : 0,
              recAmount: payListInfo.recPayAmout ? parseInt(payListInfo.recPayAmout) : 0,
              patientId: patient.patientId,
              chargeTime: payListInfo.chargeDate,
              totalAmount: payListInfo.totalPayAmout ? parseInt(payListInfo.totalPayAmout) : 0,
              outpatientId: payListInfo.clinicSeq,
              orderId,
              // feeId: res.prescriptionIds,
              feeId: payListInfo.clinicSeq,
              prescriptionIds: res.prescriptionIds,
              status: 2,
              description: description.length > 100 ? description.substring(0, 100) + '...' : description,
            });
            if (parseInt(res.resultCode) !== 0) return;
            outpatientFees.push(resOutpatientFee);
            return resOutpatientFee;
          }
        });
        await Promise.all(promises);
        return outpatientFees;
      }
      const res = await connector.request('outpatient.getPayInfo', { hospitalId, healthCardNo: patient.healthCardNo,
        patientId: patient.patientId, startDate, endDate });
      const payListInfoList = res.payListInfo ? res.payListInfo instanceof Array ? res.payListInfo : [ res.payListInfo ] : [];
      const promises = payListInfoList.map(async payListInfo => {
        const res = await connector.request('outpatient.getPaybillfee', { hospitalId, healthCardNo: patient.healthCardNo,
          patientId: patient.patientId, clinicSeq: payListInfo.clinicSeq, doctorId: payListInfo.doctorId });
        res.feeInfo = res.feeInfo ? res.feeInfo instanceof Array ? res.feeInfo : [ res.feeInfo ] : [];
        const orderId = 'wired' + (new Date()).getTime() % 10000000000 + Math.floor(Math.random() * 10);
        if (payListInfo.clinicSeq) {
          const description = '收费单: ' + (payListInfo.clinicTime ? moment(payListInfo.clinicTime, 'YYYY-MM-DDHH:mm:ss').tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm') : moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm'));
          let resOutpatientFee = await app.repository.OutpatientFee.findOne({ where: { feeId: payListInfo.clinicSeq } });
          if (resOutpatientFee) {
            // create relative medical record.
            let resMedicalRecord = await app.repository.MedicalRecord.findOne({ where: { outpatientId: payListInfo.clinicSeq } });
            if (resMedicalRecord) {
              await resMedicalRecord.update({
                patientId: patient.patientId,
                outpatientId: payListInfo.clinicSeq,
                inpatientId: null,
                deptId: payListInfo.deptId,
                deptName: payListInfo.deptName,
                doctorId: payListInfo.doctorId,
                doctorName: payListInfo.doctorName,
                medicalTime: payListInfo.clinicTime,
                description: payListInfo.remark,
              });
            } else {
              resMedicalRecord = await app.repository.MedicalRecord.create({
                patientId: patient.patientId,
                outpatientId: payListInfo.clinicSeq,
                inpatientId: null,
                deptId: payListInfo.deptId,
                deptName: payListInfo.deptName,
                doctorId: payListInfo.doctorId,
                doctorName: payListInfo.doctorName,
                medicalTime: payListInfo.clinicTime,
                description: payListInfo.remark,
              });
            }
            await resOutpatientFee.update({
              payAmount: res.payAmout ? parseInt(res.payAmout) : 0,
              recAmount: res.recPayAmout ? parseInt(res.recPayAmout) : 0,
              patientId: patient.patientId,
              totalAmount: res.totalPayAmout ? parseInt(res.totalPayAmout) : 0,
              outpatientId: payListInfo.clinicSeq,
              prescriptionIds: res.prescriptionIds,
              chargeTime: payListInfo.chargeDate,
              status: 1,
              description: description.length > 100 ? description.substring(0, 100) + '...' : description,
            });
            if (parseInt(res.resultCode) !== 0) return;
            outpatientFees.push({
              fee: resOutpatientFee,
              feeInfo: res.feeInfo,
            });
            return resOutpatientFee;
          }
          resOutpatientFee = await app.repository.OutpatientFee.create({
            payAmount: res.payAmout ? parseInt(res.payAmout) : 0,
            recAmount: res.recPayAmout ? parseInt(res.recPayAmout) : 0,
            patientId: patient.patientId,
            totalAmount: res.totalPayAmout ? parseInt(res.totalPayAmout) : 0,
            outpatientId: payListInfo.clinicSeq,
            orderId,
            // feeId: res.prescriptionIds,
            feeId: payListInfo.clinicSeq,
            chargeTime: payListInfo.chargeDate,
            prescriptionIds: res.prescriptionIds,
            status: 1,
            description: description.length > 100 ? description.substring(0, 100) + '...' : description,
          });
          if (parseInt(res.resultCode) !== 0) return;
          outpatientFees.push({
            fee: resOutpatientFee,
            feeInfo: res.feeInfo,
          });
          return resOutpatientFee;
        }
      });
      await Promise.all(promises);
      return outpatientFees;
    }

    /**
     * 获取挂号信息
     * @return {Array} 挂号信息.
     */
    async getRegisters() {
      const patient = this;
      const res = await connector.request('outpatient.getRegisterInfo', { patientId: patient.patientId });
      const orderInfoList = res.orderInfo ? res.orderInfo instanceof Array ? res.orderInfo : [ res.orderInfo ] : [];
      const promises = orderInfoList.map(async orderInfo => {
        let resRegister = await app.repository.Register.findOne({ where: { orderId: orderInfo.orderId } });
        if (resRegister) {
          await resRegister.update({
            regId: orderInfo.orderId,
            outpatientId: orderInfo.clinicSeq,
            orderId: orderInfo.orderId,
            patientId: patient.patientId,
            doctorId: orderInfo.doctorId,
            doctorName: orderInfo.doctorName,
            deptId: orderInfo.deptId,
            deptName: orderInfo.deptName,
            queueNo: orderInfo.queueNo,
            waitingCount: orderInfo.waitingCount,
            visitTime: orderInfo.visitTime,
            cancelable: orderInfo.isCancelabe + 1,
            status: app.repository.Register.transformRegisterStatus(orderInfo.status),
          });
          resRegister._raw = orderInfo;
          return resRegister;
        }
        resRegister = await app.repository.Register.create({
          regId: orderInfo.orderId,
          outpatientId: orderInfo.clinicSeq,
          orderId: orderInfo.orderId,
          patientId: patient.patientId,
          doctorId: orderInfo.doctorId,
          doctorName: orderInfo.doctorName,
          deptId: orderInfo.deptId,
          deptName: orderInfo.deptName,
          queueNo: orderInfo.queueNo,
          waitingCount: orderInfo.waitingCount,
          visitTime: orderInfo.visitTime,
          cancelable: orderInfo.isCancelabe + 1,
          status: app.repository.Register.transformRegisterStatus(orderInfo.status),
        });
        resRegister._raw = orderInfo;
        return resRegister;
      });
      return await Promise.all(promises);
    }

  }
  return Patient;
};
