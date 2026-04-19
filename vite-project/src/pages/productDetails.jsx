import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Info, Package, Recycle, Award, Truck, Factory, ShoppingCart } from 'lucide-react';
import productsData from '../data/products.json';
import '../styles/productDetails.css';
import '../styles/style.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [alternative, setAlternative] = useState(null);

  useEffect(() => {
    const p = productsData.find(item => item.id === parseInt(id));
    if (p) {
      setProduct(p);
      if (p.alternativeId) {
        const alt = productsData.find(item => item.id === p.alternativeId);
        setAlternative(alt);
      }
    }
  }, [id]);

  const addToCart = (prod) => {
    const storedCart = localStorage.getItem("greenCart");
    let cart = storedCart ? JSON.parse(storedCart) : [];
    const existing = cart.find(item => item.id === prod.id);
    if (existing) {
      cart = cart.map(item => item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      cart = [...cart, { ...prod, quantity: 1 }];
    }
    localStorage.setItem("greenCart", JSON.stringify(cart));
    alert(`${prod.name} added to cart! 🛒`);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 50) return '#eab308';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Average';
    return 'Poor';
  };

  if (!product) return <div className="loading-page">Loading product...</div>;

  const totalCarbon = product.carbonBreakdown
    ? (product.carbonBreakdown.manufacturing + product.carbonBreakdown.packaging + product.carbonBreakdown.delivery)
    : 0;

  return (
    <div className="product-details-page">
      {/* Top Bar */}
      <div className="pd-topbar">
        <button onClick={() => navigate(-1)} className="pd-back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <Link to="/" className="pd-logo">🌿 GreenCart</Link>
      </div>

      <div className="container pd-layout">
        {/* Left: Product Image + Basic Info */}
        <div className="pd-left">
          <div className="pd-image-wrapper">
            {product.badge && <span className="pd-badge">{product.badge}</span>}
            <img src={product.image} alt={product.name} />
          </div>

          <div className="pd-basic-info">
            <h1>{product.name}</h1>
            <p className="pd-weight">{product.weight}</p>
            <p className="pd-description">{product.description}</p>
            <div className="pd-price-row">
              <span className="pd-price">₹{product.price}</span>
              <span className="pd-carbon-tag">
                <Leaf size={14} /> -{product.carbonSaved} CO₂
              </span>
            </div>
            <button className="pd-add-btn" onClick={() => addToCart(product)}>
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
        </div>

        {/* Right: Eco Score Breakdown + Comparison */}
        <div className="pd-right">

          {/* Eco Score Breakdown Card */}
          <div className="pd-eco-card">
            <h2><Leaf size={20} /> Eco Score Breakdown</h2>
            <div className="pd-score-circle" style={{ borderColor: getScoreColor(product.ecoScore) }}>
              <span className="pd-score-value">{product.ecoScore}</span>
              <span className="pd-score-label" style={{ color: getScoreColor(product.ecoScore) }}>
                {getScoreLabel(product.ecoScore)}
              </span>
            </div>

            <p className="pd-eco-explain-title">
              <Info size={14} /> How is this score calculated?
            </p>
            <div className="pd-eco-factors">
              <div className="pd-factor">
                <Package size={16} />
                <div>
                  <strong>Material</strong>
                  <span>{product.material}</span>
                </div>
              </div>
              <div className="pd-factor">
                <Recycle size={16} />
                <div>
                  <strong>Packaging</strong>
                  <span>{product.packaging}</span>
                </div>
              </div>
              <div className="pd-factor">
                <Award size={16} />
                <div>
                  <strong>Reusability</strong>
                  <span>{product.reusability}</span>
                </div>
              </div>
              {product.certifications && product.certifications.length > 0 && (
                <div className="pd-factor">
                  <Award size={16} />
                  <div>
                    <strong>Certifications</strong>
                    <span>{product.certifications.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Carbon Footprint Transparency Card */}
          {product.carbonBreakdown && (
            <div className="pd-carbon-card">
              <h2><Factory size={20} /> Carbon Footprint Breakdown</h2>
              <p className="pd-carbon-subtitle">
                Total: {totalCarbon.toFixed(2)} kg CO₂ per unit
              </p>

              <div className="pd-carbon-bars">
                <div className="pd-carbon-row">
                  <span><Factory size={14} /> Manufacturing</span>
                  <div className="pd-bar-track">
                    <div className="pd-bar-fill" style={{ width: `${(product.carbonBreakdown.manufacturing / 1.5) * 100}%`, background: '#ef4444' }}></div>
                  </div>
                  <span>{product.carbonBreakdown.manufacturing} kg</span>
                </div>
                <div className="pd-carbon-row">
                  <span><Package size={14} /> Packaging</span>
                  <div className="pd-bar-track">
                    <div className="pd-bar-fill" style={{ width: `${(product.carbonBreakdown.packaging / 1.5) * 100}%`, background: '#eab308' }}></div>
                  </div>
                  <span>{product.carbonBreakdown.packaging} kg</span>
                </div>
                <div className="pd-carbon-row">
                  <span><Truck size={14} /> Delivery</span>
                  <div className="pd-bar-track">
                    <div className="pd-bar-fill" style={{ width: `${(product.carbonBreakdown.delivery / 1.5) * 100}%`, background: '#3b82f6' }}></div>
                  </div>
                  <span>{product.carbonBreakdown.delivery} kg</span>
                </div>
              </div>
            </div>
          )}

          {/* Eco Comparison Card */}
          {alternative && (
            <div className="pd-comparison-card">
              <h2>🔄 Eco Comparison</h2>
              <p className="pd-comparison-subtitle">
                {product.isGreen
                  ? "You're viewing the eco-friendly option! Here's what you're replacing:"
                  : "There's a greener alternative available! Consider switching:"}
              </p>

              <div className="pd-comparison-grid">
                {/* Current Product */}
                <div className={`pd-compare-item ${product.isGreen ? 'green-highlight' : 'red-highlight'}`}>
                  <img src={product.image} alt={product.name} />
                  <h4>{product.name}</h4>
                  <div className="pd-compare-score" style={{ color: getScoreColor(product.ecoScore) }}>
                    Eco Score: {product.ecoScore}
                  </div>
                  <div className="pd-compare-price">₹{product.price}</div>
                  <div className="pd-compare-carbon">CO₂: {totalCarbon.toFixed(2)} kg</div>
                  {product.isGreen && <span className="pd-recommended-badge">✅ You chose this!</span>}
                </div>

                <div className="pd-vs">VS</div>

                {/* Alternative */}
                <div className={`pd-compare-item ${alternative.isGreen ? 'green-highlight' : 'red-highlight'}`}>
                  <img src={alternative.image} alt={alternative.name} />
                  <h4>{alternative.name}</h4>
                  <div className="pd-compare-score" style={{ color: getScoreColor(alternative.ecoScore) }}>
                    Eco Score: {alternative.ecoScore}
                  </div>
                  <div className="pd-compare-price">₹{alternative.price}</div>
                  <div className="pd-compare-carbon">
                    CO₂: {alternative.carbonBreakdown
                      ? (alternative.carbonBreakdown.manufacturing + alternative.carbonBreakdown.packaging + alternative.carbonBreakdown.delivery).toFixed(2)
                      : '?'} kg
                  </div>
                  {alternative.isGreen && <span className="pd-recommended-badge">🌱 Recommended</span>}
                  <button className="pd-switch-btn" onClick={() => navigate(`/product/${alternative.id}`)}>
                    {alternative.isGreen ? 'Switch to Green 🌱' : 'View This Option'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
