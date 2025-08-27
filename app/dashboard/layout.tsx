import { DashboardLayout } from '@/components/dashboard-layout';

export default function DashboardLayoutPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      <h1>Dashboard</h1>
      {children}
    </DashboardLayout>
  );
}
