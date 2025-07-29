import "./config.ts";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3100",
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
