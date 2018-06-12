const DataLoader = require('dataloader');
const R = require('ramda');

class UserConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  async fetch(ids) {
    const users = await this.ctx.app.repository.User.findAll({
      where: {
        id: {
          $in: ids,
        },
      },
    });
    if (users.length > 0) {
      return ids.map(id => {
        const res = R.find(R.propEq('id', parseInt(id)))(users);
        return res ? res.toJSON() : null;
      });
    }
    return ids.map(() => null);
  }

  findByIds(ids) {
    return this.loader.loadMany(ids);
  }

  findById(id) {
    return this.loader.load(id);
  }

  async findAll() {
    return await this.ctx.app.repository.User.findAll();
  }

  async findRoles(id) {
    const user = await this.ctx.app.repository.User.findById(id);
    if (user) {
      const roles = await user.getRoles();
      return roles.map(u => u.toJSON());
    }
    return [];
  }

  async update(args) {
    const user = await this.ctx.app.repository.User.findById(args.id);
    await user.update(R.dissoc('id', args));
    this.loader.clear(args.id).prime(args.id, user.toJSON());
    return user.toJSON();
  }

  async delete(id) {
    const user = await this.ctx.app.repository.User.findById(id);
    await user.destroy();
    this.loader.clear(id);
    return user.toJSON();
  }
  async addRole(userId, roleId) {
    const user = await this.ctx.app.repository.User.findById(userId);
    const role = await this.ctx.app.repository.Role.findById(roleId);
    await user.addRole(role);
    return user.toJSON();
  }
}

module.exports = UserConnector;
