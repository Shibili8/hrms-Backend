import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      orgId: decoded.orgId
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
