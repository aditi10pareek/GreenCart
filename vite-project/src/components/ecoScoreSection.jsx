import { TrendingDown } from "lucide-react";
import "../styles/style.css";

function EcoScoreSection({ totalCO2 = 0 }) {

  const sessionGoal = 2.0;

  const progressPercentage = (totalCO2 / sessionGoal) * 100;
  const visualPercentage = progressPercentage > 100 ? 100 : progressPercentage;

  return (
    <section className="eco-score-section">
      <div className="container">
        <div className="glass-card">

          {/* LEFT TEXT */}
          <div className="score-text">
            <h2>The "Switch to Green" Score</h2>
            <p>
              Our proprietary algorithm analyzes every product's lifecycle.
              We help you find the most sustainable version of items you already love.
            </p>

            <div className="stats-mini-grid">
              <div className="stat-box">
                <div className="stat-value">+40%</div>
                <div className="stat-label">Avg. Eco-Score Improvement</div>
              </div>

              <div className="stat-box">
                <div className="stat-value">-2.5t</div>
                <div className="stat-label">CO2 Offset Goal</div>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="score-visual">

            <TrendingDown />

            <div style={{ width: "75%", maxWidth: "300px" }}>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontSize: "0.9rem",
                fontWeight: "600"
              }}>
                <span>Session Goal: 2.0kg CO₂ Offset</span>
                <span style={{ color: "var(--brand-green)" }}>
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{
                width: "100%",
                height: "10px",
                background: "#e2e8f0",
                borderRadius: "10px",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${visualPercentage}%`,
                  background: "linear-gradient(90deg, var(--brand-green), var(--brand-green-dark))",
                  transition: "width 0.4s ease-out"
                }} />
              </div>

              {/* Dynamic Text */}
              <p style={{
                fontSize: "0.8rem",
                marginTop: "8px",
                color: "var(--text-muted)"
              }}>
                {totalCO2 > 0
                  ? `Keep going! You've saved ${totalCO2.toFixed(1)}kg today.`
                  : "Add eco-friendly items to fill the bar!"}
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default EcoScoreSection;