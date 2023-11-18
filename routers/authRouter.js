import { Router } from "express";
import { hash, compare, genSaltSync } from "bcrypt";
import * as db_auth from "../databases/db_auth.js";

const router = Router();
const hashSalt = genSaltSync(12);
const expireTime = 60 * 60 * 1000; // 1 hour

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
      res.send(true);
      return;
    }
    res.status(500).send(false);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).send(false);
      return;
    }
    res.status(500).send(false);
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.data.email;
  const password = req.body.data.password;
  try {
    const user = await db_auth.getUserByEmail(email);
    if (user === null) {
      res.send(false);
      return;
    }
    if (await compare(password, user.password)) {
      req.session.authenticated = true;
      req.session.user_id = user.user_id;
      req.session.username = user.username;
      req.session.cookie.maxAge = expireTime;
      res.send(req.sessionID);
      return;
    }
    res.send(null);
    return;
  } catch (err) {
    res.status(500).send(false);
    return;
  }
});

router.get("/checkUsernameExists/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const usernameExists = await db_auth.checkUsernameExists(username);
    res.send(usernameExists);
  } catch (err) {
    res.status(500).send(false);
  }
});

router.get("/checkEmailExists/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const emailExists = await db_auth.checkEmailExists(email);
    res.send(emailExists);
  } catch (err) {
    res.status(500).send(false);
  }
});

export default router;
