// Require modules
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

// Customer schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  phone: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 50,
  },
  isPlus: {
    type: Boolean,
    default: false,
  },
});

//Model
const Customer = mongoose.model("Customer", customerSchema);

//Joi validation
function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    phone: Joi.string().min(8).max(50).required(),
    isPlus: Joi.boolean(),
  });
  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
