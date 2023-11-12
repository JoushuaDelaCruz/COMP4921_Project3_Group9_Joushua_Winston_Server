import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.send("Welcome to users router!");
});

router.post("/register", (req, res) => {
  res.send("Register user");
});

export default router;
