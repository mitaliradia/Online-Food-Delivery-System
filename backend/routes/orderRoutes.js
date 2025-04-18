const express = require("express")
const router = express.Router()
const orderController = require("../controllers/orderController")

// POST place a new order
router.post("/order", orderController.placeOrder)

// GET order details by ID
router.get("/order/:id", orderController.getOrderById)

module.exports = router
