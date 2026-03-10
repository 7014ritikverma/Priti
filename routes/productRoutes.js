import express from "express";
import Product from "../models/Product.js";
import upload from "../middleware/multer.js";

const router = express.Router();


// 🔍 SEARCH PRODUCTS
router.get("/search", async (req, res) => {

  try {

    const q = req.query.q;

    if (!q) {
      return res.json([]);
    }

    const products = await Product.find({
      name: { $regex: q, $options: "i" }
    }).limit(10);

    res.json(products);

  } catch (err) {

    console.log("Search error:", err);
    res.status(500).json({ error: "Search failed" });

  }

});

// ⭐ GET PRODUCTS BY CATEGORY + SUBCATEGORY

router.get("/category/:category/:subCategory", async (req, res) => {

  const category = decodeURIComponent(req.params.category);
  const subCategory = decodeURIComponent(req.params.subCategory);

  const products = await Product.find({
    category: category,
    subCategory: subCategory
  });

  res.json(products);

});

// ➤ Add Product (Admin)
router.post("/add", upload.array("images", 5), async (req, res) => {

  try {

    const imagePaths = req.files.map(
      file => `/uploads/${file.filename}`
    );

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      subCategory: req.body.subCategory,
      price: req.body.price,
      images: imagePaths   // ⭐ array save
    });

    await product.save();

    res.json(product);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});



// ➤ Get All Products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ⭐ Get Single Product (VERY IMPORTANT)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: "Invalid ID" });
  }
});

// ➤ Delete Product
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product Deleted" });
});

// ⭐ Update Product
router.put("/:id", upload.array("images", 5), async (req, res) => {

  try {

    // existing images (जो admin ने delete नहीं की)
    const existingImages = JSON.parse(req.body.existingImages || "[]");

    // new uploaded images
    let newImages = [];

    if (req.files && req.files.length > 0) {
      newImages = req.files.map(
        file => `/uploads/${file.filename}`
      );
    }

    // merge old + new images
    const images = [...existingImages, ...newImages];

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      subCategory: req.body.subCategory,
      price: req.body.price,
      images
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" }
    );

    res.json(product);

  } catch (err) {

    console.log(err);
    res.status(500).json(err);

  }

});

export default router;