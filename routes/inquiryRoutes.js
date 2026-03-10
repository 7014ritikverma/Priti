import express from "express";
import Inquiry from "../models/Inquiry.js";

const router = express.Router();


// ➤ Send Inquiry
// router.post("/", async (req, res) => {

//   const inquiry = new Inquiry({
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone,
//     message: req.body.message,
//     products: req.body.products   // ⭐ VERY IMPORTANT
//   });

//   await inquiry.save();

//   res.json({ message: "Inquiry saved" });
// });

router.post("/", async (req, res) => {

  try {

    const inquiry = new Inquiry(req.body);

    await inquiry.save();

    res.json({ message: "Inquiry saved" });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

});


// ➤ Get All Inquiries (Admin)
router.get("/", async (req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
});

// ⭐ Delete inquiry
router.delete("/:id", async (req, res) => {
  await Inquiry.findByIdAndDelete(req.params.id);
  res.json({ message: "Inquiry Deleted" });
});

export default router;