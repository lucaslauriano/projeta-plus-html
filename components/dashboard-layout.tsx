'use client';

import type React from 'react';

import { useState } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import { useSubscription } from '@clerk/nextjs/experimental';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HousePlus, Plus, Home, Menu, Settings, X } from 'lucide-react';
import { AiTwotoneLayout } from 'react-icons/ai';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { AiTwotoneProfile } from 'react-icons/ai';
import { BsHouses } from 'react-icons/bs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PiWallDuotone } from 'react-icons/pi';
import { PiSquareHalfBottomDuotone } from 'react-icons/pi';
import { PiPlugDuotone } from 'react-icons/pi';
import { PiArmchairDuotone } from 'react-icons/pi';
import { TbKeyframes } from 'react-icons/tb';

const navigation = [
  { name: 'Sketchup Inteligente', href: '/dashboard/inteli-sket', icon: Home },
  { name: 'Anotação', href: '/dashboard/annotation', icon: BsHouses },
  {
    name: 'Mobiliário',
    href: '/dashboard/furniture',
    icon: PiArmchairDuotone,
  },
  { name: 'Esquadrias', href: '/dashboard/frames', icon: TbKeyframes },
  { name: 'Elétrica', href: '/dashboard/electrical', icon: PiPlugDuotone },
  {
    name: 'Iluminação',
    href: '/dashboard/lightnings',
    icon: HiOutlineLightBulb,
  },
  {
    name: 'Revestimentos',
    href: '/dashboard/coatings',
    icon: PiWallDuotone,
  },
  {
    name: 'Rodapés',
    href: '/dashboard/baseboards',
    icon: PiSquareHalfBottomDuotone,
  },
  {
    name: 'Relatórios',
    href: '/dashboard/generate-report',
    icon: AiTwotoneProfile,
  },
  {
    name: 'Layout Inteligente',
    href: '/dashboard/inteli-layout',
    icon: AiTwotoneLayout,
  },
  { name: 'Settings', href: '/dashboard/user-settings', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { user } = useUser();
  const { data } = useSubscription();
  const pathname = usePathname();

  console.log('Subscription data:', data);

  return (
    <div className='min-h-screen bg-background'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
          sidebarExpanded ? 'w-64' : 'w-16',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar header */}
        <div className='flex h-16 items-center justify-between px-4 border-b border-sidebar-border'>
          {sidebarExpanded && (
            <div className='flex items-center space-x-2 w-full'>
              <HousePlus className='h-6 w-6 mt-1 font-bold text-lime-600' />
              <h1 className='text-xl font-bold font-sans flex mt-2'>
                Projeta{' '}
                <Plus className='h-4 w-4 mt-1 font-bold text-lime-600' />
              </h1>
            </div>
          )}
          {!sidebarExpanded && (
            <Plus className='h-8 w-8 text-sidebar-primary mx-auto' />
          )}

          {/* Desktop toggle */}
          <Button
            variant='ghost'
            size='sm'
            className='hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent'
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
          >
            <Menu className='h-4 w-4' />
          </Button>

          {/* Mobile close */}
          <Button
            variant='ghost'
            size='sm'
            className='lg:hidden text-sidebar-foreground hover:bg-sidebar-accent'
            onClick={() => setSidebarOpen(false)}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 space-y-1 p-2'>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground',
                  !sidebarExpanded && 'justify-center'
                )}
                title={!sidebarExpanded ? item.name : undefined}
              >
                <item.icon
                  className={cn('h-6 w-6', sidebarExpanded && 'mr-3')}
                />
                {sidebarExpanded && (
                  <span className='font-serif'>{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className='border-t border-sidebar-border p-4'>
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
                <p className='text-sm font-medium text-sidebar-foreground font-serif truncate'>
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

      {/* Main content */}
      <div
        className={cn(
          'lg:pl-64 transition-all duration-300',
          !sidebarExpanded && 'lg:pl-16'
        )}
      >
        {/* Top bar */}
        <div className='sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
          <Button
            variant='ghost'
            size='sm'
            className='lg:hidden'
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Open sidebar</span>
          </Button>

          <div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6'>
            <div className='flex flex-1'></div>
            <div className='flex items-center gap-x-4 lg:gap-x-6'>
              {/* Additional header content can go here */}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className='py-8 px-4 sm:px-6 lg:px-8'>{children}</main>
      </div>
    </div>
  );
}
