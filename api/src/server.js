import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const authed = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: 'Invalid token' });
  req.user = data.user;
  next();
};

app.use('/api', authed);

app.get('/api/clients', async (_req, res) => {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/clients', async (req, res) => {
  const { data, error } = await supabase.from('clients').insert(req.body).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/audits', async (req, res) => {
  const { data, error } = await supabase.from('audits').insert(req.body).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/audits/:auditId/layers', async (req, res) => {
  const rows = req.body.map((row) => ({ ...row, audit_id: req.params.auditId }));
  const { error } = await supabase.from('audit_layers').insert(rows);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

app.get('/api/clients/:clientId/dashboard', async (req, res) => {
  const clientId = req.params.clientId;
  const { data: client } = await supabase.from('clients').select('*').eq('id', clientId).single();
  const { data: latestAudit } = await supabase.from('audits').select('id').eq('client_id', clientId).order('created_at', { ascending: false }).limit(1).maybeSingle();
  let totalScore = 0;
  if (latestAudit) {
    const { data: layers } = await supabase.from('audit_layers').select('score').eq('audit_id', latestAudit.id);
    totalScore = (layers || []).reduce((sum, l) => sum + (l.score || 0), 0);
  }
  const revenue = await getRevenue(clientId);
  res.json({ client, totalScore, revenue });
});

app.get('/api/clients/:clientId/leaks', async (req, res) => {
  const { data, error } = await supabase.from('leaks').select('*').eq('client_id', req.params.clientId).order('score', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/tasks/from-leaks', async (req, res) => {
  const { data: leaks } = await supabase.from('leaks').select('*').in('id', req.body.leak_ids);
  const tasks = leaks.map((l) => ({ client_id: l.client_id, leak_id: l.id, title: `Fix ${l.layer_name}: ${l.recommended_fix}`, status: 'todo', priority: l.priority }));
  const { data, error } = await supabase.from('tasks').insert(tasks).select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get('/api/clients/:clientId/tasks', async (req, res) => {
  const { data, error } = await supabase.from('tasks').select('*').eq('client_id', req.params.clientId).order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.patch('/api/tasks/:taskId', async (req, res) => {
  const { data, error } = await supabase.from('tasks').update(req.body).eq('id', req.params.taskId).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/metrics', async (req, res) => {
  const { data, error } = await supabase.from('metrics_weekly').insert(req.body).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

const getRevenue = async (clientId) => {
  const { data } = await supabase.from('metrics_weekly').select('*').eq('client_id', clientId).order('week_start', { ascending: false }).limit(1).maybeSingle();
  if (!data) return null;
  const current = data.weekly_inquiries * data.appointment_conversion_rate * data.show_up_rate * data.average_ticket_size * (1 + data.repeat_rate + data.referral_rate);
  const potential = data.weekly_inquiries * 0.75 * 0.85 * data.average_ticket_size * (1 + (data.repeat_rate + 0.1) + (data.referral_rate + 0.1));
  return { current: Math.round(current), potential: Math.round(potential), uplift: Math.round(potential - current) };
};

app.get('/api/clients/:clientId/revenue', async (req, res) => {
  res.json(await getRevenue(req.params.clientId));
});

app.get('/api/clients/:clientId/report', async (req, res) => {
  const clientId = req.params.clientId;
  const { data: client } = await supabase.from('clients').select('*').eq('id', clientId).single();
  const { data: leaks } = await supabase.from('leaks').select('*').eq('client_id', clientId).order('score', { ascending: true }).limit(3);
  const revenue = await getRevenue(clientId);
  const { data: tasks } = await supabase.from('tasks').select('*').eq('client_id', clientId).limit(5);
  const totalScore = 120 - leaks.reduce((sum, leak) => sum + (10 - leak.score), 0);
  res.json({
    client,
    totalScore,
    topLeaks: leaks.map((l) => l.layer_name),
    actionPlan: tasks.map((t) => t.title).join('; ') || 'Create task plan from priority leaks',
    revenueLeak: revenue?.uplift || 0,
    nextSteps: 'Finalize top 3 fixes this week, assign owners, and review next Friday.',
  });
});

app.listen(process.env.PORT || 8787, () => console.log('API running on 8787'));
