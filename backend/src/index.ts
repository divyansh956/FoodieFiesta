import express from "express";
import cors from "cors";
import "dotenv/config";
import { Request, Response } from "express";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";
import { v2 as cloudinary } from "cloudinary";

const app = express();

const corsOptions = {
  origin: [process.env.CLIENT_URL as string],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  crendentials: true
};

app.use(cors(corsOptions));
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);

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
