import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select } from '../ui/select';

export function AuditLayerCard({ layer, data, onChange }) {
  const value = data || {};
  return (
    <Card>
      <h4 className="mb-3 font-medium">{layer}</h4>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Score (0-10)</label>
          <Input
            type="number"
            min={0}
            max={10}
            value={value.score ?? ''}
            onChange={(e) => onChange({ ...value, score: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Priority</label>
          <Select value={value.priority || 'medium'} onChange={(e) => onChange({ ...value, priority: e.target.value })}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Symptoms</label>
          <Textarea value={value.symptoms || ''} onChange={(e) => onChange({ ...value, symptoms: e.target.value })} rows={3} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Root Cause</label>
          <Textarea value={value.root_cause || ''} onChange={(e) => onChange({ ...value, root_cause: e.target.value })} rows={3} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Recommended Fix</label>
          <Textarea value={value.recommended_fix || ''} onChange={(e) => onChange({ ...value, recommended_fix: e.target.value })} rows={3} />
        </div>
      </div>
    </Card>
  );
}
