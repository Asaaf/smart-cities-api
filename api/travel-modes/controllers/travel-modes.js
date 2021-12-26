'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async tourists (ctx) {
        const resulset = await strapi.connections.default.raw(
            `SELECT COUNT(v.travel_mode_id) AS total, tm.id, tm.name
            FROM travel_modes as tm
            INNER JOIN visits v ON tm.id = v.travel_mode_id
            GROUP BY tm.id;`
        );
        return resulset[0];
    }
};
