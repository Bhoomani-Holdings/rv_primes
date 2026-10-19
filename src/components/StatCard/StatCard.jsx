import "./StatCard.css";

function StatCard({ title, value, icon, type }) {
  return (
    <div className={`stat-card ${type}`}>

      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>

    </div>
  );
}

export default StatCard;