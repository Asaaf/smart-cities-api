'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const JWT = require('jsonwebtoken');
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

    async create(ctx) {
      validator.touristPhotoValidation(ctx);
      const BEARER = "Bearer";
      const split_token = ctx.request.header.device_token.split(" ");
      if (split_token.length != 2 || split_token[0] != BEARER) {
        ctx.response.forbidden("Invalid token");
      }
      else {
        const token  = split_token[1];
        const payload = JWT.decode(token);
        const device = await strapi.services.devices.findOne({id: payload.device_id});
        if (device) {
          const tourist_photo = await strapi.services["tourist-photos"].create({
            device_id: device.id,
            photo_code: ctx.request.body.photo_code,
            photo_date: ctx.request.body.photo_date,
            photo_public_url: '',
            photo_private_url: ''
          });
          if(tourist_photo) {
            ctx.response.status = 201;
            return ctx.response.body = tourist_photo;
          }
        }
        else {
          return ctx.response.badRequest("Invalid device");
        }
      }
    }
};
