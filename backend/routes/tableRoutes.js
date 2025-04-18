const express = require("express")
const router = express.Router()
const tableController = require("../controllers/tableController")

// GET all tables
router.get("/tables", tableController.getAllTables)

module.exports = router
