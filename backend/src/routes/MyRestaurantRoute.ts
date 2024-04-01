import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { validateMyRestaurantRequest } from "../middleware/validation";
import { jwtCheck, jwtParse } from "../middleware/Auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

router.post(
  "/",
  upload.single("imageFile"),
  jwtCheck,
  jwtParse,
  validateMyRestaurantRequest,
  MyRestaurantController.createMyRestaurant
);

export default router;
