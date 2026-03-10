import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    jwt.verify(token, "secretkey");

    next();

  } catch {

    res.status(401).json({ message: "Invalid token" });

  }

};