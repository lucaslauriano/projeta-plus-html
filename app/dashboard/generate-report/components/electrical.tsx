'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useElectricalReports } from '@/hooks/useElectricalReports';
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
import { Loader2, FileSearch } from 'lucide-react';
import { EmptyState } from './empty-state';
import { ReportCategoriesToolbar } from './report-categories-toolbar';

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
          <ReportCategoriesToolbar
            categories={categories}
            selectedCategories={selectedCategories}
            categoryData={categoryData}
            isBusy={isBusy}
            onCategoryToggle={handleCategoryToggle}
            onExport={handleExport}
            exportPopoverOpen={exportPopoverOpen}
            onExportPopoverChange={setExportPopoverOpen}
          />

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
