// Require modules
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

// Event schema
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

// Model
const Event = mongoose.model("Events", eventSchema);

// Joi validation
function validateEvent(event) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(event);
}

module.exports.eventSchema = eventSchema;
module.exports.Event = Event;
module.exports.validateEvent = validateEvent;
