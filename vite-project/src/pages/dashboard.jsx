import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShoppingBag, TrendingDown, BarChart3, Award, ArrowLeft, TreePine } from 'lucide-react';
import '../styles/dashboard.css';
import '../styles/style.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch real orders from backend
      if (parsedUser.id) {
        fetch(`http://localhost:5000/api/orders/user/${parsedUser.id}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setOrders(data);
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Calculate REAL stats from actual orders
  const totalOrders = orders.length;

  const totalCO2Saved = orders.reduce((sum, order) => {
    return sum + (order.totalCarbonFootprint || 0);
  }, 0);

  const greenOrders = orders.filter(order =>
    order.deliveryOption === 'green' || order.deliveryOption === 'Green Delivery'
  ).length;

  // Count eco items from cart (current session)
  const storedCart = localStorage.getItem('greenCart');
  const cart = storedCart ? JSON.parse(storedCart) : [];
  const cartCO2 = cart.reduce((sum, item) => {
    const val = typeof item.carbonSaved === 'string'
      ? parseFloat(item.carbonSaved.replace('kg', ''))
      : Number(item.carbonSaved);
    return sum + (val * (item.quantity || 1));
  }, 0);

  const totalCO2Display = (totalCO2Saved + cartCO2).toFixed(1);
  const ecoItemsCount = orders.reduce((sum, order) => sum + (order.items ? order.items.length : 0), 0);

  // Monthly data from orders (group by month)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyMap = {};
  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const monthKey = monthNames[date.getMonth()];
    if (!monthlyMap[monthKey]) monthlyMap[monthKey] = 0;
    monthlyMap[monthKey] += (order.totalCarbonFootprint || 0);
  });

  // Add current cart CO2 to current month
  const currentMonth = monthNames[new Date().getMonth()];
  if (!monthlyMap[currentMonth]) monthlyMap[currentMonth] = 0;
  monthlyMap[currentMonth] += cartCO2;

  const monthlyData = Object.keys(monthlyMap).length > 0
    ? Object.entries(monthlyMap).map(([month, co2]) => ({ month, co2 }))
    : [{ month: currentMonth, co2: cartCO2 }];

  const maxCO2 = Math.max(...monthlyData.map(d => d.co2), 0.1);

  // Green level calculation
  const getLevel = () => {
    if (totalOrders >= 10) return { emoji: '🌍', name: 'Hero', next: 'You reached the top!', progress: 100 };
    if (totalOrders >= 5) return { emoji: '🌳', name: 'Champion', next: `${10 - totalOrders} more orders to reach Hero`, progress: (totalOrders / 10) * 100 };
    if (totalOrders >= 2) return { emoji: '🌿', name: 'Grower', next: `${5 - totalOrders} more orders to reach Champion`, progress: (totalOrders / 10) * 100 };
    return { emoji: '🌱', name: 'Sprout', next: `${2 - totalOrders} more orders to reach Grower`, progress: (totalOrders / 10) * 100 };
  };

  const level = getLevel();

  if (loading) {
    return <div className="loading-page">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dash-header">
        <div className="container dash-header-content">
          <Link to="/" className="dash-back">
            <ArrowLeft size={20} /> Back to Shop
          </Link>
          <h1><Leaf size={24} /> Sustainability Dashboard</h1>
          <p>
            {user
              ? `Welcome, ${user.name}! Here's your real environmental impact.`
              : 'Log in to track your environmental impact across orders.'}
          </p>
        </div>
      </div>

      <div className="container dash-content">

        {/* Not logged in message */}
        {!user && (
          <div className="dash-login-prompt">
            <p>📊 You're not logged in. <Link to="/login">Log in</Link> to see your personalized stats and order history.</p>
          </div>
        )}

        {/* Stat Cards */}
        <div className="dash-stats-grid">
          <div className="dash-stat-card co2-card">
            <div className="dash-stat-icon">
              <TrendingDown size={28} />
            </div>
            <div className="dash-stat-info">
              <span className="dash-stat-value">{totalCO2Display} kg</span>
              <span className="dash-stat-label">Total CO₂ Saved</span>
            </div>
          </div>

          <div className="dash-stat-card orders-card">
            <div className="dash-stat-icon">
              <ShoppingBag size={28} />
            </div>
            <div className="dash-stat-info">
              <span className="dash-stat-value">{totalOrders}</span>
              <span className="dash-stat-label">Total Orders</span>
            </div>
          </div>

          <div className="dash-stat-card green-card">
            <div className="dash-stat-icon">
              <TreePine size={28} />
            </div>
            <div className="dash-stat-info">
              <span className="dash-stat-value">{greenOrders}</span>
              <span className="dash-stat-label">Green Deliveries</span>
            </div>
          </div>

          <div className="dash-stat-card eco-card">
            <div className="dash-stat-icon">
              <Award size={28} />
            </div>
            <div className="dash-stat-info">
              <span className="dash-stat-value">{ecoItemsCount}</span>
              <span className="dash-stat-label">Items Ordered</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="dash-charts-grid">

          {/* Monthly CO₂ Chart */}
          <div className="dash-chart-card">
            <h2><BarChart3 size={20} /> Monthly CO₂ Savings</h2>
            {monthlyData.some(d => d.co2 > 0) ? (
              <div className="dash-bar-chart">
                {monthlyData.map((d, i) => (
                  <div className="dash-bar-col" key={i}>
                    <div className="dash-bar-wrapper">
                      <div
                        className="dash-bar"
                        style={{ height: `${(d.co2 / maxCO2) * 100}%` }}
                      >
                        <span className="dash-bar-value">{d.co2.toFixed(1)}kg</span>
                      </div>
                    </div>
                    <span className="dash-bar-label">{d.month}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dash-empty-chart">
                <p>📦 No orders yet. Place your first order to see your CO₂ savings here!</p>
              </div>
            )}
          </div>

          {/* Impact Summary */}
          <div className="dash-chart-card impact-card">
            <h2><Leaf size={20} /> Your Impact Summary</h2>

            <div className="dash-impact-list">
              <div className="dash-impact-item">
                <div className="dash-impact-icon">🌳</div>
                <div>
                  <strong>{(totalCO2Display / 21).toFixed(1)} Trees</strong>
                  <p>Equivalent trees planted</p>
                </div>
              </div>

              <div className="dash-impact-item">
                <div className="dash-impact-icon">🚗</div>
                <div>
                  <strong>{(totalCO2Display * 4.6).toFixed(0)} km</strong>
                  <p>Car emissions avoided</p>
                </div>
              </div>

              <div className="dash-impact-item">
                <div className="dash-impact-icon">💧</div>
                <div>
                  <strong>{(ecoItemsCount * 12).toFixed(0)} L</strong>
                  <p>Water saved through eco choices</p>
                </div>
              </div>

              <div className="dash-impact-item">
                <div className="dash-impact-icon">🗑️</div>
                <div>
                  <strong>{(ecoItemsCount * 0.3).toFixed(1)} kg</strong>
                  <p>Plastic waste prevented</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Progress Section */}
        <div className="dash-progress-section">
          <h2>🎯 Green Shopping Level</h2>
          <div className="dash-level-track">
            <div className="dash-level-labels">
              <span>🌱 Sprout</span>
              <span>🌿 Grower</span>
              <span>🌳 Champion</span>
              <span>🌍 Hero</span>
            </div>
            <div className="dash-level-bar">
              <div
                className="dash-level-fill"
                style={{ width: `${level.progress}%` }}
              ></div>
            </div>
            <p className="dash-level-text">
              You're a <strong>{level.emoji} {level.name}</strong>! {level.next}
            </p>
          </div>
        </div>

        {/* Green Tips */}
        <div className="dash-tips-section">
          <h2>💡 Green Tips</h2>
          <div className="dash-tips-grid">
            <div className="dash-tip-card">
              <span className="dash-tip-icon">🧴</span>
              <p><strong>Switch to bar soap</strong> — saves 75% packaging waste compared to liquid soap in plastic bottles.</p>
            </div>
            <div className="dash-tip-card">
              <span className="dash-tip-icon">🥤</span>
              <p><strong>Use a steel bottle</strong> — one reusable bottle replaces 167 single-use plastic bottles per year.</p>
            </div>
            <div className="dash-tip-card">
              <span className="dash-tip-icon">🛍️</span>
              <p><strong>Carry a tote bag</strong> — one cotton tote replaces 700+ plastic bags over its lifetime.</p>
            </div>
            <div className="dash-tip-card">
              <span className="dash-tip-icon">🚚</span>
              <p><strong>Choose green delivery</strong> — batched deliveries reduce carbon emissions by up to 40%.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
