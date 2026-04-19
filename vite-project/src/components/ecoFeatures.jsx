import "../styles/style.css";

function EcoFeatures() {

  const features = [
    {
      icon: "🌱",
      title: "Eco-Rated Products",
      desc: "Know the sustainability score before buying."
    },
    {
      icon: "🌍",
      title: "Carbon Impact Tracking",
      desc: "See how your shopping affects the planet."
    },
    {
      icon: "♻️",
      title: "Green Alternatives",
      desc: "Switch to eco-friendly products easily."
    },
    {
      icon: "🚚",
      title: "Low-Carbon Delivery",
      desc: "Choose environmentally responsible shipping."
    }
  ];

  return (
    <section className="eco-impact">
      <div className="container">
        
        <h2 className="eco-title">
          <b>Make Your Every Purchase Count</b>
        </h2>

        <div className="eco-grid">
          {features.map((item, index) => (
            <div className="eco-card" key={index}>
              <div className="eco-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default EcoFeatures;