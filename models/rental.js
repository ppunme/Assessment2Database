// Require Modules
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

// Rental Schema
const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
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
      }),
      required: true,
    },
    equipment: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 3,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 999,
        },
      }),
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

//Joi validation
//only validate customerId and equipmentId. Everything else will be handled by a server
function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    equipmentId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validateRental = validateRental;
