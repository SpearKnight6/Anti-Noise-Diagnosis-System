import { Card } from '../ui/card';

export function ReportPreview({ report }) {
  if (!report) return null;

  return (
    <Card className="space-y-3">
      <h3 className="text-xl font-semibold">Client Report Preview</h3>
      <p><strong>Client:</strong> {report.client.name}</p>
      <p><strong>Positioning:</strong> {report.client.positioning}</p>
      <p><strong>Total Score:</strong> {report.totalScore}</p>
      <p><strong>Top Leaks:</strong> {report.topLeaks.join(', ')}</p>
      <p><strong>Action Plan:</strong> {report.actionPlan}</p>
      <p><strong>Revenue Leak Estimate:</strong> ${report.revenueLeak.toLocaleString()} / week</p>
      <p><strong>Next Steps:</strong> {report.nextSteps}</p>
    </Card>
  );
}
