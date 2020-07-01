const { Equipment, validateEquipment } = require("../models/equipment");
const { Event } = require("../models/event");
const express = require("express");
const router = express.Router();

// GET all equipments route
router.get("/", async (req, res) => {
  const equipments = await Equipment.find().sort("name");
  res.send(equipments);
});

// POST Equipment route
router.post("/", async (req, res) => {
  //Validate the clients request and display error if not valid
  const { error } = validateEquipment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const event = await Event.findById(req.body.eventId);
  if (!event) return res.status(400).send("Invalid event");

  let equipment = new Equipment({
    title: req.body.title,
    event: {
      _id: event._id,
      name: event.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  equipment = await equipment.save();
  res.send(equipment);
});

// PUT (Update) Equipment route
router.put("/:id", async (req, res) => {
  const { error } = validateEquipment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const event = await Event.findById(req.body.eventId);
  if (!event) return res.status(400).send("Invalid event");

  const equipment = await Equipment.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      event: {
        _id: event._id,
        name: event.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    {
      new: true,
    }
  );

  if (!equipment)
    return res
      .status(404)
      .send("The equipment with the given ID was not found.");
  res.send(equipment);
});

// DELETE Equipment by ID route
router.delete("/:id", async (req, res) => {
  const equipment = await Equipment.findByIdAndRemove(req.params.id);

  if (!equipment)
    return res
      .status(404)
      .send("The equipment with the given ID was not found.");
  res.send(equipment);
});

// GET Equipment by ID route
router.get("/:id", async (req, res) => {
  const equipment = await Equipment.findById(req.params.id);

  if (!equipment)
    return res
      .status(404)
      .send("The equipment with the given ID was not found.");

  res.send(equipment);
});

//Export Router
module.exports = router;
