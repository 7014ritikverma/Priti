import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {

  const adminCount = await Admin.countDocuments();

  if (adminCount > 0) {
    return res.status(403).json({
      message: "Admin already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const admin = new Admin({
    email: req.body.email,
    password: hashedPassword
  });

  await admin.save();

  res.json({ message: "Admin created" });

});

// router.get("/reset-admin", async (req, res) => {

//   const admin = await Admin.findOne();

//   admin.email = "allcrazynation@gmail.com";

//   admin.password = await bcrypt.hash("123456", 10);

//   await admin.save();

//   res.send("Admin Reset Done");

// });

router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const match = await bcrypt.compare(password, admin.password);

  if (!match) {
    return res.status(401).json({ message: "Wrong password" });
  }

  const token = jwt.sign(
    { id: admin._id },
    "secretkey",
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token
  });

});

router.put("/update-admin", async (req, res) => {

  try {

    const { email, oldPassword, newPassword } = req.body;

    const admin = await Admin.findOne();

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    // check old password
    const match = await bcrypt.compare(
      oldPassword,
      admin.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Old password incorrect"
      });
    }

    // update email
    if (email) {
      admin.email = email;
    }

    // update password
    if (newPassword) {
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();

    res.json({
      message: "Admin updated successfully"
    });

  } catch (err) {

    console.log(err);
    res.status(500).json({
      message: "Server error"
    });

  }

});

// ⭐ Login Admin
// router.post("/login", async (req, res) => {

//   const admin = await Admin.findOne({ email: req.body.email });

//   if (!admin) {
//     return res.status(400).json({ message: "Admin not found" });
//   }

//   const match = await bcrypt.compare(req.body.password, admin.password);

//   if (!match) {
//     return res.status(400).json({ message: "Wrong password" });
//   }

//   const token = jwt.sign(
//     { id: admin._id },
//     "secretkey",
//     { expiresIn: "1d" }
//   );

//   res.json({ token });

// });

export default router;