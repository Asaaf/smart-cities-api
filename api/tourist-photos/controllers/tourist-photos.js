'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const validator = require('./validator');

module.exports = {
    async associate(ctx) {
        validator.emailValidation(ctx);
        const { email } = ctx.request.body;
        let tourist = await strapi.services.tourists.findOne({ email });
        if (tourist) {
            return tourist;
        }
        validator.validation(ctx, true);
        const { phone, name, lastname, birth_date, gender, city_id, travel_mode_id, tourist_photo_id } = ctx.request.body;
        tourist = await strapi.services.tourists.create({ email, phone, name, lastname, birth_date, gender, city_id });
        return tourist;
    },
};
