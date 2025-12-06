'use client';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import PageWrapper from '@/components/ui/page-wraper';
import { Folder, FolderOpen, Box } from 'lucide-react';
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
import { useBaseboards } from '@/hooks/useBaseboards';
import PageContent from '@/components/ui/page-content';

export default function BaseboardsDashboardPage() {
  const { data, isBusy, importBlock, openBlocksFolder } = useBaseboards();

  const handleImportBlock = (blockPath: string, blockName: string) => {
    importBlock(blockPath);
  };

  return (
    <TooltipProvider>
      <PageWrapper>
        <PageHeader
          title='Rodapés'
          description='Clique no título para acessar e no bloco desejado para importá-lo'
        />

        <PageContent className='space-y-4'>
          <div className='flex gap-2 justify-end'>
            <Button
              variant='outline'
              size='sm'
              onClick={openBlocksFolder}
              className='flex items-center gap-2 w-full'
            >
              <FolderOpen className='w-4 h-4' />
              Abrir Pasta de Blocos
            </Button>
          </div>

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
              type='multiple'
              defaultValue={data.groups.map((g) => g.id)}
              className='w-full space-y-2'
            >
              {data.groups.map((group) => (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className='border border-b rounded-xl overflow-hidden bg-muted/20'
                >
                  <AccordionTrigger className='px-4 py-3 hover:no-underline bg-muted/50 data-[state=open]:bg-muted/70'>
                    <div className='flex items-center gap-2 font-semibold text-sm'>
                      <Folder className='w-4 h-4 text-gray-500' />
                      {group.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='p-4'>
                    <div className='grid grid-cols-2 gap-2'>
                      {group.items.map((item) => (
                        <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            <Button
                              size='sm'
                              className='h-auto py-2 px-3 text-xs font-medium justify-start'
                              onClick={() =>
                                handleImportBlock(item.path, item.name)
                              }
                              disabled={isBusy}
                            >
                              <span className='truncate'>{item.name}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </PageContent>
      </PageWrapper>
    </TooltipProvider>
  );
}
