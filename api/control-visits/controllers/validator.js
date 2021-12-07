const Joi = require('joi').extend(require('@joi/date'));
const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
    allowUnknown: true,
};

const controlVisitValidation = (ctx) => {
    const rules = {
        count: Joi.number().integer().required(),
        date_count: Joi.date().iso().required()
    };
    const schema = Joi.object().keys(rules);
    const input = ctx.request.body;
    const validation = schema.validate(input, options);
    if (validation.error) {
        ctx.badRequest(validation.error.details[0].message);
    }
};

module.exports = {
  controlVisitValidation
}
