import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SidebarLayout } from './components/layout/sidebar-layout';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';
import { api } from './lib/api';
import { LAYERS } from './lib/constants';
import { ClientCard } from './components/domain/client-card';
import { AuditLayerCard } from './components/domain/audit-layer-card';
import { ScoreBadge } from './components/domain/score-badge';
import { LeakTable } from './components/domain/leak-table';
import { TaskBoard } from './components/domain/task-board';
import { RevenueCalculator } from './components/domain/revenue-calculator';
import { ReportPreview } from './components/domain/report-preview';
import { supabase } from './lib/supabase';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('consultant@antinoise.io');
  const [password, setPassword] = useState('Password123!');

  const onLogin = async (e) => {
    e.preventDefault();
    if (!supabase) return alert('Missing Supabase env vars');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    localStorage.setItem('access_token', data.session.access_token);
    navigate('/app/clients');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-semibold">Anti-Noise Growth Diagnosis System</h2>
        <form className="mt-4 space-y-3" onSubmit={onLogin}>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full" type="submit">Login</Button>
        </form>
      </Card>
    </div>
  );
}

function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [positioning, setPositioning] = useState('');
  const load = () => api.listClients().then(setClients);
  useEffect(() => { load(); }, []);

  return <div className="space-y-6">
    <div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Clients</h2></div>
    <Card>
      <h3 className="font-medium">Create Client Workspace</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <Input placeholder="Client name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Positioning" value={positioning} onChange={(e) => setPositioning(e.target.value)} />
        <Button onClick={async () => { await api.createClient({ name, positioning }); setName(''); setPositioning(''); load(); }}>Create Client</Button>
      </div>
    </Card>
    <div className="grid gap-4 md:grid-cols-2">
      {clients.map((client) => <ClientCard key={client.id} client={client} onOpen={(id)=>navigate(`/app/clients/${id}`)} />)}
    </div>
  </div>;
}

function ClientDashboardPage() {
  const { clientId } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => { api.getDashboard(clientId).then(setData); }, [clientId]);
  if (!data) return null;
  return <div className="space-y-4"><h2 className="text-2xl font-semibold">{data.client.name}</h2><p className="text-slate-500">{data.client.positioning}</p><ScoreBadge score={data.totalScore} /><RevenueCalculator revenue={data.revenue} /><Link className="inline-block text-brand hover:underline" to={`/app/clients/${clientId}/workbench`}>Open leak map, tasks, revenue, and report →</Link></div>;
}

function NewAuditPage() {
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState([]);
  const [layers, setLayers] = useState({});
  useEffect(() => { api.listClients().then(setClients); }, []);
  const total = LAYERS.reduce((s,l)=>s+(layers[l]?.score || 0),0);
  const submit = async () => {
    const audit = await api.createAudit({ client_id: clientId, title: 'Growth diagnosis audit' });
    await api.saveAuditLayers(audit.id, LAYERS.map((layer) => ({ layer_name: layer, ...layers[layer] })));
    alert('Audit saved');
  };
  return <div className="space-y-4"><h2 className="text-2xl font-semibold">New Audit Form</h2>
    <select className="rounded border p-2" value={clientId} onChange={(e)=>setClientId(e.target.value)}><option value="">Select client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
    <ScoreBadge score={total} />
    {LAYERS.map((layer)=><AuditLayerCard key={layer} layer={layer} data={layers[layer]} onChange={(value)=>setLayers((p)=>({...p,[layer]:value}))} />)}
    <Button onClick={submit}>Save Audit</Button>
  </div>;
}

function LeakTaskRevenueReportPage() {
  const { clientId } = useParams();
  const [leaks, setLeaks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [report, setReport] = useState(null);
  const [inputs, setInputs] = useState({ weekly_inquiries: 50, appointment_conversion_rate: 0.55, show_up_rate: 0.7, average_ticket_size: 400, repeat_rate: 0.2, referral_rate: 0.1 });
  const load = async () => {
    const [l, t, r, rp] = await Promise.all([api.listLeaks(clientId), api.listTasks(clientId), api.getRevenue(clientId), api.report(clientId)]);
    setLeaks(l); setTasks(t); setRevenue(r); setReport(rp);
  };
  useEffect(()=>{ load(); }, [clientId]);

  return <div className="space-y-6">
    <h2 className="text-2xl font-semibold">Leak Map, Action Tracker, Revenue, Report</h2>
    <LeakTable leaks={leaks} onConvert={async (leakId)=>{ await api.createTasksFromLeaks({ leak_ids:[leakId] }); load(); }} />
    <TaskBoard tasks={tasks} onMove={async (taskId, status)=>{ await api.updateTask(taskId,{ status }); load(); }} />
    <Card><h3 className="mb-3 font-semibold">Revenue Inputs</h3><div className="grid gap-2 md:grid-cols-3">{Object.entries(inputs).map(([key,val])=><Input key={key} type="number" step="0.01" value={val} onChange={(e)=>setInputs((p)=>({...p,[key]:Number(e.target.value)}))} />)}</div><Button className="mt-3" onClick={async ()=>{ await api.saveMetrics({ client_id: clientId, ...inputs }); load(); }}>Save weekly metrics</Button></Card>
    <RevenueCalculator revenue={revenue} />
    <ReportPreview report={report} />
  </div>;
}

function AppShell() {
  return <SidebarLayout><Routes>
    <Route path="clients" element={<ClientsPage />} />
    <Route path="clients/:clientId" element={<ClientDashboardPage />} />
    <Route path="clients/:clientId/workbench" element={<LeakTaskRevenueReportPage />} />
    <Route path="audits/new" element={<NewAuditPage />} />
    <Route path="*" element={<Navigate to="clients" />} />
  </Routes></SidebarLayout>;
}

export function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/app/*" element={<AppShell />} />
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>;
}
