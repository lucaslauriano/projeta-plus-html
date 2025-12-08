'use client';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import PageWrapper from '@/components/ui/page-wraper';
import PageContent from '@/components/ui/page-content';
import {
  Folder,
  FolderOpen,
  Upload,
  Trash2,
  FolderSync,
  Package,
} from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCustomComponents } from '@/hooks/useCustomComponents';

export default function CustomComponentsPage() {
  const {
    data,
    isBusy,
    uploadComponent,
    deleteComponent,
    openCustomFolder,
    syncFolder,
  } = useCustomComponents();

  return (
    <TooltipProvider>
      <PageWrapper>
        <PageHeader
          title='Componentes Customizados'
          description='Gerencie seus próprios componentes SketchUp'
          icon={<Package className='h-5 w-5 text-muted-foreground' />}
        />

        <PageContent className='space-y-4'>
          {/* Action Buttons */}
          <div className='grid grid-cols-3 gap-2'>
            <Button
              variant='default'
              size='sm'
              onClick={() => uploadComponent('Geral')}
              disabled={isBusy}
              className='flex items-center gap-2'
            >
              <Upload className='w-4 h-4' />
              Upload Componente
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={syncFolder}
              disabled={isBusy}
              className='flex items-center gap-2'
            >
              <FolderSync className='w-4 h-4' />
              Sincronizar Pasta
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={openCustomFolder}
              className='flex items-center gap-2'
            >
              <FolderOpen className='w-4 h-4' />
              Abrir Pasta
            </Button>
          </div>

          {/* Info Card */}
          <div className='bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
            <h3 className='font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100'>
              Como usar:
            </h3>
            <ul className='text-xs space-y-1 text-blue-800 dark:text-blue-200'>
              <li>
                • <strong>Upload:</strong> Selecione um arquivo .skp do seu
                computador
              </li>
              <li>
                • <strong>Sincronizar:</strong> Importe todos os .skp de uma
                pasta
              </li>
              <li>
                • <strong>Abrir Pasta:</strong> Acesse a pasta de componentes
                customizados
              </li>
            </ul>
          </div>

          {/* Custom Components List */}
          {data.groups.length === 0 && !isBusy && (
            <div className='text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg'>
              <Package className='w-12 h-12 mx-auto mb-3 opacity-50' />
              <p className='font-medium'>Nenhum componente customizado</p>
              <p className='text-sm mt-2'>
                Faça upload de seus próprios componentes .skp
              </p>
              <Button
                variant='default'
                size='sm'
                onClick={() => uploadComponent('Geral')}
                disabled={isBusy}
                className='mt-4'
              >
                <Upload className='w-4 h-4 mr-2' />
                Upload Primeiro Componente
              </Button>
            </div>
          )}

          {isBusy && (
            <div className='text-center py-8 text-muted-foreground'>
              <p>Carregando componentes...</p>
            </div>
          )}

          {data.groups.length > 0 && (
            <Accordion
              type='single'
              collapsible
              defaultValue={data.groups[0]?.id}
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
                      <span className='text-xs font-normal text-muted-foreground'>
                        ({group.items.length})
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='p-4'>
                    <div className='grid grid-cols-1 gap-2'>
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className='flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors'
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className='text-sm truncate flex-1'>
                                {item.name}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.name}</p>
                            </TooltipContent>
                          </Tooltip>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0 text-destructive hover:text-destructive'
                                disabled={isBusy}
                              >
                                <Trash2 className='w-4 h-4' />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remover Componente
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover &ldquo;
                                  {item.name}&rdquo;? Esta ação não pode ser
                                  desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteComponent(item.path)}
                                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                >
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
