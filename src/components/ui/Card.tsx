import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}

export function Card({
  children,
  className,
  padded = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[#30363d] bg-[#161b22] shadow-sm',
        padded && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
