import { cn } from '@/lib/utils';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={cn('w-full py-8 overflow-y-auto h-screen', className)}>
      {children}
    </div>
  );
}
