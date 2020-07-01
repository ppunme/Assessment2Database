// Require Modules
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

// import Event module
const { eventSchema } = require("./event");

// Equipment Schema
const Equipment = mongoose.model(
  "Equipments",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    event: {
      type: eventSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 999,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 999,
    },
  })
);

//Joi validation
function validateEquipment(equipment) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    eventId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(999).required(),
    dailyRentalRate: Joi.number().min(0).max(999).required(),
  });
  return schema.validate(equipment);
}

//Exports
module.exports.Equipment = Equipment;
module.exports.validateEquipment = validateEquipment;
