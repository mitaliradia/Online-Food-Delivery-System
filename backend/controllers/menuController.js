const pool = require("../config/db")

// Get menu items by restaurant name
exports.getMenuByRestaurantName = async (req, res) => {
  try {
    const { restaurantName } = req.params

    // First get the restaurant ID
    const [restaurant] = await pool.query("SELECT id FROM restaurants WHERE restaurant_name = ?", [restaurantName])

    if (restaurant.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    const restaurantId = restaurant[0].id

    // Then get the menu items
    const [menuItems] = await pool.query("SELECT * FROM menu_items WHERE restaurant_id = ?", [restaurantId])

    res.status(200).json(menuItems)
  } catch (error) {
    console.error("Error fetching menu items:", error)
    res.status(500).json({ message: "Error fetching menu items", error: error.message })
  }
}
