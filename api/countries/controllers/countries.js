'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

find: async (ctx, next) => {
  console.log('/suggested-users accessed.');
  await next();
}

module.exports = {};
