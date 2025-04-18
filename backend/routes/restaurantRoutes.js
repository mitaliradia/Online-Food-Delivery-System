const express = require("express")
const router = express.Router()
const restaurantController = require("../controllers/restaurantController")

// GET all restaurants
router.get("/restaurants", restaurantController.getAllRestaurants)

// GET restaurant by ID
router.get("/restaurants/:id", restaurantController.getRestaurantById)

module.exports = router
