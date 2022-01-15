'use strict';

const JWT = require('jsonwebtoken');
const validator = require('./validator');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    async devicesAndforms(ctx) {
        const controlVisits = await strapi.connections.default.raw(
            `SELECT CAST(DATE(date_count) AS CHAR) AS date, MAX(count) AS total
      FROM control_visits
      WHERE DATE(date_count) >= CAST(DATE_FORMAT(NOW() ,'%Y-%m-01') as DATE)
      AND DATE (date_count) <= LAST_DAY(now())
      GROUP BY date
      LIMIT 10;`
        );

        const formRecords = await strapi.connections.default.raw(
            `SELECT CAST(DATE(photo_date) AS CHAR) AS date, count(id) AS total
      FROM tourist_photos
      WHERE DATE(photo_date) >= CAST(DATE_FORMAT(NOW() ,'%Y-%m-01') as DATE)
      AND DATE (photo_date) <= LAST_DAY(now())
      AND visit_id IS NOT NULL
      GROUP BY date
      LIMIT 10;`
        );
        const resulset = {
            devices: controlVisits[0],
            forms: formRecords[0],
        }
        return resulset;
    },

    async create(ctx) {
        const errorInControlVisit = await validator.controlVisitValidation(ctx);
        if (errorInControlVisit) {
            return ctx.badRequest(errorInControlVisit);
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
                const timeElapsed = Date.now();
                const today = new Date(timeElapsed);
                const visitor = { 'device_id': device.id, 'count': ctx.request.body.count, 'date_count': today.toISOString() };
                const control_visit = await strapi.services["control-visits"].create(visitor);
                if (control_visit) {
                    ctx.response.status = 201;
                    return ctx.response.body = control_visit;
                }
            } else {
                return ctx.response.badRequest("Invalid device");
            }
        }

    }

};