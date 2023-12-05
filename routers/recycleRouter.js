import { Router } from "express";
import * as db_calendar from "../databases/db_recycle.js";
const router = Router();

router.get("/", (_, res) => {
  res.send("Welcome to recycle router!");
});


router.get("/getEvents", async (req, res) => {
  const session = req.cookies.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error getting recycle bin" });
      return;
    }
    if (session === null) {
      res.status(400).json({ message: "Invalid session" });
      return;
    }
    const results = await db_calendar.getRecycleBin(
      session.user_id,
      session.username
    );

    res.send({ events: results, success: true });
    return;
  });
})

router.post("/restoreEvent", async(req, res) => {
  const session = req.cookies.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error restoring event" });
      return;
    }
    if (session === null) {
      res.status(400).json({ message: "Invalid session" });
      return;
    }
    const result = await db_calendar.restoreEvent(
      session.user_id,
      req.body.uuid
    );

    res.send({ success: result });
    return;
  });
})

router.delete("/deleteEvent", async(req, res) => {
  const session = req.cookies.session;
  req.sessionStore.get(session, async (err, session) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error deleting event" });
      return;
    }
    if (session === null) {
      res.status(400).json({ message: "Invalid session" });
      return;
    }
    const result = await db_calendar.recycleDeleteEvent(
      session.user_id,
      req.body.uuid
    );

    res.send({ success: true });
    return;
  });
})
export default router;
