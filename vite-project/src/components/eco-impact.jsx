function EcoImpactBar({ co2 }) {
  return (
    <div className="eco-impact-bar">
      🌿 You've saved <span>{co2} of CO2</span> this month! Keep going.
    </div>
  );
}

export default EcoImpactBar;