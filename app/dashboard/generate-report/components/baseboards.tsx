'use client';

import React, { useMemo } from 'react';
import { useBaseboardReports } from '@/hooks/useBaseboardReports';
import { Input } from '@/components/ui/input';
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
import { Loader2, Ruler, FileSpreadsheet } from 'lucide-react';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';
import { EmptyState } from './empty-state';

export default function BaseboardsReport() {
  const {
    baseboardData,
    isBusy,
    isAvailable,
    updateItem,
    exportCSV,
    exportXLSX,
  } = useBaseboardReports();

  const hasData = baseboardData && baseboardData.items.length > 0;

  const handleExportCSV = () => {
    if (!hasData || isBusy) return;
    exportCSV(baseboardData.items);
  };

  const handleExportXLSX = () => {
    if (!hasData || isBusy) return;
    exportXLSX(baseboardData.items);
  };

  // Atualizar valor de barra
  const handleBarChange = (index: number, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateItem(index, { barra: numValue });
    }
  };

  const totals = useMemo(() => {
    if (!baseboardData) return { totalLength: 0, totalUnits: 0 };
    return {
      totalLength: baseboardData.summary.totalLength,
      totalUnits: baseboardData.summary.totalUnits,
    };
  }, [baseboardData]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-between gap-2 w-full'>
          <h2 className='text-lg font-bold'>Rodapés</h2>
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
      </div>

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

      {isBusy && !hasData ? (
        <Card>
          <CardContent className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <span className='ml-2'>Carregando dados...</span>
          </CardContent>
        </Card>
      ) : !hasData ? (
        <EmptyState
          icon={Ruler}
          title='Nenhum rodapé encontrado'
          description='Não foram encontrados componentes de rodapé no modelo. Adicione componentes com os atributos dinâmicos "comprimentorodape" e "modelorodape".'
        />
      ) : (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Dados de Rodapés</CardTitle>
              <div className='flex gap-2'>
                <Badge variant='outline'>
                  {baseboardData.summary.uniqueModels} modelos
                </Badge>
                <Badge variant='outline'>
                  {totals.totalLength.toFixed(2)}m total
                </Badge>
                <Badge variant='outline'>{totals.totalUnits} barras</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='rounded-md border max-h-[600px] overflow-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>MODELO</TableHead>
                    <TableHead>SOMA (m)</TableHead>
                    <TableHead>BARRA (m)</TableHead>
                    <TableHead>TOTAL (un)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {baseboardData.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>
                        {item.modelo}
                      </TableCell>
                      <TableCell>{item.soma.toFixed(2)}</TableCell>
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
                      <TableCell>
                        <Badge variant='secondary'>{item.total}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className='bg-muted font-semibold'>
                    <TableCell>TOTAL</TableCell>
                    <TableCell>{totals.totalLength.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{totals.totalUnits}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className='mt-4 p-3 bg-muted rounded-md'>
              <p className='text-xs text-muted-foreground'>
                💡 <strong>Dica:</strong> Você pode alterar o comprimento da
                barra (padrão 2.4m) para cada modelo. O total de barras será
                recalculado automaticamente.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
