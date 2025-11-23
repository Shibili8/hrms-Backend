import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Organisation from "../models/Organisation.js";
import User from "../models/User.js";
import Log from "../models/Log.js";

export const register = async (req, res) => {
  const { orgName, adminName, email, password } = req.body;

  try {
    if (!orgName || !adminName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

     const existingOrg = await Organisation.findOne({ where: { name: orgName } });
     if (existingOrg) {
       return res.status(400).json({ message: "Organisation name already exists" });
     }

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
      action: `User '${user.id}' created organisation ${org.id}.`,
      meta: null,
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
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ where: { email } });

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
      action: `User '${user.id}' logged in.`,
      meta: null,
    });

    res.json({ token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
