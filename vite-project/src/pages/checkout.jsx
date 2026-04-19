import React, { useState, useEffect } from 'react';
import { ShieldCheck, Smartphone, CreditCard, Banknote, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/checkout.css';
import '../styles/style.css';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [deliverySpeed, setDeliverySpeed] = useState('green');
  const [paymentType, setPaymentType] = useState('upi');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("greenCart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    const user = localStorage.getItem("user");
    if (user) {
      setUserId(JSON.parse(user).id);
    }
  }, []);

  const getPrice = (price) => typeof price === 'string' ? parseFloat(price.replace('₹', '')) : Number(price);
  const getCarbon = (carbon) => typeof carbon === 'string' ? parseFloat(carbon.replace('kg', '')) : Number(carbon);

  const subtotal = cart.reduce((sum, item) => sum + (getPrice(item.price) * item.quantity), 0);
  const deliveryFee = deliverySpeed === 'express' ? 49 : 0;
  const total = subtotal + deliveryFee;
  const totalCO2 = cart.reduce((sum, item) => sum + (getCarbon(item.carbonSaved) * item.quantity), 0);

  const placeOrder = async () => {
    // Ideally we should have userId. For demo, we might skip or fail if not logged in.
    if (!userId) {
      alert("Please login to place an order");
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        userId,
        items: cart.map(item => {
          const idStr = String(item._id || item.id || "");
          const validObjectId = idStr.length === 24 ? idStr : '650e84000000000000000000';
          return { product: validObjectId, quantity: item.quantity };
        }),
        totalPrice: total,
        totalCarbonFootprint: totalCO2,
        deliveryOption: deliverySpeed === 'green' ? 'Green' : 'Normal'
      };

      await axios.post('http://localhost:5000/api/orders', orderData);
      alert('Order placed successfully! Thank you for choosing GreenCart.');
      localStorage.removeItem("greenCart");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="checkout-body">
      <header className="checkout-header">
        <div className="container nav-content">
          <div className="logo-container">
            <a href="/">
              <h2 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Leaf /> GreenCart
              </h2>
            </a>
          </div>
          <div className="checkout-secure-badge">
            <ShieldCheck /> Secure Checkout
          </div>
        </div>
      </header>

      <main className="container checkout-main">
        <div className="checkout-grid">
          <div className="checkout-forms">
            <h1 className="checkout-title">Complete Your Order</h1>

            <section className="checkout-section">
              <h2>1. Delivery Details</h2>
              <div className="form-grid">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="John Doe" required />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" required />
                </div>
                <div className="input-group full-width">
                  <label>Delivery Address</label>
                  <textarea rows="3" placeholder="Flat No, Building Name, Street..." required></textarea>
                </div>
              </div>
            </section>

            <section className="checkout-section eco-delivery-section">
              <h2>2. Choose Delivery Speed</h2>

              <label className={`delivery-option ${deliverySpeed === 'green' ? 'active' : ''}`}>
                <input type="radio" name="deliverySpeed" value="green" checked={deliverySpeed === 'green'} onChange={() => setDeliverySpeed('green')} />
                <div className="delivery-info">
                  <div className="delivery-header">
                    <span className="delivery-name">🌱 Green Delivery <span className="badge">Recommended</span></span>
                    <span className="delivery-price">Free</span>
                  </div>
                  <p className="delivery-desc">Batched delivery route. Lowest carbon footprint.</p>
                  <p className="delivery-time">Delivers in 24-48 hours</p>
                </div>
              </label>

              <label className={`delivery-option ${deliverySpeed === 'express' ? 'active' : ''}`}>
                <input type="radio" name="deliverySpeed" value="express" checked={deliverySpeed === 'express'} onChange={() => setDeliverySpeed('express')} />
                <div className="delivery-info">
                  <div className="delivery-header">
                    <span className="delivery-name">⚡ Express 10-Min Delivery</span>
                    <span className="delivery-price">₹49</span>
                  </div>
                  <p className="delivery-desc">Immediate dispatch. Higher carbon emission (~0.8kg CO₂).</p>
                </div>
              </label>
            </section>

            <section className="checkout-section">
              <h2>3. Payment Method</h2>

              <div className="payment-methods">
                <label className="payment-option">
                  <input type="radio" name="paymentType" value="upi" checked={paymentType === 'upi'} onChange={() => setPaymentType('upi')} />
                  <div className="payment-box">
                    <Smartphone />
                    <span>UPI / QR</span>
                  </div>
                </label>

                <label className="payment-option">
                  <input type="radio" name="paymentType" value="card" checked={paymentType === 'card'} onChange={() => setPaymentType('card')} />
                  <div className="payment-box">
                    <CreditCard />
                    <span>Credit/Debit</span>
                  </div>
                </label>

                <label className="payment-option">
                  <input type="radio" name="paymentType" value="cod" checked={paymentType === 'cod'} onChange={() => setPaymentType('cod')} />
                  <div className="payment-box">
                    <Banknote />
                    <span>Cash on Delivery</span>
                  </div>
                </label>
              </div>

              {paymentType === 'card' && (
                <div className="card-details-form">
                  <div className="input-group full-width">
                    <label>Card Number</label>
                    <input type="text" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" />
                    </div>
                    <div className="input-group">
                      <label>CVV</label>
                      <input type="password" placeholder="***" />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="checkout-summary">
            <div className="summary-card">
              <h2>Order Summary</h2>

              <div className="order-items-list">
                {cart.map((item, index) => {
                  const getPrice = (price) => typeof price === 'string' ? parseFloat(price.replace('₹', '')) : Number(price);
                  return (
                    <div key={index} className="order-item">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>₹{getPrice(item.price).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Item Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>Grand Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="eco-feedback-box">
                <Leaf />
                <div>
                  <strong>Great Choice!</strong>
                  <p>This order saves <span>{totalCO2.toFixed(1)}kg</span> of CO₂ compared to standard alternatives.</p>
                </div>
              </div>

              <button className="btn-primary place-order-btn" onClick={placeOrder}>
                Place Order • ₹{total.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
