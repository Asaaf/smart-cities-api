'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async tourists (ctx) {
        const resulset = await strapi.connections.default.raw(
            `SELECT COUNT(ta.activity_id) AS total, a.id, a.name
            FROM activities as a
            INNER JOIN tourist_activities ta on a.id = ta.activity_id
            GROUP BY a.id`
        );
        return resulset[0];
    }
};
