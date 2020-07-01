const { Customer, validateCustomer } = require("../models/customer");
const express = require("express");
const router = express.Router();

// GET all customer route
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

// POST Customer route
router.post("/", async (req, res) => {
  //Validate the clients request and display error if not valid
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isPlus: req.body.isPlus,
  });
  customer = await customer.save();
  res.send(customer);
});

// PUT (Update) Customer route
router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isPlus: req.body.isPlus,
    },
    {
      new: true,
    }
  );

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");
  res.send(customer);
});

// DELETE Customer by ID route
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

// GET Customer by ID route
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

//Export router
module.exports = router;
