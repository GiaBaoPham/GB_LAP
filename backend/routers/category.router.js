const express = require("express");
const Category = require("../models/category.model");
const { category } = require("../models");
const router = express.Router();

router.get("/", async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.send(categoryList);
});
router.get("/categoryId-by-name/:name", async (req, res) => {
  const name = req.params.name;
  const category = await Category.findOne({name:name});
  if (!category) {
    res.status(500).json({ success: false });
  }
  res.send(category.id);
});

router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
  });
  category = await category.save();
  if (!category) {
    return res.status(400).send("The category cannot created");
  }
  res.send(category);
});

router.delete("/:id", (req, res) => {
  Category.findByIdAndDelete(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ sucees: true, message: "The category was deteted" });
      } else {
        return res
          .status(404)
          .json({ sucees: false, message: "No category with id" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
module.exports = router;
