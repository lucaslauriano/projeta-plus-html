'use client';

import type React from 'react';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Plus,
  FileText,
  Home,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Anotações', href: '/dashboard/subscriptions', icon: Users },
  { name: 'Iluminação', href: '/dashboard/billing', icon: Plus },
  { name: 'Interiores', href: '/dashboard/invoices', icon: FileText },
  { name: 'Mobiliário', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Pontos técnicos', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const pathname = usePathname();

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
            <div className='flex items-center space-x-2'>
              <Plus className='h-8 w-8 text-sidebar-primary' />
              <h1 className='text-2xl font-bold font-sans'>
                Projeta<span className='text-green-500'>+</span>
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
                  className={cn('h-5 w-5', sidebarExpanded && 'mr-3')}
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
                  Dashboard User
                </p>
                <p className='text-xs text-sidebar-foreground/70 truncate'>
                  Pro Plan
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
