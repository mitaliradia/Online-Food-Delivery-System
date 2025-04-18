"use client"

import { useState, useEffect } from "react"
import RestaurantCard from "../components/RestaurantCard"

function RestaurantPage() {
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

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading restaurants...</p>
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
    <div className="restaurant-page">
      <div className="page-header">
        <h1>
          <i className="fas fa-store"></i> Our Restaurants
        </h1>
        <p>Choose a restaurant to start your order</p>
      </div>

      <div className="restaurants-container">
        {restaurants.length === 0 ? (
          <p>No restaurants available</p>
        ) : (
          restaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)
        )}
      </div>
    </div>
  )
}

export default RestaurantPage
