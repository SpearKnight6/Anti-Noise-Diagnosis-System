import { TASK_STATUSES } from '../../lib/constants';

export function TaskBoard({ tasks, onMove }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((status) => (
        <div key={status} className="rounded-xl border border-border p-3">
          <h4 className="mb-3 text-sm font-semibold uppercase text-slate-500">{status.replace('_', ' ')}</h4>
          <div className="space-y-2">
            {tasks.filter((t) => t.status === status).map((task) => (
              <div key={task.id} className="rounded-md border border-border p-2 text-sm">
                <p>{task.title}</p>
                <div className="mt-2 flex gap-2">
                  {TASK_STATUSES.filter((s) => s !== status).map((next) => (
                    <button key={next} className="text-xs text-brand" onClick={() => onMove(task.id, next)}>
                      {next}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
