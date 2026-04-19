import { useState, useEffect } from "react";
import { Search, Filter, Leaf } from "lucide-react";
import productsData from "../data/products.json";
import ProductCard from "./productCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ProductSection({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [ecoOnly, setEcoOnly] = useState(false);

  // Load products
  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(productsData);
        }
      })
      .catch(err => {
        console.error("Error fetching products, falling back to local data:", err);
        setProducts(productsData);
      });
  }, []);

  // Get unique categories
  const categories = ["All", ...new Set(productsData.map(p => p.category))];

  // Filter logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesEco = !ecoOnly || product.isGreen || product.ecoScore >= 70;
    return matchesSearch && matchesCategory && matchesEco;
  });

  // Add to cart
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Update quantity
  const updateQuantity = (id, change) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + change }
        : item
    ).filter(item => item.quantity > 0));
  };

  return (
    <section className="recommendations" id="products">
      <div className="container">

        <div className="section-title-row">
          <h2>Sustainable Bestsellers</h2>
          <span className="see-all">See All</span>
        </div>

        {/* Search + Filters */}
        <div className="product-filters">
          <div className="product-search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="product-filter-row">
            <div className="category-filters">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              className={`eco-filter-btn ${ecoOnly ? 'active' : ''}`}
              onClick={() => setEcoOnly(!ecoOnly)}
            >
              <Leaf size={16} />
              {ecoOnly ? 'Show All' : 'Eco Only 🌱'}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => {
              const cartItem = cart.find(item => item.id === product.id);
              const quantity = cartItem ? cartItem.quantity : 0;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={quantity}
                  addToCart={addToCart}
                  updateQuantity={updateQuantity}
                />
              );
            })
          ) : (
            <div className="no-products-msg">
              No products found matching your criteria.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default ProductSection;