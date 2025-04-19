"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import TableDisplay from "../components/TableDisplay"
import { API_BASE_URL } from '../config/api';

function HomePage() {
  const [tables, setTables] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tables`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setError('Unable to load tables. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [])

  return (
    <div className="home-page">
      {loading ? (
        <div className="loading-container">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading tables...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={fetchTables}>Try Again</button>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

export default HomePage
