const DataLoader = require('dataloader');
const R = require('ramda');

class RoleConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
  }

  async fetch(ids) {
    const roles = await this.ctx.app.repository.Role.findAll({
      where: {
        id: {
          $in: ids,
        },
      },
    });
    if (roles.length > 0) {
      return ids.map(id => {
        const res = R.find(R.propEq('id', parseInt(id)))(roles);
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

  async findUsers(id) {
    const role = await this.ctx.app.repository.Role.findById(id);
    if (role) {
      const users = await role.getUsers();
      return users.map(u => u.toJSON());
    }
    return [];
  }

  async create(args) {
    const role = await this.ctx.app.repository.Role.create(args);
    this.loader.prime(R.toString(role.id), role.toJSON());
    return role.toJSON();
  }

  async update(args) {
    const role = await this.ctx.app.repository.Role.findById(args.id);
    await role.update(R.dissoc('id', args));
    this.loader.clear(args.id).prime(args.id, role.toJSON());
    return role.toJSON();
  }

  async delete(id) {
    const role = await this.ctx.app.repository.Role.findById(id);
    await role.destroy();
    this.loader.clear(id);
    return role.toJSON();
  }
}

module.exports = RoleConnector;
