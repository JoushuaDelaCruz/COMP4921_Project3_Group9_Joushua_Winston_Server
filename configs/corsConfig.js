export const corsConfig = {
  origin: process.env.CLIENT_LOCAL_URL,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
  secure: true,
};
