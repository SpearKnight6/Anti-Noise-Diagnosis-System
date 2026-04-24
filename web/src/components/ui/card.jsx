import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return <div className={cn('rounded-xl border border-border bg-white p-5', className)} {...props} />;
}
