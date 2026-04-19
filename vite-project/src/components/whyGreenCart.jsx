import { ShieldCheck, BarChart3, Repeat, Leaf } from 'lucide-react';
import '../styles/style.css';

function WhyGreenCart() {
  const reasons = [
    {
      icon: <ShieldCheck size={32} />,
      title: "Eco Transparency",
      desc: "Every product comes with a detailed eco score breakdown — material, packaging, reusability, and certifications. No greenwashing."
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Carbon Tracking",
      desc: "Track your personal CO₂ impact in real-time. See exactly how your shopping choices affect the planet."
    },
    {
      icon: <Repeat size={32} />,
      title: "Smart Comparison",
      desc: "Compare normal products with eco-friendly alternatives side-by-side. Make informed switches at your own pace."
    },
    {
      icon: <Leaf size={32} />,
      title: "No Restrictions",
      desc: "We don't force you to buy green. We help you understand, compare, and gradually shift toward sustainable choices."
    }
  ];

  return (
    <section className="why-greencart-section">
      <div className="container">
        <h2 className="why-title">Why Choose <span>GreenCart?</span></h2>
        <p className="why-subtitle">
          Unlike traditional e-commerce, GreenCart makes sustainability visible, measurable, and actionable.
        </p>
        <div className="why-grid">
          {reasons.map((item, index) => (
            <div className="why-card" key={index}>
              <div className="why-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyGreenCart;
