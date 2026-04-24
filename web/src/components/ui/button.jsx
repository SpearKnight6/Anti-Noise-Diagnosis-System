import { cn } from '../../lib/utils';

export function Button({ className, variant = 'default', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
        variant === 'default' && 'bg-brand text-white hover:bg-brand-dark',
        variant === 'outline' && 'border border-border bg-white text-slate-700 hover:bg-slate-50',
        className,
      )}
      {...props}
    />
  );
}
