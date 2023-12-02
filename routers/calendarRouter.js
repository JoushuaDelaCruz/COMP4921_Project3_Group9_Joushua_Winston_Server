import { Router } from "express";
import * as db_calendar from "../databases/db_calendar.js";
import * as db_profile from "../databases/db_profile.js";
const router = Router();

router.get("/", (_, res) => {
  res.send("Welcome to calendar router!");
});

router.get("/userEvents", async (req, res) => {
  if(req.session.authenticated) {
    let results = await db_calendar.getEventsById(req.session.user_id);
    res.send({ events: results, success: true });
    return;
  }
  res.status(401).json({ message: "Invalid session" });
  return;
});

router.post("/createEvent", async (req, res) => {
  if(req.session.authenticated) {
    const created_datetime = new Date();
    // let end_datetime = new Date(req.body.end_datetime);
    // if(req.body.is_all_day) {
    //   end_datetime.setMinutes(end_datetime.getMinutes() - 1);
    // }
    const eventData = {
      user_id: req.session.user_id,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      start_datetime: req.body.start_datetime,
      end_datetime: req.body.end_datetime,
      is_all_day: req.body.is_all_day,
      start_timezone: req.body.start_timezone,
      end_timezone: req.body.end_timezone,
      recurrence_rule: req.body.recurrence_rule,
      created_datetime: created_datetime,
      event_colour: req.body.event_colour || "WIP",
      uuid: req.body.uuid
    }


    const isSuccessful = await db_calendar.createEvent(eventData);
    if (isSuccessful) {
      if (req.body.added_friends) {
        res.redirect(307, '/calendar/sendEventRequest');
        return;
      } else {
        res.json({ success: true });
        return;
      }
    }
    res.status(500).json({ message: "Error creating event" });
    return;
  }
})

router.post("/updateEvent", async (req, res) => {
  if(req.session.authenticated) {
    const created_datetime = new Date();
    const eventData = {
      user_id: req.session.user_id,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      start_datetime: req.body.start_datetime,
      end_datetime: req.body.end_datetime,
      is_all_day: req.body.is_all_day,
      start_timezone: req.body.start_timezone,
      end_timezone: req.body.end_timezone,
      recurrence_rule: req.body.recurrence_rule,
      created_datetime: created_datetime,
      event_colour: req.body.event_colour || "WIP",
      uuid: req.body.uuid
    }


    const isSuccessful = await db_calendar.updateEvent(eventData);
    if (isSuccessful) {
      res.json({ success: true });
      return;
    }
    res.status(500).json({ message: "Error updating event" });
    return;
  }
})

router.post("/deleteEvent", async (req, res) => {
  if(req.session.authenticated) {

    const eventData = {
      uuid: req.body.uuid
    }


    let results = await db_calendar.deleteEvent(eventData);
    if (results) {
      res.send({ success: true });
      return;
    }
    res.status(500).json({ message: "Error deleting event" });
    return;
  }
  res.status(401).json({ message: "Invalid session" });
  return;
})

router.post("/sendEventRequest", async (req, res) => {
  console.log(req.body.added_friends);
  const success = db_calendar.sendEventRequest(req.body.uuid, req.body.added_friends);
})

export default router;
