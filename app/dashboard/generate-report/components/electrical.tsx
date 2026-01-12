'use client';

import { useState, useMemo, useCallback } from 'react';
import { useElectricalReports } from '@/hooks/useElectricalReports';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Download,
  ChevronDown,
  FileSpreadsheet,
  FileSearch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { EmptyState } from './empty-state';

type ReportDataItem = {
  quantidade: number;
  [key: string]: string | number;
};

export default function ElectricalReport() {
  const { reportTypes, isBusy, isAvailable, exportCSV, exportXLSX } =
    useElectricalReports();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState<
    Record<string, ReportDataItem[]>
  >({});
  const [loadingCategories, setLoadingCategories] = useState<string[]>([]);
  const [exportPopoverOpen, setExportPopoverOpen] = useState(false);

  const categories = useMemo(
    () => reportTypes.map((type) => type.title),
    [reportTypes]
  );

  // Formata o nome da coluna
  const formatColumnName = (key: string) => {
    const nameMap: { [key: string]: string } = {
      ambiente: 'Ambiente',
      uso: 'Uso',
      suporte: 'Suporte',
      altura: 'Altura',
      modelo: 'Modelo/BTUs',
      modulo_1: 'Módulo 1',
      modulo_2: 'Módulo 2',
      modulo_3: 'Módulo 3',
      modulo_4: 'Módulo 4',
      modulo_5: 'Módulo 5',
      modulo_6: 'Módulo 6',
      peca: 'Peça',
      quantidade: 'Quantidade',
    };
    return nameMap[key] || key.toUpperCase();
  };

  // Função para carregar dados de uma categoria
  const loadCategoryData = useCallback(
    (category: string) => {
      // Verifica se já tem dados ou está carregando
      if (categoryData[category] || loadingCategories.includes(category)) {
        return;
      }

      const type = reportTypes.find((t) => t.title === category);
      if (!type) return;

      if (
        typeof window !== 'undefined' &&
        (
          window as Window & {
            callSketchup?: (method: string, data: string) => void;
          }
        ).callSketchup
      ) {
        // Marca como carregando
        setLoadingCategories((prev) => [...prev, category]);

        const callbackName = `handleElectricalData_${type.id.replace(
          /[^a-zA-Z0-9]/g,
          '_'
        )}_${Date.now()}`; // Adiciona timestamp para garantir unicidade

        interface ElectricalDataResponse {
          success: boolean;
          data?: ReportDataItem[];
          message?: string;
        }

        (window as Window & Record<string, unknown>)[callbackName] = (
          response: ElectricalDataResponse
        ) => {
          if (response.success && response.data) {
            setCategoryData((prev) => ({
              ...prev,
              [category]: response.data as ReportDataItem[],
            }));
          }
          setLoadingCategories((prev) => prev.filter((c) => c !== category));
          delete (window as Record<string, unknown>)[callbackName];
        };

        // Chama o SketchUp
        const sketchupWindow = window as unknown as Window & {
          callSketchup: (method: string, data: string) => void;
        };
        sketchupWindow.callSketchup(
          'getElectricalReportData',
          JSON.stringify({ reportType: type.id })
        );
      }
    },
    [categoryData, loadingCategories, reportTypes]
  );

  // Função para alternar categoria
  const handleCategoryToggle = useCallback(
    (category: string, selected: boolean) => {
      if (selected) {
        // Adiciona categoria
        setSelectedCategories((prev) => {
          if (prev.includes(category)) return prev;
          return [...prev, category];
        });
        // Carrega dados imediatamente
        loadCategoryData(category);
      } else {
        // Remove categoria
        setSelectedCategories((prev) => prev.filter((c) => c !== category));
        setCategoryData((prev) => {
          const next = { ...prev };
          delete next[category];
          return next;
        });
        setLoadingCategories((prev) => prev.filter((c) => c !== category));
      }
    },
    [loadCategoryData]
  );

  // Função de exportação
  const handleExport = useCallback(
    async (format: 'csv' | 'xlsx') => {
      for (const category of selectedCategories) {
        const type = reportTypes.find((t) => t.title === category);
        if (type) {
          if (format === 'csv') {
            await exportCSV(type.id);
          } else {
            await exportXLSX(type.id);
          }
        }
      }
      setExportPopoverOpen(false);
    },
    [selectedCategories, reportTypes, exportCSV, exportXLSX]
  );

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-between gap-2 w-full'>
          <h2 className='text-lg font-bold'>Pontos Técnicos</h2>
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
          <div className='flex items-center justify-between gap-2 pb-4 px-2 flex-wrap'>
            {/* Desktop: Tabs */}
            <div className='hidden lg:flex items-center gap-1 flex-wrap flex-1 min-w-0'>
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                const hasData = !!categoryData[category];

                return (
                  <Button
                    key={category}
                    size='sm'
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => handleCategoryToggle(category, !isSelected)}
                    className={cn(
                      'relative gap-2',
                      isSelected && 'bg-primary text-primary-foreground'
                    )}
                  >
                    {category}
                    {hasData && (
                      <span
                        className={cn(
                          'inline-flex h-2 w-2 rounded-full',
                          isSelected ? 'bg-primary-foreground' : 'bg-green-500'
                        )}
                      />
                    )}
                  </Button>
                );
              })}
            </div>

            <div className='flex lg:hidden'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className='gap-2'>
                    <span>Grupos</span>
                    {selectedCategories.length > 0 && (
                      <Badge variant='secondary' className='ml-1'>
                        {selectedCategories.length}
                      </Badge>
                    )}
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start' className='w-[200px]'>
                  {categories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) =>
                        handleCategoryToggle(category, checked)
                      }
                    >
                      {category}
                      {categoryData[category] && (
                        <span className='ml-2 inline-flex h-2 w-2 rounded-full bg-green-500' />
                      )}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className='flex items-center gap-2 ml-auto'>
              <Popover
                open={exportPopoverOpen}
                onOpenChange={setExportPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='gap-2'
                    disabled={selectedCategories.length === 0 || isBusy}
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
            {selectedCategories.length === 0 ? (
              <div className='py-6 px-2'>
                <EmptyState
                  icon={FileSearch}
                  title='Sem grupos selecionados'
                  description='Selecione os grupos desejados acima para visualizar os dados do seu projeto'
                />
              </div>
            ) : (
              <div className='space-y-6 px-2 pb-4'>
                {selectedCategories.map((category) => {
                  const data = categoryData[category];
                  const isLoading = loadingCategories.includes(category);

                  // Calcula total de quantidade
                  const totalQuantidade = data
                    ? data.reduce(
                        (sum, item) => sum + (item.quantidade || 0),
                        0
                      )
                    : 0;

                  // Pega as colunas do primeiro item ou usa colunas padrão
                  const dataColumns =
                    data && data.length > 0
                      ? Object.keys(data[0]).filter(
                          (key) => key !== 'quantidade'
                        )
                      : ['ambiente', 'uso', 'suporte', 'altura', 'modelo'];

                  return (
                    <div key={category}>
                      {/* Header da categoria */}
                      <div className='flex items-center justify-between mb-3 px-1'>
                        <h3 className='text-base font-semibold'>{category}</h3>
                        <span className='text-sm text-muted-foreground'>
                          {data ? data.length : 0} itens • Total:{' '}
                          {totalQuantidade}
                        </span>
                      </div>

                      {/* Tabela da categoria */}
                      <div className='border rounded-lg overflow-hidden'>
                        <div className='max-h-[400px] overflow-auto'>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {dataColumns.map((col) => (
                                  <TableHead key={col}>
                                    {formatColumnName(col)}
                                  </TableHead>
                                ))}
                                <TableHead className='text-right'>
                                  Quantidade
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {isLoading ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={dataColumns.length + 1}
                                    className='text-center py-12'
                                  >
                                    <div className='flex flex-col items-center gap-2'>
                                      <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
                                      <p className='text-sm text-muted-foreground'>
                                        Carregando dados de {category}...
                                      </p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : !data || data.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={dataColumns.length + 1}
                                    className='text-center py-8 text-muted-foreground'
                                  >
                                    Nenhum dado encontrado
                                  </TableCell>
                                </TableRow>
                              ) : (
                                <>
                                  {data.map((item, index) => (
                                    <TableRow key={index}>
                                      {dataColumns.map((col) => (
                                        <TableCell key={col}>
                                          {item[col] || '-'}
                                        </TableCell>
                                      ))}
                                      <TableCell className='text-right font-medium'>
                                        <Badge variant='secondary'>
                                          {item.quantidade}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow className='bg-muted/50 font-medium'>
                                    <TableCell colSpan={dataColumns.length}>
                                      TOTAL
                                    </TableCell>
                                    <TableCell className='text-right'>
                                      <Badge>{totalQuantidade}</Badge>
                                    </TableCell>
                                  </TableRow>
                                </>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
