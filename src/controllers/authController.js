import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Organisation from "../models/Organisation.js";
import User from "../models/User.js";
import Log from "../models/Log.js";

export const register = async (req, res) => {
  const { orgName, adminName, email, password } = req.body;

  try {
    const org = await Organisation.create({ name: orgName });
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      organisation_id: org.id,
      name: adminName,
      email,
      password_hash: hash,
    });

    const token = jwt.sign(
      { userId: user.id, orgId: org.id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    await Log.create({
      organisation_id: org.id,
      user_id: user.id,
      action: "organisation_registered",
      meta: { email },
    });

    res.status(201).json({ token });
  } catch (e) {
    console.error("Registration error:", e);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email }});
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, orgId: user.organisation_id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    await Log.create({
      organisation_id: user.organisation_id,
      user_id: user.id,
      action: "login",
      meta: { email },
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
