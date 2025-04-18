"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

function OrderConfirmationPage() {
  const { orderId } = useParams()
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Fetch order details
    fetch(`http://localhost:5000/api/order/${orderId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }
        return response.json()
      })
      .then((data) => {
        setOrderDetails(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching order details:", error)
        setError(error.message)
        setLoading(false)
      })
  }, [orderId])

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading order details...</p>
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

  if (!orderDetails) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>Order not found</p>
      </div>
    )
  }

  const { order, items, payment } = orderDetails
  const orderDate = new Date(order.order_datetime).toLocaleString()

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-header">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1>Order Confirmed!</h1>
        <p>Your order has been successfully placed</p>
      </div>

      <div className="order-details-container">
        <div className="order-info">
          <h2>Order Information</h2>
          <div className="info-item">
            <span className="label">Order ID:</span>
            <span className="value">{order.id}</span>
          </div>
          <div className="info-item">
            <span className="label">Restaurant:</span>
            <span className="value">{order.restaurant_name}</span>
          </div>
          <div className="info-item">
            <span className="label">Order Date:</span>
            <span className="value">{orderDate}</span>
          </div>
          <div className="info-item">
            <span className="label">Status:</span>
            <span className="value status-badge">{order.status_value}</span>
          </div>
        </div>

        <div className="driver-info">
          <h2>Delivery Information</h2>
          {order.driver_name ? (
            <>
              <div className="driver-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="info-item">
                <span className="label">Driver:</span>
                <span className="value">{order.driver_name}</span>
              </div>
              <div className="info-item">
                <span className="label">Contact:</span>
                <span className="value">{order.driver_phone}</span>
              </div>
            </>
          ) : (
            <p>Driver not yet assigned</p>
          )}
        </div>
      </div>

      <div className="order-items-section">
        <h2>Order Items</h2>
        <div className="order-items-list">
          {items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-info">
                <span className="item-name">{item.ITEM_NAME}</span>
                <span className="item-quantity">x{item.qty_ordered}</span>
              </div>
              <span className="item-price">${(item.price * item.qty_ordered).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <div className="summary-item">
            <span>Subtotal</span>
            <span>${items.reduce((total, item) => total + item.price * item.qty_ordered, 0).toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Delivery Fee</span>
            <span>${payment.delivery_fee.toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total</span>
            <span>${payment.total_amt.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="actions">
        <Link to="/restaurants" className="action-button">
          <i className="fas fa-utensils"></i> Place Another Order
        </Link>
        <Link to="/" className="action-button secondary">
          <i className="fas fa-home"></i> Back to Home
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
