module.exports = {

  Query: {
    user(root, { id }, ctx) {
      return ctx.connector.user.findById(id);
    },
  },
  Role: {
    user(root, _, ctx) {
      return ctx.connector.role.findUsers(root.id);
    },
  },
  Mutation: {
    createRole(root, args, ctx) {
      return ctx.connector.role.create(args);
    },
    updateRole(root, args, ctx) {
      return ctx.connector.role.update(args);
    },
  },
};
