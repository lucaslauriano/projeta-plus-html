import { DashboardLayout } from '@/components/dashboard-layout';
import { ToastContainer } from 'react-toastify';

export default function DashboardLayoutPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      {children}
      <ToastContainer />
    </DashboardLayout>
  );
}
