const Joi = require('joi');
const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
    allowUnknown: true,
};

const emailValidation = (ctx) => {
    const rules = {
        email: Joi.string().required(),
    }
    const schema = Joi.object().keys(rules);
    const input = ctx.request.body;
    const validation = schema.validate(input, options);
    if (validation.error) {
        ctx.badRequest(validation.error.details[0].message);
    }
}

const validation = (ctx, defaultFields = false) => {
    const rules = {
        city_id: Joi.number().integer().required(),
        travel_mode_id: Joi.number().integer().required(),
        tourist_photo_id: Joi.number().integer().required(),
    };
    if (defaultFields) {
        rules.phone = Joi.string().required();
        rules.name = Joi.string().required();
        rules.lastname = Joi.string().required();
        rules.birth_date = Joi.string().required();
        rules.gender = Joi.string().required().valid('M','F','O');
    }
    const schema = Joi.object().keys(rules);
    const input = ctx.request.body;
    const validation = schema.validate(input, options);
    if (validation.error) {
        ctx.badRequest(validation.error.details[0].message);
    }
};

module.exports = {
    emailValidation,
    validation,
}
