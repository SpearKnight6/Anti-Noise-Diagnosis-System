import { diagnosisLevel } from '../../lib/utils';

export function ScoreBadge({ score }) {
  return (
    <div className="rounded-md border border-brand/20 bg-brand/10 px-3 py-2 text-sm text-brand">
      Score: <strong>{score}</strong> / 120 · {diagnosisLevel(score)}
    </div>
  );
}
