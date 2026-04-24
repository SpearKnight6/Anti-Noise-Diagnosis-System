import { Card } from '../ui/card';

export function ClientCard({ client, onOpen }) {
  return (
    <Card className="cursor-pointer hover:border-brand" onClick={() => onOpen(client.id)}>
      <h3 className="text-lg font-semibold">{client.name}</h3>
      <p className="mt-1 text-sm text-slate-500">{client.positioning}</p>
      <p className="mt-3 text-xs text-slate-400">{client.industry || 'General'}</p>
    </Card>
  );
}
