create extension if not exists "pgcrypto";

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  positioning text,
  created_at timestamptz default now()
);

create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  title text not null,
  created_at timestamptz default now()
);

create table if not exists audit_layers (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references audits(id) on delete cascade,
  layer_name text not null,
  score int not null default 0 check (score between 0 and 10),
  symptoms text,
  root_cause text,
  recommended_fix text,
  priority text default 'medium' check (priority in ('low','medium','high')),
  created_at timestamptz default now()
);

create table if not exists leaks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  audit_id uuid references audits(id) on delete set null,
  layer_name text not null,
  score int not null,
  symptoms text,
  root_cause text,
  recommended_fix text,
  priority text default 'medium' check (priority in ('low','medium','high')),
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  leak_id uuid references leaks(id) on delete set null,
  title text not null,
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  priority text default 'medium' check (priority in ('low','medium','high')),
  due_date date,
  created_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  audit_id uuid references audits(id) on delete set null,
  title text,
  payload jsonb,
  created_at timestamptz default now()
);

create table if not exists metrics_weekly (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  week_start date not null default current_date,
  weekly_inquiries int not null,
  appointment_conversion_rate numeric(5,2) not null,
  show_up_rate numeric(5,2) not null,
  average_ticket_size numeric(12,2) not null,
  repeat_rate numeric(5,2) not null,
  referral_rate numeric(5,2) not null,
  created_at timestamptz default now()
);

insert into clients (name, industry, positioning)
values (
  'Smile Dental Clinic',
  'Dental',
  'Quiet dental trust, built over 29 years — now made visible.'
)
on conflict do nothing;

with c as (
  select id from clients where name = 'Smile Dental Clinic' limit 1
), a as (
  insert into audits (client_id, title)
  select id, 'Initial Growth Diagnosis' from c
  returning id, client_id
)
insert into audit_layers (audit_id, layer_name, score, symptoms, root_cause, recommended_fix, priority)
select a.id, v.layer_name, v.score, v.symptoms, v.root_cause, v.recommended_fix, v.priority
from a
join (values
  ('Discovery',3,'Low map visibility','Inconsistent NAP and category signals','Optimize GBP categories + citation cleanup','high'),
  ('First Impression',4,'Homepage does not communicate trust quickly','No above-the-fold proof','Add trust bar + CTA hierarchy','high'),
  ('Authority',5,'Weak proof stack','Few recent reviews/case snippets','Publish treatment outcome highlights weekly','medium'),
  ('Relevance',6,'Service pages broad','Weak intent alignment','Build procedure-specific pages','medium'),
  ('Intent',5,'Traffic not converting to inquiry','Mixed CTA language','Standardize inquiry hooks','high'),
  ('Inquiry',4,'Inquiry form abandonment','Long form + delayed callbacks','Short form + 15-minute callback SLA','high'),
  ('Sales Handling',5,'Phone handling inconsistency','No call framework','Install consultative script and QA checks','high'),
  ('Appointment',6,'Booking friction','No smart reminders','Automated SMS reminders','medium'),
  ('Visit Experience',7,'Variable handoff quality','No onboarding checklist','Patient intake standardization','medium'),
  ('Retention',4,'Low recall campaign activity','No proactive reactivation','Quarterly reactivation flow','high'),
  ('Referral',3,'Few referral prompts','No referral moments in journey','Referral ask playbook at checkout','high'),
  ('Measurement',5,'Limited funnel visibility','No weekly KPI dashboard','Weekly scorecard cadence','medium')
) as v(layer_name,score,symptoms,root_cause,recommended_fix,priority) on true;

insert into leaks (client_id, layer_name, score, symptoms, root_cause, recommended_fix, priority)
select c.id, v.layer_name, v.score, v.symptoms, v.root_cause, v.recommended_fix, v.priority
from (select id from clients where name='Smile Dental Clinic' limit 1) c
join (values
  ('Discovery',3,'Hard to discover locally','Weak local profile hygiene','GBP optimization sprint','high'),
  ('First Impression',4,'Visitors bounce quickly','Weak opening message','Rebuild hero with trust proof','high'),
  ('Authority',5,'Trust not visible enough','Sparse social proof','Add review and credential blocks','medium'),
  ('Trust',5,'Unclear risk reversal','No reassurance messaging','Add guarantees and process clarity','medium'),
  ('Inquiry',4,'Leads drop before contact','Friction in inquiry process','One-click inquiry + callback SLA','high'),
  ('Sales Handling',5,'Consults not converted','Inconsistent handling','Adopt call script + roleplay','high'),
  ('Retention',4,'Existing patients inactive','No retention system','Recall campaign automation','high'),
  ('Referral',3,'Few word-of-mouth leads','No referral prompts','Referral offer and script','high')
) v(layer_name,score,symptoms,root_cause,recommended_fix,priority) on true;
