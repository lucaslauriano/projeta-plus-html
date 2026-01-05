'use client';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import PageWrapper from '@/components/ui/page-wraper';
import { Folder, FolderOpen } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useElectrical } from '@/hooks/useElectrical';
import PageContent from '@/components/ui/page-content';

export default function ElectricalDashboardPage() {
  const { data, isBusy, importBlock, openBlocksFolder } = useElectrical();

  const handleImportBlock = (blockPath: string) => {
    importBlock(blockPath);
  };

  return (
    <PageWrapper>
      <PageHeader
        title='Pontos Técnicos'
        description='Clique no título para acessar e no bloco desejado para importá-lo'
      />

      <PageContent className='space-y-4 pb-2'>
        <div className='flex gap-2 justify-end'>
          <Button
            size='sm'
            variant='outline'
            onClick={openBlocksFolder}
            className='flex items-center gap-2 w-full'
          >
            <FolderOpen className='w-4 h-4' />
            Abrir Pasta de Blocos
          </Button>
        </div>

        {/* Blocks Accordion */}
        {data.groups.length === 0 && !isBusy && (
          <div className='text-center py-8 text-muted-foreground'>
            <p>📁 Nenhum bloco encontrado.</p>
            <p className='text-sm mt-2'>
              Verifique se a pasta de componentes existe.
            </p>
          </div>
        )}

        {isBusy && (
          <div className='text-center py-8 text-muted-foreground'>
            <p>Carregando blocos...</p>
          </div>
        )}

        {data.groups.length > 0 && (
          <Accordion
            type='single'
            collapsible
            //defaultValue={data.groups[0]?.id}//
            className='w-full space-y-2'
          >
            {data.groups
              .sort((a, b) => {
                const aPadrao = a.title.toLowerCase().includes('padrão')
                  ? 0
                  : 1;
                const bPadrao = b.title.toLowerCase().includes('padrão')
                  ? 0
                  : 1;
                return aPadrao - bPadrao;
              })
              .map((group) => (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className='border border-b rounded-xl overflow-hidden bg-muted/20'
                >
                  <AccordionTrigger className='px-4 py-2 hover:no-underline bg-muted/50 data-[state=open]:bg-muted/70'>
                    <div className='flex items-center gap-2 font-semibold text-sm'>
                      <Folder className='w-4 h-4 text-gray-500' />
                      {group.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='p-4'>
                    <div className='grid grid-cols-1 gap-2'>
                      {group.items.map((item) => (
                        <Button
                          key={item.id}
                          size='sm'
                          onClick={() => handleImportBlock(item.path)}
                          disabled={isBusy}
                          className='h-auto py-2 px-3 text-xs font-medium justify-center'
                        >
                          <span className='truncate'>{item.name}</span>
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        )}
      </PageContent>
    </PageWrapper>
  );
}
