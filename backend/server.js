const express = require("express")
const cors = require("cors")
require("dotenv").config()

// Import routes
const tableRoutes = require("./routes/tableRoutes")
const restaurantRoutes = require("./routes/restaurantRoutes")
const menuRoutes = require("./routes/menuRoutes")
const orderRoutes = require("./routes/orderRoutes")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(express.json())

// Routes
app.use("/api", tableRoutes)
app.use("/api", restaurantRoutes)
app.use("/api", menuRoutes)
app.use("/api", orderRoutes)

// Root route
app.get("/", (req, res) => {
  res.send("Food Delivery API is running")
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
