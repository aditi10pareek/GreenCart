import heroImg from "../assets/images/hero_img.jpeg";
import "../styles/style.css";

function Hero() {

  const scrollToCategories = () => {
    const section = document.getElementById("categories");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      <div className="container hero-wrapper">

        <div className="hero-content">
          <h1>
            Shop Smart<br />
            <span>Choose Green.</span>
          </h1>

          <p>
            Compare products, track carbon impact, and make sustainable shopping choices.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={scrollToCategories}>
              Shop Now
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImg} alt="Eco friendly shopping" className="hero-img" />
        </div>

      </div>
    </section>
  );
}

export default Hero;