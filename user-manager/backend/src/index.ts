import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
