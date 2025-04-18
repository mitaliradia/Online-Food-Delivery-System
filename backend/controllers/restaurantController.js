const pool = require("../config/db")

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM restaurants")
    res.status(200).json(rows)
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    res.status(500).json({ message: "Error fetching restaurants", error: error.message })
  }
}

// Get restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await pool.query("SELECT * FROM restaurants WHERE id = ?", [id])

    if (rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    res.status(200).json(rows[0])
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    res.status(500).json({ message: "Error fetching restaurant", error: error.message })
  }
}
