"use client"

import { useState } from "react"
import MenuList from "../components/MenuList"
import OrderSummary from "../components/OrderSummary"

function OrderPage({ restaurant, onBack }) {
  const [orderItems, setOrderItems] = useState([])
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleAddToOrder = (items) => {
    setOrderItems(items)
  }

  const handlePlaceOrder = () => {
    setOrderPlaced(true)
  }

  return (
    <div className="order-page">
      <button className="back-btn" onClick={onBack}>
        &larr; Back to Restaurants
      </button>

      <div className="order-container">
        {!orderPlaced ? (
          <>
            <div className="menu-section">
              <MenuList restaurant={restaurant} onAddToOrder={handleAddToOrder} />
            </div>

            <div className="summary-section">
              <OrderSummary items={orderItems} restaurant={restaurant} onPlaceOrder={handlePlaceOrder} />
            </div>
          </>
        ) : (
          <div className="order-success-container">
            <h2>Thank you for your order!</h2>
            <p>Your food will be delivered soon.</p>
            <button className="new-order-btn" onClick={onBack}>
              Place Another Order
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderPage
