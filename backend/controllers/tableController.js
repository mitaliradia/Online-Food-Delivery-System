const pool = require("../config/db")

// Get all tables in the database
exports.getAllTables = async (req, res) => {
  try {
    // Get all table names
    const [tables] = await pool.query(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `,
      [process.env.DB_NAME],
    )

    // Get data from each table
    const tableData = {}

    for (const table of tables) {
      const tableName = table.table_name || table.TABLE_NAME
      const [rows] = await pool.query(`SELECT * FROM ${tableName}`)
      tableData[tableName] = rows
    }

    res.status(200).json(tableData)
  } catch (error) {
    console.error("Error fetching tables:", error)
    res.status(500).json({ message: "Error fetching tables", error: error.message })
  }
}
