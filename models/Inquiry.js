import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({

  name: String,
  email: String,
  phone: String,
  message: String,

  products: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Inquiry", inquirySchema);