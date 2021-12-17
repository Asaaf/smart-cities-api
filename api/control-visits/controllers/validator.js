const Joi = require('joi').extend(require('@joi/date'));
const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
    allowUnknown: true,
};

const _validate = async (input, rules) => {
    const schema = Joi.object().keys(rules);
    const validation = await schema.validate(input, options);
    if (validation.error) {
        return validation.error.details[0].message;
    }
    return null;
};

const controlVisitValidation = async (ctx) => {
    const rules = {
        count: Joi.number().integer().required()
    };
    const validation = await _validate(ctx.request.body, rules);
    return validation;
};

module.exports = {
  controlVisitValidation
}
