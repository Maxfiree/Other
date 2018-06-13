module.exports = app => {
  app.get('/home', app.controller.home.index);

  app.router.resources('patients', '/api/v1/hau/patients', app.controller.hau.patients);
  app.get('/api/v1/hau/patients/:id/account', app.controller.hau.patients.getAccount);
  app.post('/api/v1/hau/patients/:id/account', app.controller.hau.patients.createAccount);
  app.post('/api/v1/hau/patients/:id/account/:accountId', app.controller.hau.patients.addAccount);
  app.delete('/api/v1/hau/patients/:id/account', app.controller.hau.patients.removeAccount);

  app.router.resources('patientGroups', '/api/v1/hau/patientGroups', app.controller.hau.patientGroups);
  app.get('/api/v1/hau/patientGroups/:id/account', app.controller.hau.patientGroups.getAccount);
  app.post('/api/v1/hau/patientGroups/:id/account', app.controller.hau.patientGroups.createAccount);
  app.post('/api/v1/hau/patientGroups/:id/account/:accountId', app.controller.hau.patientGroups.addAccount);
  app.delete('/api/v1/hau/patientGroups/:id/account', app.controller.hau.patientGroups.removeAccount);
  app.get('/api/v1/hau/patientGroups/:id/patients', app.controller.hau.patientGroups.getPatients);
  app.post('/api/v1/hau/patientGroups/:id/patients/:patientId', app.controller.hau.patientGroups.addPatient);
  app.delete('/api/v1/hau/patientGroups/:id/patients/:patientId', app.controller.hau.patientGroups.removePatient);
  app.put('/api/v1/hau/patientGroups/:id/master/:patientId', app.controller.hau.patientGroups.updateMaster);

  app.router.resources('accounts', '/api/v1/hau/accounts', app.controller.hau.accounts);
  app.get('/api/v1/hau/accounts/:id/expenditures', app.controller.hau.accounts.getExpenditures);
  app.get('/api/v1/hau/accounts/:id/incomes', app.controller.hau.accounts.getIncomes);
  app.post('/api/v1/hau/accounts/:id/orders', app.controller.hau.accounts.createOrder);

  app.router.resources('orders', '/api/v1/hau/orders', app.controller.hau.orders);
  app.post('/api/v1/hau/orders/:id/refund', app.controller.hau.orders.refund);

  app.router.resources('refunds', '/api/v1/hau/refunds', app.controller.hau.refunds);

  app.router.resources('departments', '/api/v1/hau/departments', app.controller.hau.departments);
  app.get('/api/v1/hau/departments/:deptId/doctors', app.controller.hau.departments.getDoctors);

  app.router.resources('doctors', '/api/v1/hau/doctors', app.controller.hau.doctors);
  app.get('/api/v1/hau/doctors/:doctorId/scheduleInfos', app.controller.hau.doctors.getScheduleInfos);

  app.router.resources('registers', '/api/v1/hau/registers', app.controller.hau.registers);
  app.put('/api/v1/hau/registers/:id/confirm', app.controller.hau.registers.confirm);

  // not use path /cn and /public as it server for static source by default
};
