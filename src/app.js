import express from "express";
import authRouter from "./routes/auth.route.js";
import CookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server running",
  });
});
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(CookieParser());
app.use(express.json());
app.use("/api/v1", authRouter);

export default app;
