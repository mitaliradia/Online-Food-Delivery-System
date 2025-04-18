import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import MenuPage from "./pages/MenuPage"
import RestaurantPage from "./pages/RestaurantPage"
import OrderConfirmationPage from "./pages/OrderConfirmation"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantPage />} />
          <Route path="/menu/:restaurantName" element={<MenuPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
