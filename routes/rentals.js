//Required Modules
const { Rental, validateRental } = require("../models/rental");
const { Equipment } = require("../models/equipment");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

// GET all rentals route
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

// POST rental route
router.post("/", async (req, res) => {
  // Validate the clients request and display error if not valid
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the customer ID is valid
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  // Check if the equipment ID is valid
  const equipment = await Equipment.findById(req.body.equipmentId);
  if (!equipment) return res.status(400).send("Invalid equipment");
  // Check if the equipment is in stock
  if (equipment.numberInStock === 0)
    return res.status(400).send("This equipment run out of stock");

  // Create a new Rental object
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    equipment: {
      _id: equipment._id,
      title: equipment.title,
      dailyRentalRate: equipment.dailyRentalRate,
    },
  });

  // Group the operations together as a transaction using fawn module
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "equipments",
        { _id: equipment._id },
        { $inc: { numberInStock: -1 } }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed");
  }

  // GET rental by ID
  router.get("/:id", async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental)
      return res.status(404).send("The rental with the given ID was not found");

    res.send(rental);
  });
});

//Export the route
module.exports = router;
