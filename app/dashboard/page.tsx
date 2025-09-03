'use client';

import React, { useState } from 'react';
import RoomAnnotation from './annotation/components/room';
import AnnotationSection from './annotation/components/sections';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'room' | 'sections'>('room');

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Projeta Plus Dashboard
            </h1>
            <div className='flex space-x-4'>
              <button
                onClick={() => setActiveTab('room')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'room'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Room Annotation
              </button>
              <button
                onClick={() => setActiveTab('sections')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'sections'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Section Annotation
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        {activeTab === 'room' && <RoomAnnotation />}
        {activeTab === 'sections' && <AnnotationSection />}
      </main>
    </div>
  );
}
