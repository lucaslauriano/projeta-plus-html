'use client';

import React, { useState } from 'react';
import RoomAnnotation from '@/app/dashboard/annotation/components/room';
import AnnotationSection from '@/app/dashboard/annotation/components/sections';
import PageHeader from '@/components/page-header';
import { cn } from '@/lib/utils';

//todo: create menu with dynamic tabs
const tabs = [
  { name: 'Nome do Ambiente', href: '#', current: false },
  { name: 'Anotações de Corte', href: '#', current: true },
];

export default function AnnotationDashboardPage() {
  const [activeTab, setActiveTab] = useState<'room' | 'section'>('section');

  return (
    <div className='flex flex-col w-full gap-4 justify-start items-start'>
      <PageHeader
        title='Annotation'
        breadcrumbs={[
          {
            name: 'Dashboard',
            href: '/dashboard',
          },
          {
            name: 'Annotation',
            href: '/dashboard/annotation',
          },
        ]}
      />

      <div className='w-full'>
        <div className='border-b border-gray-200 dark:border-gray-700 flex justify-center items-center '>
          <nav aria-label='Content tabs' className='-mb-px flex space-x-8 '>
            <button
              onClick={() => setActiveTab('room')}
              className={cn(
                activeTab === 'room'
                  ? 'border-lime-500 text-lime-600 dark:border-lime-400 dark:text-lime-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300',
                'border-b-2 px-1 py-4 text-sm font-medium transition-colors whitespace-nowrap'
              )}
            >
              Nome do Ambiente
            </button>
            <button
              onClick={() => setActiveTab('section')}
              className={cn(
                activeTab === 'section'
                  ? 'border-lime-600 text-lime-600 dark:border--400 dark:text-lime-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300',
                'border-b-2 px-1 py-4 text-sm font-medium transition-colors whitespace-nowrap'
              )}
            >
              Anotações de Corte
            </button>
          </nav>
        </div>
        <div className='mt-6'>
          {activeTab === 'room' && <RoomAnnotation />}
          {activeTab === 'section' && <AnnotationSection />}
        </div>
      </div>
    </div>
  );
}
