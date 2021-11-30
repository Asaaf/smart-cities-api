'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = { 

  find: async(ctx) => {
    const countries = await strapi.query('countries').model.fetchAll({
      columns: ['id', 'name'],
    });
    return countries;
  },

  provinces: async(ctx) => {
    const { id } = ctx.params;
    const country = await strapi.query('countries').findOne({ id }, [ 'provinces' ]);
    return country;
  }

};
