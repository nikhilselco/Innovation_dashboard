import KanbanCard from "./KanbanCard";

function KanbanColumn({ title, tone, items, calendarLookup }) {
  return (
    <div className="kanban-col">
      <div className="kanban-header">
        <span className={`kanban-title ${tone}`}>{title}</span>
        <span className="kanban-count">{items.length}</span>
      </div>

      <div className="kanban-col-body">
        {items.length === 0 ? (
          <p className="kanban-empty">Nothing here.</p>
        ) : (
          items.map((row) => (
            <KanbanCard key={row.__uid} solution={row} calendarLookup={calendarLookup} />
          ))
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;