'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const JWT = require('jsonwebtoken');
const validator = require('./validator');
const fs = require('fs');

const storeActivities = (activities, tourist) => {
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
            place_id: places_of_interest[i],
            interested: true,
        });
    }
};

const storePlacesVisited = (places_visited, tourist) => {
    for (let i = 0; i < places_visited.length; i++) {
        strapi.services['tourist-places'].create({
            tourist_id: tourist.id,
            place_id: places_visited[i],
            visited: true,
        });
    }
}

async function uploadImage(image, key) {
    try {
      if (image) {
        const arrImage = image.name.split('.');
        const extImage = arrImage[arrImage.length - 1];
        const pathImage = `photos/${key}.${extImage}`;
        const data = fs.readFileSync(image.path);
        const objectS3 = await strapi.services["file-manager-service"].put('smartcities-bucket', pathImage, data);
        return objectS3;
      }
      return null;
    } catch (error) {
      console.log(error);
    }
  }

module.exports = {
    async associate(ctx) {
        const errorInPhotoCodeValidation = await validator.photoCodeValidation(ctx);
       
        if (errorInPhotoCodeValidation) {
            return ctx.badRequest(errorInPhotoCodeValidation);
        }

        const { tourist_photo_code } = ctx.request.body;

        const touristPhoto = await strapi.services['tourist-photos'].findOne({ photo_code: tourist_photo_code });

        if (!touristPhoto) {
            return ctx.badRequest('the photo code does not exists');
        }

        if (touristPhoto.visit_id !== null) {
            return ctx.badRequest('the photo is already associated with a tourist');
        }

        ctx.request.body.activities = typeof ctx.request.body.activities === 'string' ? JSON.parse(ctx.request.body.activities) : ctx.request.body.activities;
        ctx.request.body.places_of_interest = typeof ctx.request.body.places_of_interest === 'string' ? JSON.parse(ctx.request.body.places_of_interest) : ctx.request.body.places_of_interest;
        ctx.request.body.places_visited = typeof ctx.request.body.places_visited === 'string' ? JSON.parse(ctx.request.body.places_visited) : ctx.request.body.places_visited;
        const errorInEmailValidation = await validator.emailValidation(ctx);

        if (errorInEmailValidation) {
            return ctx.badRequest(errorInEmailValidation);
        }

        const errorInVisitValidation = await validator.visitValidation(ctx);

        if (errorInVisitValidation) {
            return ctx.badRequest(errorInVisitValidation);
        }

        const { email } = ctx.request.body;

        let tourist = await strapi.services.tourists.findOne({ email });

        if (!tourist) {
            const errorInRegisterValidation = await validator.registerValidation(ctx);
            if (errorInRegisterValidation) {
                return ctx.badRequest(errorInRegisterValidation);
            }
            const { phone, name, lastname, birth_date, gender, city_id, activities, places_of_interest, places_visited } = ctx.request.body;
            tourist = await strapi.services.tourists.create({
                email,
                phone: phone || '',
                name: name || '',
                lastname: lastname || '',
                birth_date,
                gender: gender || '',
                city_id: city_id ? city_id : null
            });

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

        const { travel_mode_id, city_id_to_visit, start_date, end_date, companions } = ctx.request.body;

        const visit = await strapi.services.visits.create({
            tourist_id: tourist.id,
            travel_mode_id: travel_mode_id || null,
            city_id: city_id_to_visit,
            start_date: start_date || null,
            end_date: end_date || null,
            companions,
        });

        await strapi.services['tourist-photos'].update({ id: touristPhoto.id }, { visit_id: visit.id });
    
        await strapi.services["mailer-service"].send(email, touristPhoto.photo_public_url);

        touristPhoto.tourist_id = tourist.id;
        
        tourist.visit = visit;
        return tourist;
    },

    async create(ctx) {
        const errorInTouristPhoto = await validator.touristPhotoValidation(ctx);
        if (errorInTouristPhoto) {
            return ctx.badRequest(errorInTouristPhoto);
        }
        const BEARER = "Bearer";
        const split_token = ctx.request.header.device_token.split(" ");
        if (split_token.length != 2 || split_token[0] != BEARER) {
            ctx.response.forbidden("Invalid token");
        } else {
            const token = split_token[1];
            const payload = JWT.decode(token);
            const device = await strapi.services.devices.findOne({ id: payload.device_id });
            if (device) {
                const image = ctx.request.files.file;
                await uploadImage(image, ctx.request.body.photo_code);
                const arrImage = image.name.split('.');
                const ext = arrImage[arrImage.length - 1];
                const code = ctx.request.body.photo_code;
                const tourist_photo = await strapi.services["tourist-photos"].create({
                    device_id: device.id,
                    photo_code: code,
                    photo_date: ctx.request.body.photo_date,
                    photo_public_url: `https://smartcities-bucket.s3.amazonaws.com/photos/${code}.${ext}`,
                    photo_private_url: ''
                });
                if (tourist_photo) {
                    ctx.response.status = 201;
                    return ctx.response.body = tourist_photo;
                }
            } else {
                return ctx.response.badRequest("Invalid device");
            }
        }
    }
};