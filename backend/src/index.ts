import express from "express";
import cors from "cors";
import "dotenv/config";
import { Request, Response } from "express";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/test", async (req: Request, res: Response) => {
  res.send("Hello");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
