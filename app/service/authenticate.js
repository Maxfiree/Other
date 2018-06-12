const createError = require('http-errors');
const R = require('ramda');

module.exports = app => {
  class Authenticate extends app.Service {
    async policyValidate() {
      const { ctx } = this;
      if (!ctx.helper.testUrl(ctx.path, app.config.access.ignorePaths)) {
        if (!ctx.user) {
          throw createError(401, 'no user in ctx', { code: 1002 });
        }
        // get policyTemplates of all user's userGroup and user.
        let templateIds = [];
        const userPolicyIds = await app.cache.get(`userPolicyIds_${ctx.user.id}`, async () => {
          const user = await ctx.repository.User.findById(ctx.user.id);
          const policies = await user.getAuthPolicies();
          return policies.map(policy => policy.id);
        });
        templateIds = templateIds.concat(userPolicyIds);
        const policyPromises = ctx.user.userGroupIds.map(async userGroupId => {
          const userGroupPolicyIds = await app.cache.get(`userGroupPolicyIds_${userGroupId}`, async () => {
            const userGroup = await ctx.repository.UserGroup.findById(userGroupId);
            if (!userGroup) return [];
            const policies = await userGroup.getAuthPolicies();
            return policies.map(policy => policy.id);
          });
          templateIds = templateIds.concat(userGroupPolicyIds);
        });
        await Promise.all(policyPromises);
        const policyTemplateIds = R.uniq(templateIds);
        const policyTemplates = [];
        const promises = policyTemplateIds.map(async policyTemplateId => {
          const authPolicy = await app.cache.get(`authPolicy_${policyTemplateId}`, async () => {
            return await ctx.repository.AuthPolicy.findById(policyTemplateId);
          });
          policyTemplates.push(authPolicy.template);
        });
        await Promise.all(promises);
        let access = false;
        policyTemplates.forEach(policyTemplate => {
          const result = ctx.helper.testPolicyTemplate(ctx.path, ctx.method, JSON.parse(policyTemplate));
          if (result) {
            access = result === 2;
          }
        });
        if (!access) {
          throw createError(401, `no permission ${ctx.method} ${ctx.path}`, { code: 1005 });
        }
      }
    }

  }
  return Authenticate;
};
