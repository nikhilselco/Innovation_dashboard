import KanbanCard from "./KanbanCard";
import { FIELDS } from "../../utils/helpers";

function KanbanColumn({ title, tone, items }) {
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
          items.map((row) => <KanbanCard key={row[FIELDS.srNo]} solution={row} />)
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;
