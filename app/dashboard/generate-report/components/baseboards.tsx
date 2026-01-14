'use client';

import { useState, useMemo, useCallback } from 'react';
import { useBaseboardReports } from '@/hooks/useBaseboardReports';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Loader2,
  Ruler,
  Download,
  FileSpreadsheet,
  ChevronDown,
  Columns3,
  FilePlus,
} from 'lucide-react';
import { EmptyState } from './empty-state';

const COLUMN_LABELS: Record<string, string> = {
  modelo: 'Modelo',
  soma: 'Soma (m)',
  barra: 'Barra (m)',
  total: 'Total',
};

const DEFAULT_COLUMNS = ['modelo', 'soma', 'barra', 'total'];

export default function BaseboardsReport() {
  const {
    isBusy,
    isAvailable,
    baseboardData,
    exportCSV,
    exportXLSX,
    updateItem,
    getBaseboardData,
  } = useBaseboardReports();

  const [exportPopoverOpen, setExportPopoverOpen] = useState(false);
  const [columnPrefs, setColumnPrefs] = useState<Record<string, boolean>>(() =>
    DEFAULT_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: true }), {})
  );
  const [hasLoadedData, setHasLoadedData] = useState(false);

  const hasData = baseboardData && baseboardData.items.length > 0;

  const handleLoadData = useCallback(async () => {
    setHasLoadedData(true);
    await getBaseboardData();
  }, [getBaseboardData]);

  const handleExport = useCallback(
    async (format: 'csv' | 'xlsx') => {
      if (!hasData || isBusy) return;

      if (format === 'csv') {
        await exportCSV(baseboardData.items);
      } else {
        await exportXLSX(baseboardData.items);
      }

      setExportPopoverOpen(false);
    },
    [hasData, isBusy, baseboardData, exportCSV, exportXLSX]
  );

  const handleColumnToggle = useCallback((column: string, checked: boolean) => {
    setColumnPrefs((prev) => ({
      ...prev,
      [column]: checked,
    }));
  }, []);

  const handleBarChange = (index: number, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateItem(index, { barra: numValue });
    }
  };

  const visibleColumns = useMemo(
    () => DEFAULT_COLUMNS.filter((col) => columnPrefs[col] !== false),
    [columnPrefs]
  );

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-between gap-2 w-full'>
          <h2 className='text-lg font-bold'>Rodapés</h2>
        </div>

        <div className='flex items-center gap-2'>
          {!isAvailable && (
            <Badge variant='outline' className='text-xs'>
              Modo Simulação
            </Badge>
          )}
          {isBusy && <Loader2 className='w-4 h-4 animate-spin' />}
        </div>
      </div>

      <Card>
        <CardContent className='p-0'>
          <div className='flex items-center justify-between gap-2 pb-4 px-3.5 '>
            <Button
              size='sm'
              onClick={handleLoadData}
              variant='outline'
              disabled={isBusy}
              className='gap-2'
            >
              {hasLoadedData ? 'Recarregar' : 'Carregar Dados'}
            </Button>

            <div className='flex items-center gap-2 ml-auto'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className='gap-2'>
                    <Columns3 className='h-4 w-4' />
                    <span className='hidden sm:inline'>Colunas</span>
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-[200px]'>
                  {DEFAULT_COLUMNS.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column}
                      checked={columnPrefs[column] !== false}
                      onCheckedChange={(checked) =>
                        handleColumnToggle(column, checked as boolean)
                      }
                    >
                      {COLUMN_LABELS[column] || column}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover
                open={exportPopoverOpen}
                onOpenChange={setExportPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='gap-2'
                    disabled={!hasData || isBusy}
                  >
                    <Download className='h-4 w-4' />
                    <span className='hidden sm:inline'>Exportar</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-48' align='end'>
                  <div className='flex flex-col gap-2'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                      onClick={() => handleExport('csv')}
                    >
                      <FileSpreadsheet className='h-4 w-4' />
                      Exportar CSV
                    </Button>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                      onClick={() => handleExport('xlsx')}
                    >
                      <FileSpreadsheet className='h-4 w-4' />
                      Exportar XLSX
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className=''>
            {!hasLoadedData ? (
              <div className='py-6 px-2'>
                <EmptyState
                  icon={Ruler}
                  title='Clique em "Carregar Dados"'
                  description='Clique no botão acima para carregar os dados de rodapés do modelo.'
                />
              </div>
            ) : isBusy ? (
              <div className='py-12 flex items-center justify-center border-t'>
                <div className='flex flex-col items-center gap-2'>
                  <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
                  <p className='text-sm text-muted-foreground'>
                    Carregando dados...
                  </p>
                </div>
              </div>
            ) : !hasData ? (
              <div className='py-6 px-2 border-t'>
                <EmptyState
                  icon={Ruler}
                  title='Nenhum rodapé encontrado'
                  description='Não foram encontrados componentes de rodapé no modelo. Adicione componentes com os atributos dinâmicos "comprimentorodape" e "modelorodape".'
                />
              </div>
            ) : (
              <div className=''>
                <Table className='border-t'>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.map((col) => (
                        <TableHead key={col}>
                          {COLUMN_LABELS[col] || col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {baseboardData.items.map((item, index) => (
                      <TableRow key={index}>
                        {visibleColumns.includes('modelo') && (
                          <TableCell className='font-medium'>
                            {item.modelo}
                          </TableCell>
                        )}
                        {visibleColumns.includes('soma') && (
                          <TableCell>{item.soma.toFixed(2)}</TableCell>
                        )}
                        {visibleColumns.includes('barra') && (
                          <TableCell>
                            <Input
                              type='number'
                              step='0.1'
                              min='0.1'
                              value={item.barra}
                              onChange={(e) =>
                                handleBarChange(index, e.target.value)
                              }
                              className='w-20 h-8'
                            />
                          </TableCell>
                        )}
                        {visibleColumns.includes('total') && (
                          <TableCell>
                            <Badge variant='secondary'>{item.total}</Badge>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
