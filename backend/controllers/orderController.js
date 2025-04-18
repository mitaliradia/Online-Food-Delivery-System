const pool = require("../config/db")

// Place a new order
exports.placeOrder = async (req, res) => {
  // Start a transaction
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const {
      customerId,
      restaurantId,
      items, // Array of { menuItemId, quantity }
    } = req.body

    // Get a random driver
    const [drivers] = await connection.query("SELECT * FROM delivery_drivers ORDER BY RAND() LIMIT 1")
    const driverId = drivers.length > 0 ? drivers[0].driver_id : null

    // 1. Create a new order in food_orders table
    const [orderResult] = await connection.query(
      "INSERT INTO food_orders (customer_id, restaurant_id, order_status_id, assigned_driver_id, order_datetime) VALUES (?, ?, ?, ?, NOW())",
      [customerId, restaurantId, 1, driverId], // Assuming 1 is the status for "Pending"
    )

    const orderId = orderResult.insertId

    // 2. Insert order items
    let totalAmount = 0

    for (const item of items) {
      // Get the price of the menu item
      const [menuItemResult] = await connection.query("SELECT price FROM menu_items WHERE id = ?", [item.menuItemId])

      if (menuItemResult.length === 0) {
        throw new Error(`Menu item with ID ${item.menuItemId} not found`)
      }

      const price = menuItemResult[0].price
      totalAmount += price * item.quantity

      // Insert into order_menu_items
      await connection.query("INSERT INTO order_menu_items (order_id, menu_item_id, qty_ordered) VALUES (?, ?, ?)", [
        orderId,
        item.menuItemId,
        item.quantity,
      ])
    }

    // Get delivery fee
    const deliveryFee = 2.99 // Default value

    // 3. Create payment record
    await connection.query(
      "INSERT INTO payments (order_id, delivery_fee, total_amt, payment_method) VALUES (?, ?, ?, ?)",
      [orderId, deliveryFee, totalAmount + deliveryFee, "Credit Card"],
    )

    // Get order details for response
    const [orderDetails] = await connection.query(
      `SELECT fo.*, r.restaurant_name, dd.name as driver_name, dd.phone_no as driver_phone
       FROM food_orders fo
       JOIN restaurants r ON fo.restaurant_id = r.id
       LEFT JOIN delivery_drivers dd ON fo.assigned_driver_id = dd.driver_id
       WHERE fo.id = ?`,
      [orderId],
    )

    // Get ordered items with details
    const [orderedItems] = await connection.query(
      `SELECT omi.*, mi.ITEM_NAME, mi.price
       FROM order_menu_items omi
       JOIN menu_items mi ON omi.menu_item_id = mi.id
       WHERE omi.order_id = ?`,
      [orderId],
    )

    // Get payment details
    const [paymentDetails] = await connection.query("SELECT * FROM payments WHERE order_id = ?", [orderId])

    await connection.commit()

    res.status(201).json({
      message: "Order placed successfully",
      order: orderDetails[0],
      items: orderedItems,
      payment: paymentDetails[0] || null,
    })
  } catch (error) {
    await connection.rollback()
    console.error("Error placing order:", error)
    res.status(500).json({ message: "Error placing order", error: error.message })
  } finally {
    connection.release()
  }
}

// Get order details
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params

    // Get order details
    const [orderDetails] = await pool.query(
      `SELECT fo.*, r.restaurant_name, os.status_value, dd.name as driver_name, dd.phone_no as driver_phone
       FROM food_orders fo
       JOIN restaurants r ON fo.restaurant_id = r.id
       JOIN order_status os ON fo.order_status_id = os.id
       LEFT JOIN delivery_drivers dd ON fo.assigned_driver_id = dd.driver_id
       WHERE fo.id = ?`,
      [id],
    )

    if (orderDetails.length === 0) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Get order items
    const [orderItems] = await pool.query(
      `SELECT omi.*, mi.ITEM_NAME, mi.price
       FROM order_menu_items omi
       JOIN menu_items mi ON omi.menu_item_id = mi.id
       WHERE omi.order_id = ?`,
      [id],
    )

    // Get payment details
    const [paymentDetails] = await pool.query("SELECT * FROM payments WHERE order_id = ?", [id])

    res.status(200).json({
      order: orderDetails[0],
      items: orderItems,
      payment: paymentDetails[0] || null,
    })
  } catch (error) {
    console.error("Error fetching order details:", error)
    res.status(500).json({ message: "Error fetching order details", error: error.message })
  }
}
