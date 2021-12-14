'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const JWT = require('jsonwebtoken');
const validator = require('./validator');

const storeActivities = (activities, tourist)  => {
  for (let i = 0; i < activities.length; i++) {
    strapi.services['tourist-activities'].create({
      tourist_id: tourist.id,
      activity_id: activities[i],
    });
  }
};

const storePlacesOfInterest = (places_of_interest, tourist) => {
  for (let i = 0; i < places_of_interest.length; i++) {
    strapi.services['tourist-places'].create({
      tourist_id: tourist.id,
      activity_id: places_of_interest[i],
      interested: true,
    });
  }
};

const storePlacesVisited = (places_visited, tourist) => {
  for (let i = 0; i < places_visited.length; i++) {
    strapi.services['tourist-places'].create({
      tourist_id: tourist.id,
      activity_id: places_visited[i],
      visited: true,
    });
  }
}

module.exports = {
    async associate(ctx) {
        const errorInEmailValidation = await validator.emailValidation(ctx);

        if (errorInEmailValidation) {
          return ctx.badRequest(errorInEmailValidation);
        }

        const errorInVisitValidation = await validator.visitValidation(ctx);

        if (errorInVisitValidation) {
          return ctx.badRequest(errorInVisitValidation);
        }

        const { email, tourist_photo_code } = ctx.request.body;
        const touristPhoto = await strapi.services['tourist-photos'].findOne({photo_code : tourist_photo_code});

        if (!touristPhoto) {
          return ctx.badRequest('the photo code does not exists');
        }

        let tourist = await strapi.services.tourists.findOne({ email });

        if (!tourist) {
            const errorInRegisterValidation = await validator.registerValidation(ctx);
            if (errorInRegisterValidation) {
              return ctx.badRequest(errorInRegisterValidation);
            }
            const { phone, name, lastname, birth_date, gender, city_id, activities, places_of_interest, places_visited } = ctx.request.body;
            tourist = await strapi.services.tourists.create({ email, phone, name, lastname, birth_date, gender, city_id });

            if (activities) {
              storeActivities(activities, tourist);
            }
            if (places_of_interest) {
              storePlacesOfInterest(places_of_interest, tourist);
            }
            if (places_visited) {
              storePlacesVisited(places_visited, tourist);
            }
        }

        const { travel_mode_id, city_id_to_visit, start_date, end_date } = ctx.request.body;

        const visit = await strapi.services.visits.create({
            tourist_id: tourist.id,
            travel_mode_id: travel_mode_id || null,
            city_id: city_id_to_visit,
            start_date,
            end_date,
        });

        await strapi.services['tourist-photos'].update({id: touristPhoto.id}, {tourist_id})

        touristPhoto.tourist_id = tourist.id;

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
