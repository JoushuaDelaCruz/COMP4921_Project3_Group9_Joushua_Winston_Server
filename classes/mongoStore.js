import MongoStore from "connect-mongo";

const mongodb_user = process.env.MONGO_USERNAME;
const mongodb_password = process.env.MONGO_PASSWORD;
const mongodb_session_secret = process.env.MONGO_SECRET_SESSION;

export const mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@database.dqrkyqg.mongodb.net/?retryWrites=true&w=majority`,
  crypto: {
    secret: mongodb_session_secret,
  },
  collectionName: "make-it-happen-sessions",
});
