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
        'rounded-md border border-[#30363d] bg-[#161b22]',
        padded && 'p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
