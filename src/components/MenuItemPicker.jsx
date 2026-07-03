const MenuItemPicker = ({ item, quantity, onAdd, onRemove }) => {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-ink/5 last:border-0">
      <div className="min-w-0">
        <p className="font-medium text-ink truncate">{item.name}</p>
        <p className="text-xs text-ink/50 truncate">{item.description}</p>
        <p className="font-mono text-sm text-forest-700 mt-0.5">₹{item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onRemove(item)}
          disabled={!quantity}
          className="w-7 h-7 rounded-full border border-ink/15 text-ink disabled:opacity-30 hover:bg-ink/5"
        >
          −
        </button>
        <span className="w-5 text-center font-mono">{quantity || 0}</span>
        <button
          onClick={() => onAdd(item)}
          className="w-7 h-7 rounded-full bg-brass-500 text-forest-950 hover:bg-brass-400"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default MenuItemPicker;
