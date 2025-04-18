"use client"

function MenuItem({ item, onQuantityChange, quantity = 0 }) {
  return (
    <div className="menu-item">
      <div className="menu-item-info">
        <h3>{item.ITEM_NAME}</h3>
        <p className="menu-item-price">₹{item.price.toFixed(2)}</p>
      </div>
      <div className="menu-item-actions">
        <div className="quantity-control">
          <button
            className="quantity-btn"
            onClick={() => onQuantityChange(item.id, Math.max(0, quantity - 1))}
            disabled={quantity <= 0}
          >
            <i className="fas fa-minus"></i>
          </button>
          <span className="quantity">{quantity}</span>
          <button className="quantity-btn" onClick={() => onQuantityChange(item.id, quantity + 1)}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MenuItem
