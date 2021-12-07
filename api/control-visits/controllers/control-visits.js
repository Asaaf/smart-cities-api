'use strict';

const JWT = require('jsonwebtoken');
const validator = require('./validator');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async create(ctx) {
    validator.controlVisitValidation(ctx);
    const BEARER = "Bearer";
    const split_token = ctx.request.header.device_token.split(" ");
    if (split_token.length != 2 || split_token[0] != BEARER) {
      ctx.response.forbidden("Invalid token");
    }
    else {
      const token  = split_token[1];
      const device = JWT.decode(token);
      const visitor = {'device_id': device.device_id, 'count': ctx.request.body.count, 'date_count': ctx.request.body.date_count};
      const control_visit = await strapi.services["control-visits"].create(visitor);
      if(control_visit) {
        ctx.response.status = 201;
        return ctx.response.body = control_visit;
      }
    }

  }

};
