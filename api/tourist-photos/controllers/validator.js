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

const emailValidation = async (ctx) => {
    const rules = {
        email: Joi.string().required(),
    }
    const validation = await _validate(ctx.request.body, rules);
    return validation;
};

const photoCodeValidation = async (ctx) => {
    const rules = {
        tourist_photo_code: Joi.string().guid({ version: [ 'uuidv4' ] }).required(),
    }
    const validation = await _validate(ctx.request.body, rules);
    console.log('photo_code_valdiation', validation);
    return validation;
};

const visitValidation = async (ctx) => {
    const rules = {
        companions: Joi.number().integer().required(),
        city_id_to_visit: Joi.number().integer().required(),
        travel_mode_id: Joi.number().integer(),
        start_date: Joi.date().format('YYYY-MM-DD'),
        end_date: Joi.date().format('YYYY-MM-DD'),
    };
    const validation = await _validate(ctx.request.body, rules);
    console.log('visit_validation', validation);
    return validation;
};

const registerValidation = async (ctx) => {
    const rules = {
        phone: Joi.string(),
        name: Joi.string(),
        lastname: Joi.string(),
        birth_date: Joi.string().required(),
        gender: Joi.string().valid('M','F','O'),
        city_id: Joi.number().integer(),
        activities: Joi.array().items(Joi.number()),
        places_of_interest: Joi.array().items(Joi.number()),
        places_visited: Joi.array().items(Joi.number()),
    };
    const validation = await _validate(ctx.request.body, rules);
    return validation;
};

const touristPhotoValidation = async (ctx) => {
  const rules = {
    photo_code: Joi.string().required(),
    photo_date: Joi.date().iso().required()
  };
  const validation = await _validate(ctx.request.body, rules);
  return validation;
};


module.exports = {
    emailValidation,
    photoCodeValidation,
    visitValidation,
    registerValidation,
    touristPhotoValidation,
}
