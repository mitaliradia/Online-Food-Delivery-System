"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MenuItem from "../components/MenuItem"
import OrderSummary from "../components/OrderSummary"

function MenuPage() {
  const { restaurantName } = useParams()
  const navigate = useNavigate()

  const [restaurant, setRestaurant] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantities, setQuantities] = useState({})
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  useEffect(() => {
    // Fetch menu items for the selected restaurant
    fetch(`http://localhost:5000/api/menu/${encodeURIComponent(restaurantName)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch menu items")
        }
        return response.json()
      })
      .then((data) => {
        setMenuItems(data)

        // Initialize quantities
        const initialQuantities = {}
        data.forEach((item) => {
          initialQuantities[item.id] = 0
        })
        setQuantities(initialQuantities)

        // Get restaurant details
        if (data.length > 0) {
          fetch(`http://localhost:5000/api/restaurants/${data[0].restaurant_id}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch restaurant details")
              }
              return response.json()
            })
            .then((restaurantData) => {
              setRestaurant(restaurantData)
              setLoading(false)
            })
            .catch((error) => {
              console.error("Error fetching restaurant details:", error)
              setError(error.message)
              setLoading(false)
            })
        } else {
          setLoading(false)
        }
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error)
        setError(error.message)
        setLoading(false)
      })
  }, [restaurantName])

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 0) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: newQuantity,
      }))
    }
  }

  const getSelectedItems = () => {
    return Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => {
        const item = menuItems.find((item) => item.id.toString() === itemId)
        return {
          id: itemId,
          menuItemId: Number.parseInt(itemId),
          name: item.ITEM_NAME,
          price: item.price,
          quantity,
        }
      })
  }

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true)

    const selectedItems = getSelectedItems()

    if (selectedItems.length === 0) {
      setError("Please select at least one item")
      setIsPlacingOrder(false)
      return
    }

    // Prepare order data
    const orderData = {
      customerId: 1, // In a real app, this would come from user authentication
      restaurantId: restaurant.id,
      items: selectedItems.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
    }

    // Send order to the API
    fetch("http://localhost:5000/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to place order")
        }
        return response.json()
      })
      .then((data) => {
        // Navigate to order confirmation page
        navigate(`/order-confirmation/${data.order.id}`)
      })
      .catch((error) => {
        console.error("Error placing order:", error)
        setError(error.message)
        setIsPlacingOrder(false)
      })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading menu items...</p>
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
    <div className="menu-page">
      <div className="page-header">
        <h1>
          <i className="fas fa-utensils"></i> {decodeURIComponent(restaurantName)} Menu
        </h1>
        <p>Select items to add to your order</p>
      </div>

      <div className="menu-container">
        <div className="menu-items-container">
          {menuItems.length === 0 ? (
            <p>No menu items available for this restaurant</p>
          ) : (
            menuItems.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                quantity={quantities[item.id] || 0}
                onQuantityChange={handleQuantityChange}
              />
            ))
          )}
        </div>

        <div className="order-summary-container">
          <OrderSummary selectedItems={getSelectedItems()} onPlaceOrder={handlePlaceOrder} isLoading={isPlacingOrder} />
        </div>
      </div>
    </div>
  )
}

export default MenuPage
