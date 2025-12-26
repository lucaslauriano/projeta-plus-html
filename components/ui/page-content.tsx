import { cn } from '@/lib/utils';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={cn('w-full pt-6 overflow-y-auto', className)}>
      {children}
    </div>
  );
}
