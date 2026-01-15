'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { useSubscription } from '@clerk/nextjs/experimental';
import { cn } from '@/lib/utils';

// Singleton global para rastrear se o dashboard já foi carregado
let dashboardHasLoaded = false;

import {
  Plus,
  Menu,
  Plug,
  Settings,
  Armchair,
  BrickWall,
  HousePlus,
  Proportions,
  FileTextIcon,
  PanelBottom,
  LampCeiling,
  Library,
} from 'lucide-react';
import { AiOutlineTag } from 'react-icons/ai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Loading } from '@/components/ui/loading';

const navigation = [
  {
    name: 'Sketchup Inteligente',
    href: '/dashboard/inteli-sket',
    icon: HousePlus,
  },
  { name: 'Anotação', href: '/dashboard/annotation', icon: AiOutlineTag },
  {
    name: 'Mobiliário',
    href: '/dashboard/furniture',
    icon: Armchair,
  },
  { name: 'Elétrica', href: '/dashboard/electrical', icon: Plug },
  {
    name: 'Iluminação',
    href: '/dashboard/lightnings',
    icon: LampCeiling,
  },
  {
    name: 'Rodapés',
    href: '/dashboard/baseboards',
    icon: PanelBottom,
  },
  {
    name: 'Revestimentos',
    href: '/dashboard/coatings',
    icon: BrickWall,
  },

  {
    name: 'Relatórios',
    href: '/dashboard/generate-report',
    icon: FileTextIcon,
  },
  {
    name: 'Layout Inteligente',
    href: '/dashboard/inteli-layout',
    icon: Proportions,
  },
  { name: 'Biblioteca', href: '/dashboard/lib-scripts', icon: Library },
  { name: 'Settings', href: '/dashboard/user-settings', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { user, isLoaded: isUserLoaded } = useUser();
  // const hasPremiumPlan =
  //   user?.publicMetadata?.plan === 'premium' ||
  //   user?.publicMetadata?.plan === 'pro_user';
  //const userPlan: 'free' | 'premium' = hasPremiumPlan ? 'premium' : 'free';
  const { data, isLoading: isSubscriptionLoading } = useSubscription();
  const pathname = usePathname();

  // Use variável global para persistir entre remontagens completas
  const [isInitialLoading, setIsInitialLoading] = useState(
    () => !dashboardHasLoaded
  );

  useEffect(() => {
    if (isUserLoaded && !isSubscriptionLoading && !dashboardHasLoaded) {
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
        dashboardHasLoaded = true; // Marca globalmente como carregado
      }, 800);

      return () => clearTimeout(timer);
    } else if (dashboardHasLoaded) {
      // Se já foi carregado anteriormente, não mostrar loading
      setIsInitialLoading(false);
    }
  }, [isUserLoaded, isSubscriptionLoading]);

  if (isInitialLoading || !isUserLoaded) {
    return <Loading message='Carregando...' fullScreen size='lg' />;
  }

  // Verificar se deve ocultar a sidebar
  const hideSidebar = pathname === '/dashboard/lib-scripts';

  return (
    <div className='relative h-full overflow-hidden'>
      {!hideSidebar && (
        <div
          onMouseLeave={() => setSidebarExpanded(false)}
          className={cn(
            'absolute left-2 top-2 bottom-2 z-50 flex flex-col bg-card shadow-2xl rounded-xl transition-all duration-300 ease-in-out',
            sidebarExpanded ? 'w-64' : 'w-14'
          )}
        >
          {/* Header */}
          <div
            className={cn(
              'flex h-16 px-4 items-center justify-between border-b border-sidebar-border',
              sidebarExpanded ? 'justify-between' : 'justify-center'
            )}
          >
            {sidebarExpanded && (
              <Link
                href='/dashboard'
                className='flex items-center space-x-2 w-full cursor-pointer'
              >
                <HousePlus className='h-6 w-6 mt-1 font-bold text-primary' />
                <h1 className='text-xl font-bold font-sans flex mt-2'>
                  Projeta{' '}
                  <Plus className='h-4 w-4 mt-1 font-bold text-primary' />
                </h1>
              </Link>
            )}

            <button
              className='text-sidebar-foreground hover:bg-sidebar-accent-foreground'
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              onMouseEnter={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <Menu className='h-6 w-6' />
            </button>
          </div>

          {/* Navigation */}
          <nav className='flex-1 space-y-1 p-2 overflow-y-auto'>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground',
                    !sidebarExpanded && 'justify-center'
                  )}
                  title={!sidebarExpanded ? item.name : undefined}
                >
                  <item.icon
                    className={cn(
                      'h-6 w-6',
                      sidebarExpanded && 'mr-3',
                      isActive && !sidebarExpanded && 'text-sidebar-primary'
                    )}
                  />
                  {sidebarExpanded && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className='mt-auto border-t border-sidebar-border p-4'>
            <div
              className={cn(
                'flex items-center',
                sidebarExpanded ? 'space-x-3' : 'justify-center'
              )}
            >
              <UserButton
                afterSignOutUrl='/'
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  },
                }}
              />
              {sidebarExpanded && (
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-sidebar-foreground truncate'>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className='text-xs text-sidebar-foreground/70 truncate'>
                    {data?.subscriptionItems
                      ?.map((item) => item.plan.name)
                      .join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          'absolute inset-y-0 right-0',
          hideSidebar ? 'left-0' : 'left-16'
        )}
      >
        <main className='pb-6 overflow-y-auto py-2 px-1'>{children}</main>
      </div>
    </div>
  );
}
