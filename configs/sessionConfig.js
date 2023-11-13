import { mongoStore } from "./mongoStore.js";

const node_session_secret = process.env.NODE_SESSION_SECRET;
const expireTime = 60 * 60 * 1000;

export const sessionConfig = {
  secret: node_session_secret,
  resave: true,
  saveUninitialized: false,
  store: mongoStore,
  cookie: {
    maxAge: expireTime,
  },
};
