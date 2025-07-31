import "./config.ts";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";

const app = express();
const allowedOrigins = [
  "http://localhost:3100",
  "http://localhost:3000",
  "http://localhost",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(3001, "0.0.0.0", () => {
  console.log("Server started");
});
