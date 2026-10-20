import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  hover?: boolean;
}

export function Card({
  children,
  className,
  padded = true,
  hover = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#30363d] bg-[#161b22] shadow-lg',
        hover && 'card-hover',
        padded && 'p-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
