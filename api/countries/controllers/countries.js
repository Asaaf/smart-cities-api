'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  provinces: async(ctx) => {
    const { id } = ctx.params;
    const country = await strapi.query('countries').findOne({ id }, [ 'provinces' ]);
    return country;
  }

};
