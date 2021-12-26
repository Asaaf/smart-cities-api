'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async cities (ctx) {
        const resulset = await strapi.connections.default.raw(
            `SELECT COUNT(t.city_id) AS total, c.id, c.name
            FROM tourists as t
            INNER JOIN cities c on t.city_id = c.id
            GROUP BY c.id;`
        );
        return resulset[0];
    }
};
