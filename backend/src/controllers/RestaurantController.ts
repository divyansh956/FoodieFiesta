import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";

const getRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    return res.json(restaurant);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Could not getRestaurant" });
  }
};

const searchRestaurants = async (req: Request, res: Response) => {
  try {
    const { city } = req.params;
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt((req.query.page as string) || "1");

    let query: any = {};
    query["city"] = new RegExp(city, "i"); // case-insensitive search
    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          pages: 1,
          page: 1,
          total: 0,
        },
      });
    }
    if (selectedCuisines) {
      // URL: /search/london?selectedCuisines=italian,indian
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cuisinesArray };
    }
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: searchRegex },
      ];
    }
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalRestaurants = await Restaurant.countDocuments(query);
    const response = {
      data: restaurants,
      pagination: {
        pages: Math.ceil(totalRestaurants / pageSize),
        page,
        total: totalRestaurants,
      },
    };
    return res.json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export default { searchRestaurants, getRestaurant };
