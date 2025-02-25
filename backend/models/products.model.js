const mongoose = require("mongoose");
const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Must above zero"],
    default: 0,
  },
  imgName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    enum: ["hp", "asus", "dell", "lenovo", "acer", "apple"],
    default: "",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: {
    type: Map,
    of: String,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});
productsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
productsSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("Product", productsSchema);
