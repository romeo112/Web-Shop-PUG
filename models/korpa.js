let mongoose = require("mongoose");

var Schema = mongoose.Schema;

//Schema za korpu kolekciju
var korpaSchema = new Schema(
  {
    itemName: { type: String, required: true },
    itemUrl: { type: String, required: true },
    itemPrice: { type: Number, required: true }
  },
  { collection: "korpa" }
);

var Korpa = mongoose.model("Korpa", korpaSchema);
module.exports = Korpa;
