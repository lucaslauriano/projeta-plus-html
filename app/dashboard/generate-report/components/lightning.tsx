'use client';

import React, { useState, useMemo } from 'react';
import { useLightningReports } from '@/hooks/useLightningReports';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb, FileSpreadsheet } from 'lucide-react';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from './empty-state';

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
    saveColumnPreferences,
    exportCSV,
    exportXLSX,
  } = useLightningReports();

  const [selectedType, setSelectedType] = useState<string>('standard');
  const [loadedTypes, setLoadedTypes] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] =
    useState<string[]>(DEFAULT_COLUMNS);

  const handleLoadData = (type: string) => {
    if (!loadedTypes.includes(type)) {
      console.log('[Lightning] Loading data for type:', type);
      getLightningData(type);
      setLoadedTypes([...loadedTypes, type]);
    }
    setSelectedType(type);
  };

  // Exportar CSV
  const handleExportCSV = () => {
    if (!hasData || isBusy) return;
    const data = lightningData[selectedType];
    if (data && data.items.length > 0) {
      exportCSV(selectedType, data.items, selectedColumns);
    }
  };

  // Exportar XLSX
  const handleExportXLSX = () => {
    if (!hasData || isBusy) return;
    const data = lightningData[selectedType];
    if (data && data.items.length > 0) {
      exportXLSX(selectedType, data.items, selectedColumns);
    }
  };

  // Toggle de coluna
  const handleColumnToggle = (column: string) => {
    if (selectedColumns.includes(column)) {
      const newColumns = selectedColumns.filter((c) => c !== column);
      setSelectedColumns(newColumns);
      saveColumnPreferences(newColumns);
    } else {
      const newColumns = [...selectedColumns, column];
      setSelectedColumns(newColumns);
      saveColumnPreferences(newColumns);
    }
  };

  // Selecionar todas as colunas
  const handleSelectAllColumns = () => {
    setSelectedColumns(DEFAULT_COLUMNS);
    saveColumnPreferences(DEFAULT_COLUMNS);
  };

  // Limpar seleção de colunas
  const handleClearColumns = () => {
    setSelectedColumns([]);
    saveColumnPreferences([]);
  };

  // Calcular total de quantidades
  const totalQuantity = useMemo(() => {
    const data = lightningData[selectedType];
    if (!data) return 0;
    return data.items.reduce((sum, item) => sum + item.quantidade, 0);
  }, [lightningData, selectedType]);

  // Dados carregados
  const currentData = lightningData[selectedType];
  const hasData = currentData && currentData.items.length > 0;

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold'>Iluminação</h2>
        </div>
        <ViewConfigMenu
          menuItems={[
            {
              icon: <FileSpreadsheet className='w-4 h-4' />,
              label: 'Exportar CSV',
              action: handleExportCSV,
              hasDivider: false,
            },
            {
              icon: <FileSpreadsheet className='w-4 h-4' />,
              label: 'Exportar XLSX',
              action: handleExportXLSX,
              hasDivider: false,
            },
          ]}
        />
      </div>

      {/* Status do SketchUp */}
      {!isAvailable && (
        <Card className='border-destructive'>
          <CardContent className='pt-6'>
            <p className='text-sm text-destructive'>
              ⚠️ SketchUp não detectado. Abra o arquivo no SketchUp para
              visualizar os dados.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs value={selectedType} onValueChange={handleLoadData}>
        <TabsList className='grid w-full grid-cols-2'>
          {types.map((type) => (
            <TabsTrigger key={type.id} value={type.id}>
              {type.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Colunas para Exportação</CardTitle>
            {/* <div className='flex gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={handleSelectAllColumns}
                disabled={isBusy}
              >
                Selecionar Todas
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={handleClearColumns}
                disabled={isBusy}
              >
                Limpar Seleção
              </Button>
            </div> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 py-2'>
            {DEFAULT_COLUMNS.map((column) => (
              <div key={column} className='flex items-center gap-2'>
                <Checkbox
                  id={`col-${column}`}
                  checked={selectedColumns.includes(column)}
                  onCheckedChange={() => handleColumnToggle(column)}
                />
                <label
                  htmlFor={`col-${column}`}
                  className='text-sm font-medium cursor-pointer'
                >
                  {COLUMN_LABELS[column]}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dados */}
      {isBusy && !hasData ? (
        <Card>
          <CardContent className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <span className='ml-2'>Carregando dados...</span>
          </CardContent>
        </Card>
      ) : !hasData ? (
        <EmptyState
          icon={Lightbulb}
          title='Nenhum componente encontrado'
          description='Não foram encontrados componentes de iluminação no modelo. Adicione componentes com atributos dinâmicos de iluminação.'
        />
      ) : (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>
                {types.find((t) => t.id === selectedType)?.name}
              </CardTitle>
              <Badge variant='outline'>
                {currentData.summary.uniqueItems} itens únicos | Total:{' '}
                {totalQuantity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='rounded-md border max-h-[600px] overflow-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedColumns.map((column) => (
                      <TableHead key={column}>
                        {COLUMN_LABELS[column]}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.items.map((item, index) => (
                    <TableRow key={index}>
                      {selectedColumns.map((column) => (
                        <TableCell key={column}>
                          {column === 'quantidade' ? (
                            <Badge variant='secondary'>{item[column]}</Badge>
                          ) : (
                            item[column as keyof typeof item] || '-'
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {/* Linha de Total */}
                  <TableRow className='bg-muted font-semibold'>
                    {selectedColumns.map((column, idx) => (
                      <TableCell key={column}>
                        {idx === 0
                          ? 'TOTAL'
                          : column === 'quantidade'
                          ? totalQuantity
                          : ''}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
