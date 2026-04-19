import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

function ProductCard({ product, quantity, addToCart, updateQuantity }) {
  return (
    <div className={`product-card ${product.isGreen ? 'eco-border' : ''}`}>

      {product.badge && (
        <div className="product-badge">{product.badge}</div>
      )}

      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-img-wrapper">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="eco-indicator">
          🌱 Eco {product.ecoScore}
        </div>

        <h3 className="product-name">{product.name}</h3>
        <p className="product-weight">{product.weight}</p>
      </Link>

      <div className="product-footer">
        <div>
          <div className="product-price">₹{product.price}</div>
          <div className="carbon-saved">
            -{product.carbonSaved} CO₂
          </div>
        </div>

        {quantity > 0 ? (
          <div className="card-qty-controls">
            <button className="qty-action-btn" onClick={() => updateQuantity(product.id, -1)}>−</button>
            <span className="qty-number">{quantity}</span>
            <button className="qty-action-btn plus" onClick={() => updateQuantity(product.id, 1)}>+</button>
          </div>
        ) : (
          <button className="add-cart-btn" onClick={() => addToCart(product)}>
            ADD
          </button>
        )}

      </div>

      {product.isGreen && (
        <div className="eco-choice-strip">
          <Leaf size={12} /> Eco Choice
        </div>
      )}

    </div>
  );
}

export default ProductCard;