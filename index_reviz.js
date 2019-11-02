// // NPM utils
// const express = require("express");
// const bodyParser = require("body-express");
// const mongoose = require("mongoose");

// // NPM init
// const app = express();
// app.use(bodyParser.json());

// // MongoDB
// // Connect
// mongoose.connect("mongodb://localhost/drugstore-app", {
//   useNewUrlParser: true
// });

// // Model
// const Drug = mongoose.model("Drug", {
//   name: {
//     type: String,
//     default: ""
//   },
//   quantity: {
//     type: Number,
//     require: true
//   }
// });

// // Create
// app.post("/drug", async (req, res) => {
//   const name = req.body.name;
//   const quantity = req.body.quantity;

//   // Manage error
//   if (name === undefined || isNaN(quantity)) {
//     return res.status(400).send({
//       error: {
//         message: "Undefined parameter"
//       }
//     });
//   }

//   try {
//     const newDrug = new Drug({
//       name: name,
//       quantity: quantity
//     });

//     await newDrug.save();
//     res.send({ message: "Created" });
//   } catch (error) {
//     res.status(400).send({
//       error: {
//         message: "Bad request"
//       }
//     });
//   }
// });

// // Listen
// app.listen(3000, () => {
//   console.log("Server started");
// });

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mangoose");
const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb:localhost/drugstore-app");
