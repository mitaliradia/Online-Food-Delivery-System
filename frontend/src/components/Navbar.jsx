import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-utensils"></i>
          <span>FoodExpress</span>
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/restaurants" className="nav-link">
              Order Now
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
