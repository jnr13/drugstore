const express = require("express");
const bodyParser = require("body-parser");
const uniqid = require("uniqid");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/drugstore-app", {
  useNewUrlParser: true
});

const Drug = mongoose.model("Drug", {
  name: {
    type: String,
    default: ""
  },
  quantity: {
    type: Number
  }
});

//const drugstore = [];

// Route pour creer un medoc
app.post("/drug", async (req, res) => {
  const name = req.body.name;
  const quantity = Number(req.body.quantity);
  if (name === undefined || isNaN(quantity)) {
    // Check des params reçus
    return res.status(400).send({
      error: {
        message: "Bad request"
      }
    });
  }

  const ifExists = await Drug.findOne({ name: name });
  if (ifExists !== null) {
    return res.status(400).send({
      error: {
        message: "Drug already exists"
      }
    });
  }

  try {
    const newDrug = new Drug({
      name: req.body.name,
      quantity: req.body.quantity
    });
    await newDrug.save();
    res.json({ message: "Created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour lister les medocs
app.get("/drug", async (req, res) => {
  try {
    const drugs = await Drug.find();
    res.json(drugs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// http://localhost:3000/drug/5dbb3b220b890803d598cc07/quantity
app.get("/drug/:id/quantity", async (req, res) => {
  const id = req.params.id;
  try {
    const drug = await Drug.findOne({ _id: id });
    res.send({ quantity: drug.quantity });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route pour ajouter des medocs
app.post("/drug/add", async (req, res) => {
  const quantity = Number(req.body.quantity);
  if (isNaN(quantity)) {
    return res.status(400).send({
      error: {
        message: "Bad request"
      }
    });
  }

  try {
    if (req.body.id) {
      const drug = await Drug.findOne({ _id: req.body.id });
      // Autre manière de trouver un document à partir d'un `id` :
      // const student = await Student.findById(req.body.id);
      drug.quantity += req.body.quantity;
      await drug.save();
      res.json({ message: "Updated" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: "Bad request"
      }
    });
  }
});

// Route pour renomer un medoc
// app.put("/drug/rename", async (req, res) => {
app.post("/drug/rename", async (req, res) => {
  if (req.body.name === undefined) {
    return res.status(400).json({
      error: {
        message: "Indefined parameter"
      }
    });
  }

  try {
    if (req.body.id) {
      const drug = await Drug.findOne({ _id: req.body.id });
      // Autre manière de trouver un document à partir d'un `id` :
      // const student = await Student.findById(req.body.id);
      drug.name = req.body.name;
      await drug.save();
      res.json({ message: "Updated" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: "Bad request"
      }
    });
  }
});

app.post("/drug/remove", async (req, res) => {
  const quantity = Number(req.body.quantity);
  if (isNaN(quantity)) {
    return res.status(400).send({
      error: {
        message: "Bad request"
      }
    });
  }

  try {
    if (req.body.id) {
      const drug = await Drug.findOne({ _id: req.body.id });
      // Autre manière de trouver un document à partir d'un `id` :
      // const student = await Student.findById(req.body.id);
      if (drug.quantity < quantity) {
        return res.status(400).send({
          error: {
            message: "Invalid quantity"
          }
        });
      }

      drug.quantity -= req.body.quantity;
      await drug.save();
      res.json({ message: "Updated" });
    } else {
      return res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: "Bad request"
      }
    });
  }
});

app.post("/drug/delete", async (req, res) => {
  try {
    if (req.body.id) {
      const drug = await Drug.findOne({ _id: req.body.id });
      // Autre manière de trouver un document à partir d'un `id` :
      // const student = await Student.findById(req.body.id);
      // await drug.remove();
      drug.remove();

      res.json({ message: "Removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: "Bad request"
      }
    });
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
