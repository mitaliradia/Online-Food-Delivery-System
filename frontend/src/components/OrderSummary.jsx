"use client"

function OrderSummary({ selectedItems, onPlaceOrder, isLoading }) {
  // Calculate subtotal
  const subtotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = 2.99
  const total = subtotal + deliveryFee

  return (
    <div className="order-summary">
      <h2>
        <i className="fas fa-shopping-cart"></i> Your Order
      </h2>

      {selectedItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          <div className="order-items">
            {selectedItems.map((item) => (
              <div key={item.id} className="order-item">
                <div className="order-item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="subtotal">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="delivery-fee">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button className="place-order-btn" onClick={onPlaceOrder} disabled={isLoading || selectedItems.length === 0}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Processing...
              </>
            ) : (
              <>
                <i className="fas fa-check-circle"></i> Place Order
              </>
            )}
          </button>
        </>
      )}
    </div>
  )
}

export default OrderSummary
