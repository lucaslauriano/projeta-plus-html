'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  LightningItem,
  useLightningReports,
} from '@/hooks/useLightningReports';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileSearch } from 'lucide-react';
import { EmptyState } from './empty-state';
import { ReportCategoriesToolbar } from './report-categories-toolbar';

const COLUMN_LABELS: Record<string, string> = {
  legenda: 'Legenda',
  luminaria: 'Luminária',
  marca_luminaria: 'Marca Luminária',
  lampada: 'Lâmpada',
  marca_lampada: 'Marca Lâmpada',
  temperatura: 'Temperatura',
  irc: 'IRC',
  lumens: 'Lumens',
  dimer: 'Dímer',
  ambiente: 'Ambiente',
  quantidade: 'Quantidade',
};

const DEFAULT_COLUMNS = [
  'legenda',
  'luminaria',
  'marca_luminaria',
  'lampada',
  'marca_lampada',
  'temperatura',
  'irc',
  'lumens',
  'dimer',
  'ambiente',
  'quantidade',
];

export default function LightningReport() {
  const {
    types,
    lightningData,
    isBusy,
    isAvailable,
    getLightningData,
    exportCSV,
    exportXLSX,
  } = useLightningReports();

  const [categoryData, setCategoryData] = useState<
    Record<string, LightningItem[]>
  >({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<string[]>([]);
  const [exportPopoverOpen, setExportPopoverOpen] = useState(false);
  const [columnPrefs, setColumnPrefs] = useState<Record<string, boolean>>(() =>
    DEFAULT_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: true }), {})
  );

  const loadingCategoryRef = useRef<string | null>(null);
  const loadingTypeIdRef = useRef<string | null>(null);

  const categories = useMemo(() => types.map((type) => type.name), [types]);

  const handleCategoryToggle = useCallback(
    async (category: string, checked: boolean) => {
      if (checked) {
        setSelectedCategories((prev) => [...prev, category]);

        if (!categoryData[category] && !loadingCategories.includes(category)) {
          const type = types.find((t) => t.name === category);
          if (!type) return;

          setLoadingCategories((prev) => [...prev, category]);
          loadingCategoryRef.current = category;
          loadingTypeIdRef.current = type.id;

          await getLightningData(type.id);
        }
      } else {
        setSelectedCategories((prev) => prev.filter((c) => c !== category));
      }
    },
    [categoryData, loadingCategories, types, getLightningData]
  );

  useEffect(() => {
    const currentCategory = loadingCategoryRef.current;
    const currentTypeId = loadingTypeIdRef.current;

    if (
      currentCategory &&
      currentTypeId &&
      lightningData[currentTypeId] &&
      !categoryData[currentCategory]
    ) {
      console.log(
        `✅ [${currentCategory}] Salvando ${lightningData[currentTypeId].items.length} itens`
      );

      setCategoryData((prev) => ({
        ...prev,
        [currentCategory]: lightningData[currentTypeId].items,
      }));

      setLoadingCategories((prev) => prev.filter((c) => c !== currentCategory));

      loadingCategoryRef.current = null;
      loadingTypeIdRef.current = null;
    }
  }, [lightningData, categoryData]);

  const handleColumnToggle = useCallback((column: string, checked: boolean) => {
    setColumnPrefs((prev) => ({
      ...prev,
      [column]: checked,
    }));
  }, []);

  const handleExport = useCallback(
    async (format: 'csv' | 'xlsx') => {
      if (selectedCategories.length === 0) return;

      console.log('[Lightning] handleExport called', {
        format,
        selectedCategories,
      });

      // Exporta sequencialmente para evitar múltiplos file pickers simultâneos
      for (const category of selectedCategories) {
        const type = types.find((t) => t.name === category);
        const data = categoryData[category];

        if (type && data && data.length > 0) {
          const visibleColumns = Object.keys(columnPrefs).filter(
            (col) => columnPrefs[col]
          );

          console.log(
            '[Lightning] Exporting category:',
            category,
            'columns:',
            visibleColumns
          );

          if (format === 'csv') {
            await exportCSV(type.id, data, visibleColumns);
          } else {
            await exportXLSX(type.id, data, visibleColumns);
          }
        }
      }

      setExportPopoverOpen(false);
    },
    [
      selectedCategories,
      types,
      categoryData,
      columnPrefs,
      exportCSV,
      exportXLSX,
    ]
  );

  const getVisibleColumns = useCallback(
    (data: LightningItem[]) => {
      if (!data || data.length === 0) return [];
      const availableColumns = Object.keys(data[0] || {});
      return availableColumns.filter((col) => columnPrefs[col] !== false);
    },
    [columnPrefs]
  );

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-between gap-2 w-full'>
          <h2 className='text-lg font-bold'>Iluminação</h2>
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
            isBusy={isBusy}
            categories={categories}
            columnPrefs={columnPrefs}
            categoryData={categoryData}
            exportPopoverOpen={exportPopoverOpen}
            selectedCategories={selectedCategories}
            onExport={handleExport}
            onColumnToggle={handleColumnToggle}
            onCategoryToggle={handleCategoryToggle}
            onExportPopoverChange={setExportPopoverOpen}
          />

          <div className=''>
            {selectedCategories.length === 0 ? (
              <div className='py-6 px-2'>
                <EmptyState
                  icon={FileSearch}
                  title='Sem categorias selecionadas'
                  description='Selecione as categorias desejadas acima para visualizar os dados do seu projeto'
                />
              </div>
            ) : (
              <div className='space-y-4'>
                {selectedCategories.map((category) => {
                  const data = categoryData[category];
                  const isLoading = loadingCategories.includes(category);
                  const visibleColumns = data
                    ? getVisibleColumns(data)
                    : DEFAULT_COLUMNS.filter((col) => columnPrefs[col]);

                  return (
                    <div key={category} className=''>
                      <div className='bg-muted/50 px-4 py-2 font-semibold text-sm border-y'>
                        {category}
                        {data && (
                          <span className='ml-2 text-muted-foreground font-normal'>
                            ({data.length}{' '}
                            {data.length === 1 ? 'item' : 'itens'})
                          </span>
                        )}
                      </div>

                      {isLoading ? (
                        <div className='py-12 flex items-center justify-center border-b'>
                          <div className='flex flex-col items-center gap-2'>
                            <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
                            <p className='text-sm text-muted-foreground'>
                              Carregando dados...
                            </p>
                          </div>
                        </div>
                      ) : !data || data.length === 0 ? (
                        <div className='py-6 border-b'>
                          <Table>
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
                              <TableRow>
                                <TableCell
                                  colSpan={visibleColumns.length}
                                  className='text-center text-muted-foreground'
                                >
                                  Nenhum dado encontrado
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <Table className='border-b'>
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
                            {data.map((item, index) => (
                              <TableRow key={`${category}-${index}`}>
                                {visibleColumns.map((col) => (
                                  <TableCell key={col}>
                                    {col === 'quantidade' ? (
                                      <Badge variant='secondary'>
                                        {item[col as keyof LightningItem]}
                                      </Badge>
                                    ) : (
                                      item[col as keyof LightningItem]
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
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
