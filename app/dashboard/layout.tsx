import { DashboardLayout } from '@/components/dashboard-layout';

export default function DashboardLayoutPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      <div className='relative pl-2 pr-4'>{children}</div>
    </DashboardLayout>
  );
}
