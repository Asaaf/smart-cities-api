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
        let visit = null;
        if (!tourist) {
            validator.registerValidation(ctx);
            const { phone, name, lastname, birth_date, gender, city_id } = ctx.request.body;
            tourist = await strapi.services.tourists.create({ email, phone, name, lastname, birth_date, gender, city_id });
        }
        validator.visitValidation(ctx);
        const { travel_mode_id, tourist_photo_id, city_id_to_visit, start_date, end_date } = ctx.request.body;
        visit = await strapi.services.visits.create({
            tourist_id: tourist.id,
            travel_mode_id,
            tourist_photo_id,
            city_id: city_id_to_visit,
            start_date,
            end_date,
        });
        tourist.visit = visit;
        return tourist;
    },
};
