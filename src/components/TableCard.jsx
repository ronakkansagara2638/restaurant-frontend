const statusStyles = {
  Available: "bg-teal/10 border-teal text-teal",
  Occupied: "bg-rust/10 border-rust text-rust",
  Reserved: "bg-brass-500/10 border-brass-600 text-brass-600",
};

// A literal floor-plan chip for one table - the visual signature of the Tables screen.
const TableCard = ({ table, onClick }) => {
  const style = statusStyles[table.status] || statusStyles.Available;

  return (
    <button
      onClick={() => onClick(table)}
      className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 ${style} transition-transform hover:-translate-y-0.5 hover:shadow-md`}
    >
      <span className="font-display text-2xl font-semibold">{table.tableNumber}</span>
      <span className="text-[11px] font-mono uppercase tracking-wide mt-1">{table.status}</span>
      <span className="text-[11px] text-ink/40 mt-0.5">{table.capacity} seats</span>
    </button>
  );
};

export default TableCard;
