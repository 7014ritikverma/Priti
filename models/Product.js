import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  subCategory: String,
  price: Number,
  images: {
    type: [String],
    default: []
  }
});

export default mongoose.model("Product", productSchema);