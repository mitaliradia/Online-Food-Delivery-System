import { Link } from "react-router-dom"

function RestaurantCard({ restaurant }) {
  return (
    <div className="restaurant-card">
      <div className="restaurant-image">
        <i className="fas fa-store"></i>
      </div>
      <div className="restaurant-info">
        <h3>{restaurant.restaurant_name}</h3>
        <p>
          <i className="fas fa-map-marker-alt"></i> Address ID: {restaurant.address_id}
        </p>
      </div>
      <Link to={`/menu/${encodeURIComponent(restaurant.restaurant_name)}`} className="view-menu-btn">
        View Menu
      </Link>
    </div>
  )
}

export default RestaurantCard
