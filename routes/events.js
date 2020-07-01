const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Event, validateEvent } = require("../models/event");
const express = require("express");
const router = express.Router();

// GET all events route
router.get("/", async (req, res, next) => {
  //throw new Error('Could not get the genres.');
  const events = await Event.find().sort("name");
  res.send(events);
});

// POST Event route
// run auth when a user access this route
router.post("/", auth, async (req, res) => {
  //Validate the clients request and display error if not valid
  const { error } = validateEvent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let event = new Event({ name: req.body.name });
  event = await event.save();
  res.send(event);
});

// PUT (Update) Event by ID route
router.put("/:id", async (req, res) => {
  const { error } = validateEvent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!event)
    return res.status(404).send("The event with the given ID was not found.");
  res.send(event);
});

// DELETE Event by ID route
router.delete("/:id", [auth, admin], async (req, res) => {
  const event = await Event.findByIdAndRemove(req.params.id);
  if (!event)
    return res.status(404).send("The event with the given ID was not found.");
  res.send(event);
});

//GET Event by ID route
router.get("/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event)
    return res.status(404).send("The event with the given ID was not found.");
  res.send(event);
});

//Export Router
module.exports = router;
