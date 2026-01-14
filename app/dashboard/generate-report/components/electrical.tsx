'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  const {
    reportTypes,
    reportData,
    isBusy,
    isAvailable,
    exportCSV,
    exportXLSX,
    getReportData,
  } = useElectricalReports();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState<
    Record<string, ReportDataItem[]>
  >({});
  const [loadingCategories, setLoadingCategories] = useState<string[]>([]);
  const [exportPopoverOpen, setExportPopoverOpen] = useState(false);

  const categories = useMemo(() => {
    const cats = reportTypes.map((type) => type.title);
    return cats;
  }, [reportTypes]);

  const formatColumnName = (key: string) => {
    const nameMap: { [key: string]: string } = {
      ambiente: 'Ambiente',
      uso: 'Uso',
      suporte: 'Suporte',
      altura: 'Altura',
      modelo: 'Modelo',
      modelo_btus: 'Modelo/BTUs',
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

  const loadingCategoryRef = useRef<string | null>(null);
  const loadingTypeIdRef = useRef<string | null>(null);

  const loadCategoryData = useCallback(
    async (category: string) => {
      if (categoryData[category] || loadingCategories.includes(category)) {
        return;
      }

      const type = reportTypes.find((t) => t.title === category);
      if (!type) return;

      setLoadingCategories((prev) => [...prev, category]);
      loadingCategoryRef.current = category;
      loadingTypeIdRef.current = type.id;

      await getReportData(type.id);
    },
    [categoryData, loadingCategories, reportTypes, getReportData]
  );

  useEffect(() => {
    const currentCategory = loadingCategoryRef.current;
    const currentTypeId = loadingTypeIdRef.current;

    if (
      currentCategory &&
      currentTypeId &&
      reportData &&
      reportData.length > 0 &&
      !categoryData[currentCategory]
    ) {
      console.log(
        `✅ [${currentCategory}] Salvando ${reportData.length} itens`
      );

      setCategoryData((prev) => ({
        ...prev,
        [currentCategory]: reportData as ReportDataItem[],
      }));

      setLoadingCategories((prev) => prev.filter((c) => c !== currentCategory));

      loadingCategoryRef.current = null;
      loadingTypeIdRef.current = null;
    }
  }, [reportData, categoryData]);

  const handleCategoryToggle = useCallback(
    (category: string, selected: boolean) => {
      if (selected) {
        setSelectedCategories((prev) => {
          if (prev.includes(category)) return prev;
          return [...prev, category];
        });
        loadCategoryData(category);
      } else {
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

  const getVisibleColumns = (
    category: string,
    data: ReportDataItem[] | undefined
  ) => {
    const columnsByCategory: Record<string, string[]> = {
      'Suportes + Módulos': [
        'ambiente',
        'uso',
        'suporte',
        'altura',
        'modulo_1',
        'modulo_2',
        'modulo_3',
        'modulo_4',
        'modulo_5',
        'modulo_6',
      ],

      'Contagem de Peças': ['peca'],

      'Pontos Elétricos': ['ambiente', 'uso', 'suporte', 'altura'],
      'Pontos Hidráulicos': ['ambiente', 'uso', 'suporte', 'altura'],
      'Pontos Iluminação': ['ambiente', 'uso', 'suporte', 'altura'],

      'Pontos Climatização': ['ambiente', 'uso', 'modelo_btus', 'suporte'],
    };

    if (columnsByCategory[category]) {
      console.log('✅ Usando colunas mapeadas:', columnsByCategory[category]);
      return columnsByCategory[category];
    }

    if (!data || data.length === 0) {
      console.log('⚠️ Sem dados, retornando array vazio');
      return [];
    }

    const firstItem = data[0];
    const extractedColumns = Object.keys(firstItem).filter(
      (key) => key !== 'quantidade'
    );
    return extractedColumns;
  };

  return (
    <div className='space-y-4'>
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

                  const totalQuantidade = data
                    ? data.reduce(
                        (sum, item) => sum + (item.quantidade || 0),
                        0
                      )
                    : 0;

                  const visibleColumns = getVisibleColumns(category, data);
                  const dataColumns =
                    visibleColumns.length > 0
                      ? visibleColumns
                      : ['ambiente', 'uso', 'suporte', 'altura'];

                  return (
                    <div key={category}>
                      <div className='flex items-center justify-between mb-3 px-1'>
                        <h3 className='text-base font-semibold'>{category}</h3>
                        <span className='text-sm text-muted-foreground'>
                          {data ? data.length : 0} itens • Total:{' '}
                          {totalQuantidade}
                        </span>
                      </div>

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
                                  {data.map((item, index) => {
                                    return (
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
                                    );
                                  })}
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
