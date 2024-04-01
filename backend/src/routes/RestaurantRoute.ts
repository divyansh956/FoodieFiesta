import express from "express";
import { validateMySearchRequest } from "../middleware/validation";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get(
  "/search/:city",
  validateMySearchRequest,
  RestaurantController.searchRestaurants
);

export default router;
