'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async cities (ctx) {
        const resulset = await strapi.connections.default.raw(
            `SELECT COUNT(v.city_id) AS total, c.id, c.name
            FROM cities as c
            INNER JOIN visits v ON c.id = v.city_id
            GROUP BY c.id;`
        );
        return resulset[0];
    }
};
