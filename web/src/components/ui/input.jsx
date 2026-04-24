import { cn } from '../../lib/utils';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn('w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/30', className)}
      {...props}
    />
  );
}
