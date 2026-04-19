import { useState, useEffect } from "react";

import Navbar from "../components/navbar.jsx";
import EcoImpactBar from "../components/eco-impact.jsx";
import CartSidebar from "../components/cartSidebar.jsx";
import HeroSection from "../components/hero.jsx";
import EcoFeatures from "../components/ecoFeatures.jsx";

import ProductSection from "../components/productSection.jsx";
import EcoScoreSection from "../components/ecoScoreSection.jsx";
import Footer from "../components/footer.jsx";

function Home() {

  // 🛒 CART SIDEBAR OPEN/CLOSE
  const [isOpen, setIsOpen] = useState(false);

  // 📦 Load cart from localStorage
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("greenCart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // 💾 Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("greenCart", JSON.stringify(cart));
  }, [cart]);

  // 🌱 Calculate total CO2
  const totalCO2 = cart.reduce((sum, item) => {
    const val = typeof item.carbonSaved === 'string'
      ? parseFloat(item.carbonSaved.replace("kg", ""))
      : Number(item.carbonSaved);
    return sum + val * item.quantity;
  }, 0);

  // 🛒 Total cart count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* ECO IMPACT TOP BAR */}
      <EcoImpactBar co2={`${(12.4 + totalCO2).toFixed(1)}kg`} />

      {/* NAVBAR */}
      <Navbar cartCount={cartCount} setIsOpen={setIsOpen} />

      {/* CART SIDEBAR */}
      <CartSidebar cart={cart} setCart={setCart} isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* MAIN CONTENT */}
      <main>
        <HeroSection />
        <EcoFeatures />


        {/* PRODUCT SECTION (PASS CART) */}
        <ProductSection cart={cart} setCart={setCart} />

        {/* ECO SCORE (USES CO2) */}
        <EcoScoreSection totalCO2={totalCO2} />
      </main>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default Home;