"use client"

import { useState, useEffect } from "react"

function MenuList({ restaurant, onAddToOrder }) {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    // Fetch menu items for the selected restaurant
    fetch(`http://localhost:5000/api/menu/${encodeURIComponent(restaurant.restaurant_name)}`)
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

        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching menu items:", error)
        setError(error.message)
        setLoading(false)
      })
  }, [restaurant])

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 0) {
      setQuantities((prev) => ({
        ...prev,
        [itemId]: newQuantity,
      }))
    }
  }

  const handleAddToOrder = () => {
    const selectedItems = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => {
        const item = menuItems.find((item) => item.id.toString() === itemId)
        return {
          menuItemId: Number.parseInt(itemId),
          name: item.ITEM_NAME,
          price: item.price,
          quantity,
        }
      })

    onAddToOrder(selectedItems)
  }

  if (loading) return <div className="loading">Loading menu items...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="menu-list">
      <h2>Menu for {restaurant.restaurant_name}</h2>

      {menuItems.length === 0 ? (
        <p>No menu items available for this restaurant</p>
      ) : (
        <>
          <div className="menu-items">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-item">
                <div className="menu-item-details">
                  <h3>{item.ITEM_NAME}</h3>
                  <p className="price">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="quantity-control">
                  <button
                    onClick={() => handleQuantityChange(item.id, quantities[item.id] - 1)}
                    disabled={quantities[item.id] <= 0}
                  >
                    -
                  </button>
                  <span>{quantities[item.id]}</span>
                  <button onClick={() => handleQuantityChange(item.id, quantities[item.id] + 1)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="add-to-order-btn"
            onClick={handleAddToOrder}
            disabled={Object.values(quantities).every((q) => q === 0)}
          >
            Add to Order
          </button>
        </>
      )}
    </div>
  )
}

export default MenuList
