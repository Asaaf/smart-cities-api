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

const visitValidation = async (ctx) => {
    const rules = {
        travel_mode_id: Joi.number().integer().required(),
        tourist_photo_id: Joi.number().integer().required(),
        city_id_to_visit: Joi.number().integer().required(),
        start_date: Joi.date().format('YYYY-MM-DD').required(),
        end_date: Joi.date().format('YYYY-MM-DD').required(),
    };
    const validation = await _validate(ctx.request.body, rules);
    return validation;
};

const registerValidation = async (ctx) => {
    const rules = {
        phone: Joi.string().required(),
        name: Joi.string().required(),
        lastname: Joi.string().required(),
        birth_date: Joi.string().required(),
        gender: Joi.string().required().valid('M','F','O'),
        city_id: Joi.number().integer().required(),
        activities: Joi.array().items(Joi.number()),
        places: Joi.array().items(Joi.number()),
    };
    const validation = await _validate(ctx.request.body, rules);
    return validation;
};

const touristPhotoValidation = (ctx) => {
  const rules = {
    photo_code: Joi.string().required(),
    photo_date: Joi.date().iso().required()
  };
  const schema = Joi.object().keys(rules);
  const input = ctx.request.body;
  const validation = schema.validate(input, options);
  if (validation.error) {
      ctx.badRequest(validation.error.details[0].message);
  }
};


module.exports = {
    emailValidation,
    visitValidation,
    registerValidation,
    touristPhotoValidation,
}
