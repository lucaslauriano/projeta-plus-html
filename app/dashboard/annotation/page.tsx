'use client';

import React, { useState } from 'react';
import RoomAnnotation from '@/app/dashboard/annotation/components/room';
import AnnotationSection from '@/app/dashboard/annotation/components/sections';

export default function AnnotationDashboardPage() {
  const [activeTab, setActiveTab] = useState<'room' | 'section'>('room');

  return (
    <div className='flex flex-col w-full gap-4 justify-center items-center'>
      <h1 className='text-3xl font-bold mb-4'>Annotation</h1>
      <div className='max-w-4xl w-full bg-white shadow-md rounded-lg'>
        <div className='flex border-b border-gray-200'>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'room'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('room')}
          >
            Room
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'section'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => setActiveTab('section')}
          >
            Section
          </button>
        </div>
        <div className=''>
          {activeTab === 'room' && <RoomAnnotation />}
          {activeTab === 'section' && <AnnotationSection />}
        </div>
      </div>
    </div>
  );
}
