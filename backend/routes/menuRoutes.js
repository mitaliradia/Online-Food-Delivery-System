const express = require("express")
const router = express.Router()
const menuController = require("../controllers/menuController")

// GET menu items by restaurant name
router.get("/menu/:restaurantName", menuController.getMenuByRestaurantName)

module.exports = router
