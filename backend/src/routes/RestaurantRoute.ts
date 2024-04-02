import express from "express";
import {
  validateMySearchRequest,
  validateRestaurantIdRequest,
} from "../middleware/validation";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get(
  "/:restaurantId",
  validateRestaurantIdRequest,
  RestaurantController.getRestaurant
);
router.get(
  "/search/:city",
  validateMySearchRequest,
  RestaurantController.searchRestaurants
);

export default router;
