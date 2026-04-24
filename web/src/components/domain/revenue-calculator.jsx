import { Card } from '../ui/card';

export function RevenueCalculator({ revenue }) {
  if (!revenue) return null;

  return (
    <Card>
      <h3 className="text-lg font-semibold">Revenue Leak Calculator</h3>
      <p className="mt-3 text-sm">Estimated Current Weekly Revenue: <strong>${revenue.current.toLocaleString()}</strong></p>
      <p className="mt-2 text-sm">Estimated Potential Weekly Revenue: <strong>${revenue.potential.toLocaleString()}</strong></p>
      <p className="mt-2 text-sm text-brand">Leak/Uplift Opportunity: ${revenue.uplift.toLocaleString()}</p>
    </Card>
  );
}
