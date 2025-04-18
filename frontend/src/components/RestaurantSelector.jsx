"use client"

import { useState, useEffect } from "react"

function RestaurantSelector({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch restaurants from the API
    fetch("http://localhost:5000/api/restaurants")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch restaurants")
        }
        return response.json()
      })
      .then((data) => {
        setRestaurants(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error)
        setError(error.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="loading">Loading restaurants...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="restaurant-selector">
      <h2>Select a Restaurant</h2>
      <div className="restaurant-list">
        {restaurants.length === 0 ? (
          <p>No restaurants available</p>
        ) : (
          restaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-card" onClick={() => onSelectRestaurant(restaurant)}>
              <h3>{restaurant.restaurant_name}</h3>
              <p>Click to view menu</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RestaurantSelector
