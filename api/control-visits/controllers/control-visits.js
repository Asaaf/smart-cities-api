'use strict';

const JWT = require('jsonwebtoken');
const validator = require('./validator');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async create(ctx) {
    const errorInControlVisit = await validator.controlVisitValidation(ctx);
    if(errorInControlVisit) {
      return ctx.badRequest(errorInControlVisit);
    }
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
        const visitor = {'device_id': device.id, 'count': ctx.request.body.count, 'date_count': ctx.request.body.date_count};
        const control_visit = await strapi.services["control-visits"].create(visitor);
        if(control_visit) {
          ctx.response.status = 201;
          return ctx.response.body = control_visit;
        }
      }
      else {
        return ctx.response.badRequest("Invalid device");
      }
    }

  }

};
