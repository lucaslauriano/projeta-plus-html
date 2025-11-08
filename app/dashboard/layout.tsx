import { DashboardLayout } from '@/components/dashboard-layout';

export default function DashboardLayoutPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      <div className='relative min-h-full'>{children}</div>
    </DashboardLayout>
  );
}
