import { NavLink } from 'react-router-dom';

const navItems = [
  ['clients', '/app/clients'],
  ['new audit', '/app/audits/new'],
];

export function SidebarLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="mx-auto grid max-w-7xl grid-cols-[220px_1fr] gap-8 p-6">
        <aside className="rounded-xl border border-border p-4">
          <h1 className="mb-6 text-lg font-semibold text-brand">Anti-Noise</h1>
          <div className="space-y-2">
            {navItems.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm capitalize ${
                    isActive ? 'bg-brand/10 text-brand' : 'hover:bg-slate-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
