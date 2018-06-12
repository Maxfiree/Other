module.exports = {
  Query: {
    user(root, { id }, ctx) {
      return ctx.connector.user.findById(id);
    },
    users(root, _, ctx) {
      return ctx.connector.user.findAll();
    },
  },
  User: {
    roles(root, _, ctx) {
      return ctx.connector.user.findRoles(root.id);
    },
  },

  Mutation: {
    updateUser(root, args, ctx) {
      return ctx.connector.user.update(args);
    },
    addUserRole(root, args, ctx) {
      return ctx.connector.user.addRole(args.userId, args.roleId);
    },
  },
};
