'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const validator = require('./validator');

module.exports = {
    async associate(ctx) {
        validator.emailValidation(ctx);
        // TODO :: validate email
        validator.validation(ctx, true);
        return ctx.request.body;
    },
};
