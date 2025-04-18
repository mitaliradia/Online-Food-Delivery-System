function Footer() {
    return (
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>FoodExpress</h3>
            <p>Your favorite food, delivered fast.</p>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@foodexpress.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <i className="fab fa-facebook"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 FoodExpress. All rights reserved.</p>
        </div>
      </footer>
    )
  }
  
  export default Footer
  