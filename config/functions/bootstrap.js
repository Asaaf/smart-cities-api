'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

module.exports = async () => {
    const knex = strapi.connections.default;
    await knex.schema.alterTable('provinces', t => {
        console.log('provinces change', t)
        //t.integer('country').unsigned().notNullable().references('countries.id').onDelete('cascade').alter();
    });
  }
