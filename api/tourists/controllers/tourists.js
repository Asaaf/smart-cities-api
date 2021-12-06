'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    findOne: async(ctx) => {
        const { email } = ctx.params;
        const tourist = await strapi.query('tourists').findOne({ email });
        return {
            exists: !!tourist,
        }
      }
};
