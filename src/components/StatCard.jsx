const StatCard = ({ label, value, accent = "brass" }) => {
  const accents = {
    brass: "text-brass-600 border-brass-500/40",
    teal: "text-teal border-teal/40",
    rust: "text-rust border-rust/40",
  };
  return (
    <div className={`bg-white rounded-xl border ${accents[accent]} p-5 shadow-sm`}>
      <p className="text-xs uppercase tracking-wider text-ink/50 font-semibold mb-2">{label}</p>
      <p className="font-display text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
};

export default StatCard;
