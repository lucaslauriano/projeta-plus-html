'use client';

import { useElectricalReports } from '@/hooks/useElectricalReports';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Loader2,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Info,
} from 'lucide-react';
import { EmptyState } from './empty-state';

type ReportDataItem = {
  quantidade: number;
  [key: string]: string | number;
};

export default function ElectricalReport() {
  const {
    reportTypes,
    selectedReportType,
    reportData,
    reportStats,
    isBusy,
    isAvailable,
    setSelectedReportType,
    exportCSV,
    exportXLSX,
    refreshData,
  } = useElectricalReports();

  const handleExportCSV = () => {
    if (selectedReportType) {
      exportCSV(selectedReportType);
    }
  };

  const handleExportXLSX = () => {
    if (selectedReportType) {
      exportXLSX(selectedReportType);
    }
  };

  const getVisibleColumns = () => {
    if (!reportData || reportData.length === 0) return [];
    const firstItem = reportData[0];
    return Object.keys(firstItem).filter((key) => key !== 'quantidade');
  };

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
    };
    return nameMap[key] || key.toUpperCase();
  };

  const visibleColumns = getVisibleColumns();

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-between gap-2 w-full'>
          <h2 className='text-lg font-bold'>Pontos Técnicos</h2>
          {/* <ViewConfigMenu
            menuItems={[
              {
                icon: <FileSpreadsheet className='w-4 h-4' />,
                label: 'Exportar Unificado',
                action: () => {},
                hasDivider: false,
              },
            ]}
          /> */}
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

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Tipo de Relatório</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className='h-4 w-4 text-muted-foreground cursor-help' />
                </TooltipTrigger>
                <TooltipContent className='max-w-[230px]'>
                  <p>Selecione o tipo de relatório que deseja visualizar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row gap-4 items-end mt-4'>
            <div className='flex-1 w-full'>
              <Select
                value={selectedReportType}
                onValueChange={setSelectedReportType}
                disabled={isBusy}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione um tipo de relatório' />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='w-full flex md:flex-row flex-col gap-2'>
              <Button
                onClick={refreshData}
                disabled={isBusy || !selectedReportType}
                variant='outline'
                size='sm'
              >
                <RefreshCw className='w-4 h-4 mr-2' />
                Atualizar
              </Button>
              <div className='flex gap-2 items-center md:flex-1'>
                <Button
                  onClick={handleExportCSV}
                  disabled={
                    isBusy || !selectedReportType || reportData.length === 0
                  }
                  className='flex-1'
                  size='sm'
                >
                  <Download className='w-4 h-4 mr-2' />
                  CSV
                </Button>
                <Button
                  onClick={handleExportXLSX}
                  disabled={
                    isBusy || !selectedReportType || reportData.length === 0
                  }
                  className='flex-1'
                  variant='outline'
                  size='sm'
                >
                  <FileSpreadsheet className='w-4 h-4 mr-2' />
                  XLSX
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* {selectedReportType && (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <Card>
            <CardHeader className='pb-3'>
              <CardDescription>Total de Itens</CardDescription>
              <CardTitle className='text-3xl'>{reportStats.count}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className='pb-3'>
              <CardDescription>Quantidade Total</CardDescription>
              <CardTitle className='text-3xl'>{reportStats.total}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )} */}

      {/* Data Table */}
      {selectedReportType &&
        (reportData.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Dados do Relatório</CardTitle>
              <CardDescription>
                {`${reportData.length} ${
                  reportData.length === 1
                    ? 'item encontrado'
                    : 'itens encontrados'
                }`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='rounded-md border max-h-[600px] overflow-auto mt-4'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.map((col) => (
                        <TableHead key={col}>{formatColumnName(col)}</TableHead>
                      ))}
                      <TableHead className='text-right'>Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((item, index) => (
                      <TableRow key={index}>
                        {visibleColumns.map((col) => (
                          <TableCell key={col}>
                            {(item as ReportDataItem)[col] || '-'}
                          </TableCell>
                        ))}
                        <TableCell className='text-right font-medium'>
                          <Badge variant='secondary'>{item.quantidade}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className='bg-muted/50 font-medium'>
                      <TableCell colSpan={visibleColumns.length}>
                        TOTAL
                      </TableCell>
                      <TableCell className='text-right'>
                        <Badge>{reportStats.total}</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            icon={FileSpreadsheet}
            title='Nenhum dado encontrado'
            description='Não há dados para exibir neste tipo de relatório. Verifique se existem componentes elétricos no modelo.'
          />
        ))}
    </div>
  );
}
