"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import TableDisplay from "../components/TableDisplay"

function HomePage() {
  const [tables, setTables] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tables", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTables(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tables:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTables();
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading database tables...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to FoodExpress</h1>
          <p>Your favorite food, delivered fast to your doorstep</p>
          <Link to="/restaurants" className="cta-button">
            <i className="fas fa-utensils"></i> Order Now
          </Link>
        </div>
      </section>

      <section className="database-section">
        <div className="section-header">
          <h2>Database Tables</h2>
          <p>Explore all the tables in our database</p>
        </div>

        <div className="tables-container">
          {Object.keys(tables).length === 0 ? (
            <p>No tables found in the database</p>
          ) : (
            Object.entries(tables).map(([tableName, tableData]) => (
              <TableDisplay key={tableName} tableName={tableName} tableData={tableData} />
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
