'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useCoatingsReports } from '@/hooks/useCoatingsReports';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  Loader2,
  Layers,
  FileSpreadsheet,
  Plus,
  Trash2,
  FolderOpen,
  Info,
  Columns3,
  ChevronDown,
  Download,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { EmptyState } from './empty-state';

const AVAILABLE_COLUMNS = [
  { id: 'ambiente', label: 'Ambiente' },
  { id: 'material', label: 'Material' },
  { id: 'marca', label: 'Marca' },
  { id: 'acabamento', label: 'Acabamento' },
  { id: 'area', label: 'Área (m²)' },
  { id: 'acrescimo', label: 'Acréscimo (%)' },
  { id: 'total', label: 'Total (m²)' },
];

export default function CoatingsReport() {
  const {
    coatingsData,
    summary,
    isBusy,
    isAvailable,
    exportCSV,
    updateItem,
    removeItem,
    exportXLSX,
    addSelectedMaterial,
  } = useCoatingsReports();

  // Estados locais
  const [groupByEnvironment, setGroupByEnvironment] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.map((c) => c.id)
  );
  const [exportPopoverOpen, setExportPopoverOpen] = useState(false);

  const hasData = coatingsData && coatingsData.length > 0;

  // Dados agrupados
  const groupedData = useMemo(() => {
    if (!groupByEnvironment) return null;

    const groups: { [key: string]: typeof coatingsData } = {};
    coatingsData.forEach((item) => {
      const env = item.ambiente || 'Sem Ambiente';
      if (!groups[env]) groups[env] = [];
      groups[env].push(item);
    });
    return groups;
  }, [coatingsData, groupByEnvironment]);

  // Handlers
  const handleAddMaterial = () => {
    addSelectedMaterial();
  };

  const handleExport = useCallback(
    async (format: 'csv' | 'xlsx') => {
      if (!hasData || isBusy) return;

      if (format === 'csv') {
        await exportCSV(coatingsData, selectedColumns);
      } else {
        await exportXLSX(coatingsData, selectedColumns);
      }

      setExportPopoverOpen(false);
    },
    [hasData, isBusy, coatingsData, selectedColumns, exportCSV, exportXLSX]
  );

  const handleRemoveItem = (index: number) => {
    if (confirm('Deseja realmente remover este item?')) {
      removeItem(index);
    }
  };

  const handleColumnToggle = useCallback((column: string, checked: boolean) => {
    setSelectedColumns((prev) =>
      checked ? [...prev, column] : prev.filter((id) => id !== column)
    );
  }, []);

  const isColumnVisible = (columnId: string) =>
    selectedColumns.includes(columnId);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-between gap-2 w-full'>
          <h2 className='text-lg font-bold'>Revestimentos</h2>
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
        <CardContent className='space-y-4'>
          <div className='p-3 bg-muted rounded-md'>
            <p className='text-xs text-muted-foreground'>
              <Info className='w-4 h-4 inline mr-2' /> Use o conta-gotas
              (Material Eyedropper) do SketchUp para selecionar um material e
              clique em &quot;Adicionar Material&quot;. O acréscimo percentual é
              calculado automaticamente no total.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Checkbox
                id='groupByEnv'
                label='Agrupar por Ambiente'
                checked={groupByEnvironment}
                onCheckedChange={(checked) =>
                  setGroupByEnvironment(checked as boolean)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='p-0'>
          <div className='flex items-center justify-between gap-2 pb-4 px-3.5 '>
            <Button
              variant='outline'
              size='sm'
              onClick={handleAddMaterial}
              disabled={!isAvailable || isBusy}
              className='w-fit'
            >
              Adicionar
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
                  {AVAILABLE_COLUMNS.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={isColumnVisible(column.id)}
                      onCheckedChange={(checked) =>
                        handleColumnToggle(column.id, checked as boolean)
                      }
                    >
                      {column.label}
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
            {!hasData ? (
              <div className='py-6 px-2'>
                <EmptyState
                  icon={Layers}
                  title='Nenhum revestimento adicionado'
                  description='Use o conta-gotas do SketchUp para selecionar um material e clique em "Adicionar Material" para começar.'
                />
              </div>
            ) : (
              <div className=''>
                <Table className='border-t'>
                  <TableHeader>
                    <TableRow>
                      {isColumnVisible('ambiente') && (
                        <TableHead>Ambiente</TableHead>
                      )}
                      {isColumnVisible('material') && (
                        <TableHead>Material</TableHead>
                      )}
                      {isColumnVisible('marca') && <TableHead>Marca</TableHead>}
                      {isColumnVisible('acabamento') && (
                        <TableHead>Acabamento</TableHead>
                      )}
                      {isColumnVisible('area') && (
                        <TableHead>Área (m²)</TableHead>
                      )}
                      {isColumnVisible('acrescimo') && (
                        <TableHead>Acréscimo (%)</TableHead>
                      )}
                      {isColumnVisible('total') && (
                        <TableHead>Total (m²)</TableHead>
                      )}
                      <TableHead className='w-[100px]'>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupByEnvironment && groupedData
                      ? Object.entries(groupedData).map(([env, items]) => (
                          <React.Fragment key={env}>
                            <TableRow className='bg-muted/50 font-semibold hover:bg-muted/70'>
                              <TableCell colSpan={selectedColumns.length + 1}>
                                <FolderOpen className='w-4 h-4 inline mr-2' />
                                {env} ({items.length} itens)
                              </TableCell>
                            </TableRow>
                            {items.map((item) => {
                              const originalIndex = coatingsData.indexOf(item);
                              return (
                                <TableRow key={originalIndex}>
                                  {isColumnVisible('ambiente') && (
                                    <TableCell>
                                      <Input
                                        value={item.ambiente}
                                        onChange={(e) =>
                                          updateItem(originalIndex, {
                                            ambiente: e.target.value,
                                          })
                                        }
                                        className='h-8'
                                      />
                                    </TableCell>
                                  )}
                                  {isColumnVisible('material') && (
                                    <TableCell>
                                      <Input
                                        value={item.material}
                                        onChange={(e) =>
                                          updateItem(originalIndex, {
                                            material: e.target.value,
                                          })
                                        }
                                        className='h-8'
                                      />
                                    </TableCell>
                                  )}
                                  {isColumnVisible('marca') && (
                                    <TableCell>
                                      <Input
                                        value={item.marca}
                                        onChange={(e) =>
                                          updateItem(originalIndex, {
                                            marca: e.target.value,
                                          })
                                        }
                                        className='h-8'
                                      />
                                    </TableCell>
                                  )}
                                  {isColumnVisible('acabamento') && (
                                    <TableCell>
                                      <Input
                                        value={item.acabamento}
                                        onChange={(e) =>
                                          updateItem(originalIndex, {
                                            acabamento: e.target.value,
                                          })
                                        }
                                        className='h-8'
                                      />
                                    </TableCell>
                                  )}
                                  {isColumnVisible('area') && (
                                    <TableCell>
                                      <Badge variant='secondary'>
                                        {item.area}
                                      </Badge>
                                    </TableCell>
                                  )}
                                  {isColumnVisible('acrescimo') && (
                                    <TableCell>
                                      <Input
                                        type='number'
                                        value={item.acrescimo}
                                        onChange={(e) =>
                                          updateItem(originalIndex, {
                                            acrescimo:
                                              parseFloat(e.target.value) || 0,
                                          })
                                        }
                                        className='h-8 w-20'
                                      />
                                    </TableCell>
                                  )}
                                  {isColumnVisible('total') && (
                                    <TableCell>
                                      <Badge>{item.total}</Badge>
                                    </TableCell>
                                  )}
                                  <TableCell>
                                    <Button
                                      variant='ghost'
                                      size='sm'
                                      onClick={() =>
                                        handleRemoveItem(originalIndex)
                                      }
                                    >
                                      <Trash2 className='w-4 h-4 text-destructive' />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </React.Fragment>
                        ))
                      : coatingsData.map((item, originalIndex) => {
                          return (
                            <TableRow key={originalIndex}>
                              {isColumnVisible('ambiente') && (
                                <TableCell>
                                  <Input
                                    value={item.ambiente}
                                    onChange={(e) =>
                                      updateItem(originalIndex, {
                                        ambiente: e.target.value,
                                      })
                                    }
                                    className='h-8'
                                  />
                                </TableCell>
                              )}
                              {isColumnVisible('material') && (
                                <TableCell>
                                  <Input
                                    value={item.material}
                                    onChange={(e) =>
                                      updateItem(originalIndex, {
                                        material: e.target.value,
                                      })
                                    }
                                    className='h-8'
                                  />
                                </TableCell>
                              )}
                              {isColumnVisible('marca') && (
                                <TableCell>
                                  <Input
                                    value={item.marca}
                                    onChange={(e) =>
                                      updateItem(originalIndex, {
                                        marca: e.target.value,
                                      })
                                    }
                                    className='h-8'
                                  />
                                </TableCell>
                              )}
                              {isColumnVisible('acabamento') && (
                                <TableCell>
                                  <Input
                                    value={item.acabamento}
                                    onChange={(e) =>
                                      updateItem(originalIndex, {
                                        acabamento: e.target.value,
                                      })
                                    }
                                    className='h-8'
                                  />
                                </TableCell>
                              )}
                              {isColumnVisible('area') && (
                                <TableCell>
                                  <Badge variant='secondary'>{item.area}</Badge>
                                </TableCell>
                              )}
                              {isColumnVisible('acrescimo') && (
                                <TableCell>
                                  <Input
                                    type='number'
                                    value={item.acrescimo}
                                    onChange={(e) =>
                                      updateItem(originalIndex, {
                                        acrescimo:
                                          parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    className='h-8 w-20'
                                  />
                                </TableCell>
                              )}
                              {isColumnVisible('total') && (
                                <TableCell>
                                  <Badge>{item.total}</Badge>
                                </TableCell>
                              )}
                              <TableCell>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() =>
                                    handleRemoveItem(originalIndex)
                                  }
                                >
                                  <Trash2 className='w-4 h-4 text-destructive' />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
