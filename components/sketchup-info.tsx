'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SketchUpAPI } from '@/lib/sketchup';
import { Button } from '@/components/ui/button';

export function SketchUpInfo() {
  const [modelName, setModelName] = useState<string | null>(null);
  const [isInSketchUp, setIsInSketchUp] = useState(false);
  const [selectionInfo, setSelectionInfo] = useState<ReactNode>(null);

  useEffect(() => {
    setIsInSketchUp(SketchUpAPI.isInSketchUp());

    const loadModelInfo = async () => {
      const name = await SketchUpAPI.getModelName();
      setModelName(name);
    };

    if (SketchUpAPI.isInSketchUp()) {
      loadModelInfo();
    }
  }, []);

  const handleGetSelection = async () => {
    const info = await SketchUpAPI.getSelectionInfo();
    setSelectionInfo(info);
  };

  const handleSendMessage = async () => {
    await SketchUpAPI.sendMessage('Hello from Next.js!');
  };

  if (!isInSketchUp) {
    return <div>This component only works inside SketchUp</div>;
  }

  return (
    <div className='space-y-4 p-4'>
      <div>
        <h2 className='text-lg font-semibold'>Current Model</h2>
        <p>{modelName || 'Loading...'}</p>
      </div>

      <div className='space-x-4'>
        <Button onClick={handleGetSelection}>Get Selection Info</Button>
        <Button onClick={handleSendMessage}>Send Test Message</Button>
      </div>

      {selectionInfo && (
        <div>
          <h2 className='text-lg font-semibold'>Selection Info</h2>
          <pre className='bg-gray-100 p-2 rounded'>
            {typeof selectionInfo === 'object' ||
            typeof selectionInfo === 'string'
              ? JSON.stringify(selectionInfo, null, 2)
              : String(selectionInfo)}
          </pre>
        </div>
      )}
    </div>
  );
}
