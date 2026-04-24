export function LeakTable({ leaks, onConvert }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="p-3">Layer</th><th className="p-3">Score</th><th className="p-3">Priority</th><th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {leaks.map((leak) => (
            <tr key={leak.id} className="border-t border-border">
              <td className="p-3">{leak.layer_name}</td>
              <td className="p-3">{leak.score}</td>
              <td className="p-3 capitalize">{leak.priority}</td>
              <td className="p-3">
                <button className="text-brand hover:underline" onClick={() => onConvert(leak.id)}>
                  Convert to Task
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
