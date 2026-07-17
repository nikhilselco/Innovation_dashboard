function KPICard({ icon, tone = "brand", label, value, valueSuffix, sub }) {
  return (
    <div className="kpi">
      {icon && (
        <div className={`kpi-icon-chip ${tone}`}>
          <i className={`ti ${icon}`} aria-hidden="true"></i>
        </div>
      )}
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">
        {value}
        {valueSuffix && <span className="kpi-value-sub"> {valueSuffix}</span>}
      </p>
      {sub && <p className="kpi-sub">{sub}</p>}
    </div>
  );
}

export default KPICard;