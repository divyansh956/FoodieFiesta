import express from "express";
import cors from "cors";
import "dotenv/config";
import { Request, Response } from "express";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/my/user", myUserRoute);

app.get("/health", async (req: Request, res: Response) => {
  res.send("Health Ok...");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
