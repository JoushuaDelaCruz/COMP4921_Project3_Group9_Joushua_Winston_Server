import { Router } from "express";
import { hash, compare, genSaltSync } from "bcrypt";
import * as db_auth from "../databases/db_auth.js";

const router = Router();
const hashSalt = genSaltSync(12);

router.get("/", (_, res) => {
  res.send("Welcome to authentication router!");
});

router.post("/register", async (req, res) => {
  const username = req.body.data.username;
  const password = req.body.data.password;
  const email = req.body.data.email;
  const hashedPassword = await hash(password, hashSalt);
  const credentials = { email, username, password: hashedPassword };
  try {
    const isSuccessful = await db_auth.register(credentials);
    if (isSuccessful) {
      res.json({ success: true });
      return;
    }
    res.status(500).json({ message: "Error registering user" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(403).json({ message: "User or email already exists" });
      return;
    }
    res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  if (req.body === undefined) {
    res.status(400).send({ message: "Bad request" });
    return;
  }
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await db_auth.getUserByEmail(email);
    if (user === undefined) {
      res.json({ message: "User not found" });
      return;
    }
    if (!(await compare(password, user.password))) {
      res.json({ message: "Credential is incorrect" });
      return;
    }
    req.session.authenticated = true;
    req.session.user_id = user.user_id;
    req.session.username = user.username;
    res.json({ session: req.sessionID, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error logging in" });
    return;
  }
});

router.get("/checkUsernameExists/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const usernameExists = await db_auth.checkUsernameExists(username);
    if (usernameExists) {
      res.json({ message: "Username already exists", is_exists: true });
      return;
    }
    res.json({ is_exists: false });
  } catch (err) {
    res.status(500).send({ message: err.message, is_exists: true });
  }
});

router.get("/checkEmailExists/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const emailExists = await db_auth.checkEmailExists(email);
    if (emailExists) {
      res.json({ message: "Email already exists", is_exists: true });
      return;
    } else {
      res.json({ is_exists: false });
      return;
    }
  } catch (err) {
    res.status(500).send({ message: err.message, is_exists: true });
  }
});

router.post("/logout", (req, res) => {
  const session = req.cookies.session;
  req.sessionStore.destroy(session, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Error logging out" });
      return;
    }
    res.clearCookie("session");
    res.json({ success: true });
  });
});

export default router;
