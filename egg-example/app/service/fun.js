const Service = require('egg').Service;

class UserService extends Service {
  async find() {
    console.log("service");
    await console.log("service");
    console.log("service await");
  }
  async find2() {
    console.log("service2");
    await console.log("service2");
    console.log("service2 await");
  }
}

module.exports = UserService; 