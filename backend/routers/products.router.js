const express = require("express");
const router = express.Router();
const Product = require("../models/products.model");
const Category = require("../models/category.model");
const { default: mongoose } = require("mongoose");

router.get("/", async (req, res) => {
  //get query filter
  const category = req.query.category;
  const brand = req.query.brand;
  //get query sort
  const sortBy = req.query.sortBy || "dateCreated";
  const order = req.query.order === "desc" ? -1 : 1;
 
  let filter = {};
  if (category) {
    const categoryId = await Category.findOne({ name: category });
    filter.category = categoryId.id;
  }
  if (brand) {
    filter.brand = brand;
  }

  const productList = await Product.find(filter)
    .sort({ [sortBy]: order })
    .populate("category");
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});
router.post("/", async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category");
  let product = new Product({
    name: req.body.name,
    price: req.body.price,
    imgName: req.body.imgName,
    brand: req.body.brand,
    category: req.body.category,
    description: req.body.description,
    isFeatured: req.body.isFeatured,
  });
  product = await product.save();
  if (!product) {
    return res.status(400).send("The product cannot created");
  }
  res.send(product);
});
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    return res.status(500).json({ success: false });
  }
  res.send(product);
});
router.delete("/:id", (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid product id");
  }
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "The product was deteted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "No product with id" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

//PATCH
router.patch("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid product id");
  }
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid category");
  }
  const updates = { ...req.body };
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).catch((err) => {
    return res.status(400).json({ success: false, error: err });
  });
  res.status(200).send(updatedProduct);
});
//COUNT PRODUCT
router.get("/get/count", async (req, res) => {
  try {
    const filter = req.query || {};
    const productCount = await Product.countDocuments(filter);
    res.status(200).json({ productCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//GET FEATURE PRODUCT
router.get("/get/feature/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const productList = await Product.find({ isFeatured: true })
    .populate("category")
    .limit(+count);
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});
module.exports = router;
