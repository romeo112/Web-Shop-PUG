let mongoose = require("mongoose");

//create schema
var Schema = mongoose.Schema;

var proizvodSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    price: { type: Number, required: true },
    kolicina: { type: Number, required: true }
  },
  { collection: "proizvodi" }
);

var Proizvod = mongoose.model("Proizvod", proizvodSchema);
module.exports = Proizvod;
