import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";
import "../styles/style.css";

function CartSidebar({ cart, setCart, isOpen, setIsOpen }) {
  const navigate = useNavigate();

  // Calculate totals
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalCO2 = cart.reduce((sum, item) => {
    const val = parseFloat(item.carbonSaved.replace("kg", ""));
    return sum + val * item.quantity;
  }, 0);

  // Update quantity
  const updateQuantity = (id, change) => {
    const updated = cart
      .map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + change }
          : item
      )
      .filter(item => item.quantity > 0);

    setCart(updated);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? "active" : ""}`}>

        {/* Header */}
        <div className="cart-header">
          <h2>Your Green Cart</h2>
          <button className="close-cart" onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>

        {/* Cart Items */}
        <div className="cart-items">

          {cart.length === 0 ? (
            <div className="empty-cart-msg">
              Your cart is currently empty.
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>

                <img
                  src={`/images/${item.image}`}
                  alt={item.name}
                  className="cart-item-img"
                />

                <div className="cart-item-details">
                  <div className="cart-item-title">{item.name}</div>

                  <div className="cart-item-actions">
                    <span>₹{item.price}</span>

                    <div className="card-qty-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <span>
                      -{(
                        parseFloat(item.carbonSaved.replace("kg", "")) *
                        item.quantity
                      ).toFixed(1)}kg CO₂
                    </span>
                  </div>
                </div>

              </div>
            ))
          )}

        </div>

        {/* Footer */}
        <div className="cart-footer">

          <div className="cart-summary-row">
            <span>Cart Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="cart-summary-row eco-row">
            <span>Total CO₂ Saved 🌱</span>
            <span>{totalCO2.toFixed(1)}kg</span>
          </div>

          <button
            className="btn-primary checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>

        </div>

      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="cart-overlay active"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default CartSidebar;