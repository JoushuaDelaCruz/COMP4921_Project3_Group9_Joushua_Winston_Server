import { Router } from "express";
import { hash } from "bcrypt";
import * as authDB from "../databases/db_auth.js";

const router = Router();
const hashSalt = 12;
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
    const isSuccessful = await authDB.register(credentials);
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

export default router;
