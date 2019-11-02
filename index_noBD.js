const express = require("express");
const bodyParser = require("body-parser");
const uniqid = require("uniqid");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/drugstore-app", {
  useNewUrlParser: true
});

const Student = mongoose.model("Drug", {
  name: {
    type: String,
    default: ""
  },
  quantity: {
    type: Number
  }
});

const drugstore = [];

// Route pour creer un medoc
app.post("/drug", (req, res) => {
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

  for (let i = 0; i < drugstore.length; i++) {
    if (drugstore[i].name === name) {
      // Si le medoc existe deja ERROR
      return res.status(400).send({
        error: {
          message: "Drug already exists"
        }
      });
    }
  }

  // On genere le nouveau medoc
  const id = uniqid();
  const drug = {
    name: name,
    quantity: quantity,
    _id: id
  };

  // On l'ajoute au drugstore
  drugstore.push(drug);
  res.status(201).send(drug);
});

// Route pour lister les medocs
app.get("/drug", (req, res) => {
  res.send(drugstore);
});

// Route pour lister les medocs
app.get("/drug/:id/quantity", (req, res) => {
  const id = req.params.id;

  for (let i = 0; i < drugstore.length; i++) {
    if (drugstore[i]._id === id) {
      return res.send({ quantity: drugstore[i].quantity });
    }
  }

  // Si j'arrive ici c'est que le medicament avec l'id reçu n'a pas ete trouve
  return res.status(400).send({
    error: {
      message: "Bad request"
    }
  });
});

// Route pour ajouter des medocs
app.put("/drug/add", (req, res) => {
  const id = req.body.id;
  const quantity = Number(req.body.quantity);
  if (id === undefined || isNaN(quantity)) {
    return res.status(400).send({
      error: {
        message: "Bad request"
      }
    });
  }

  for (let i = 0; i < drugstore.length; i++) {
    if (drugstore[i]._id === id) {
      drugstore[i].quantity += quantity;
      // On revoit le medoc modifie
      return res.send(drugstore[i]);
    }
  }
  // Si j'arrive ici c'est que le medicament avec l'id reçu n'a pas ete trouve
  return res.status(400).send({
    error: {
      message: "Bad request"
    }
  });
});

// Route pour renomer un medoc
app.put("/drug/rename", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  if (id === undefined || name === undefined) {
    return res.status(400).send({
      error: {
        message: "Bad request"
      }
    });
  }

  for (let i = 0; i < drugstore.length; i++) {
    if (drugstore[i]._id === id) {
      drugstore[i].name = name;
      // On revoit le medoc modifie
      return res.send(drugstore[i]);
    }
  }
  // Si j'arrive ici c'est que le medicament avec l'id reçu n'a pas ete trouve
  return res.status(400).send({
    error: {
      message: "Bad request"
    }
  });
});

app.put("/drug/remove", (req, res) => {
  const id = req.body.id;
  const quantity = Number(req.body.quantity);
  if (id === undefined || isNaN(quantity)) {
    return res.status(400).send({
      error: {
        message: "Bad request"
      }
    });
  }

  for (let i = 0; i < drugstore.length; i++) {
    if (drugstore[i]._id === id) {
      if (drugstore[i].quantity < quantity) {
        return res.status(400).send({
          error: {
            message: "Invalid quantity"
          }
        });
      }
      drugstore[i].quantity -= quantity;
      // On revoit le medoc modifie
      return res.send(drugstore[i]);
    }
  }
  // Si j'arrive ici c'est que le medicament avec l'id reçu n'a pas ete trouve
  return res.status(400).send({
    error: {
      message: "Bad request"
    }
  });
});

app.delete("/drug", (req, res) => {
  const id = req.body.id;
  if (id === undefined) {
    return res.status(400).send("id is wrong");
  }

  for (let i = 0; i < drugstore.length; i++) {
    if (drugstore[i]._id === id) {
      drugstore.splice(i, 1); // Ici on supprime le Ieme medoc
      return res.send("Ok");
    }
  }
  // Si j'arrive ici c'est que le medicament avec l'id reçu n'a pas ete trouve
  return res.status(400).send({
    error: {
      message: "Bad request"
    }
  });
});

app.listen(3000, () => {
  console.log("Server started");
});
