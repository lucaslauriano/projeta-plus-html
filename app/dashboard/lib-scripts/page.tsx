'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Box,
  Eye,
  Copy,
  Ruler,
  Move,
  Lock,
  Wand2,
  Layers,
  Unlock,
  Target,
  EyeOff,
  Grid3x3,
  Scissors,
  RotateCw,
  Maximize2,
  Paintbrush,
} from 'lucide-react';

interface ToolItem {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  shortcut?: string;
  active?: boolean;
}

const TOOLS: ToolItem[] = [
  {
    id: 'select',
    name: 'Selecionar',
    icon: Target,
    description: 'Ferramenta de seleção',
    shortcut: 'Space',
  },
  {
    id: 'move',
    name: 'Mover',
    icon: Move,
    description: 'Mover objetos',
    shortcut: 'M',
  },
  {
    id: 'rotate',
    name: 'Rotacionar',
    icon: RotateCw,
    description: 'Rotacionar objetos',
    shortcut: 'Q',
  },
  {
    id: 'scale',
    name: 'Escalar',
    icon: Maximize2,
    description: 'Redimensionar objetos',
    shortcut: 'S',
  },
  {
    id: 'rectangle',
    name: 'Retângulo',
    icon: Box,
    description: 'Desenhar retângulo',
    shortcut: 'R',
  },
  {
    id: 'line',
    name: 'Linha',
    icon: Ruler,
    description: 'Desenhar linha',
    shortcut: 'L',
  },
  {
    id: 'copy',
    name: 'Copiar',
    icon: Copy,
    description: 'Copiar objetos',
    shortcut: 'Ctrl+C',
  },
  {
    id: 'paint',
    name: 'Pintura',
    icon: Paintbrush,
    description: 'Aplicar materiais',
    shortcut: 'B',
  },
  {
    id: 'layers',
    name: 'Camadas',
    icon: Layers,
    description: 'Gerenciar camadas',
    shortcut: 'Ctrl+L',
  },
  {
    id: 'grid',
    name: 'Grade',
    icon: Grid3x3,
    description: 'Configurar grade',
    shortcut: 'G',
  },
  {
    id: 'split',
    name: 'Dividir',
    icon: Scissors,
    description: 'Dividir objetos',
    shortcut: 'D',
  },
  {
    id: 'magic',
    name: 'Assistente',
    icon: Wand2,
    description: 'Ferramentas inteligentes',
    shortcut: 'A',
  },
  {
    id: 'show',
    name: 'Mostrar',
    icon: Eye,
    description: 'Mostrar objetos ocultos',
    shortcut: 'H',
  },
  {
    id: 'hide',
    name: 'Ocultar',
    icon: EyeOff,
    description: 'Ocultar objetos',
    shortcut: 'Shift+H',
  },
  {
    id: 'lock',
    name: 'Bloquear',
    icon: Lock,
    description: 'Bloquear objetos',
    shortcut: 'Ctrl+K',
  },
  {
    id: 'unlock',
    name: 'Desbloquear',
    icon: Unlock,
    description: 'Desbloquear objetos',
    shortcut: 'Ctrl+Shift+K',
  },
];

const Page = () => {
  const [activeTool, setActiveTool] = useState<string>('select');

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId);
    console.log('Tool selected:', toolId);
  };

  return (
    <div className='w-full h-screen '>
      <TooltipProvider>
        <div className='grid grid-cols-2 gap-2'>
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;

            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? 'default' : 'outline'}
                    size='sm'
                    className={`w-10 h-10 rounded-md flex flex-col items-center justify-center gap-1 p-1 ${
                      isActive ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleToolClick(tool.id)}
                  >
                    <Icon className='w-5 h-5' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top' className='w-[115px] z-[9999]'>
                  <p className='font-medium'>{tool.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {tool.description}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Page;
