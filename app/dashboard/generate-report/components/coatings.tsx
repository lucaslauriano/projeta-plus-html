'use client';

import React, { useState, useMemo } from 'react';
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
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Layers,
  FileSpreadsheet,
  Plus,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';
import { EmptyState } from './empty-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    addSelectedMaterial,
    updateItem,
    removeItem,
    exportCSV,
    exportXLSX,
  } = useCoatingsReports();

  // Estados locais
  const [searchTerm, setSearchTerm] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('__all__');
  const [groupByEnvironment, setGroupByEnvironment] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.map((c) => c.id)
  );

  const hasData = coatingsData && coatingsData.length > 0;

  // Filtros
  const filteredData = useMemo(() => {
    return coatingsData.filter((item) => {
      const matchSearch =
        !searchTerm ||
        item.material.toLowerCase().includes(searchTerm.toLowerCase());
      const matchEnvironment =
        environmentFilter === '__all__' || item.ambiente === environmentFilter;
      return matchSearch && matchEnvironment;
    });
  }, [coatingsData, searchTerm, environmentFilter]);

  // Dados agrupados
  const groupedData = useMemo(() => {
    if (!groupByEnvironment) return null;

    const groups: { [key: string]: typeof filteredData } = {};
    filteredData.forEach((item) => {
      const env = item.ambiente || 'Sem Ambiente';
      if (!groups[env]) groups[env] = [];
      groups[env].push(item);
    });
    return groups;
  }, [filteredData, groupByEnvironment]);

  // Ambientes únicos para filtro
  const uniqueEnvironments = useMemo(() => {
    return Array.from(new Set(coatingsData.map((item) => item.ambiente)))
      .filter(Boolean)
      .sort();
  }, [coatingsData]);

  // Handlers
  const handleAddMaterial = () => {
    addSelectedMaterial();
  };

  const handleExportCSV = () => {
    if (!hasData || isBusy) return;
    exportCSV(coatingsData, selectedColumns);
  };

  const handleExportXLSX = () => {
    if (!hasData || isBusy) return;
    exportXLSX(coatingsData, selectedColumns);
  };

  const handleRemoveItem = (index: number) => {
    if (confirm('Deseja realmente remover este item?')) {
      removeItem(index);
    }
  };

  const toggleColumn = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const isColumnVisible = (columnId: string) =>
    selectedColumns.includes(columnId);

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-bold'>Revestimentos</h2>
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

      {/* Controles */}
      <Card>
        <CardContent className=' space-y-4'>
          {/* Filtros */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Buscar Material</label>
              <Input
                placeholder='Digite para buscar...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Select
                label='Filtrar por Ambiente'
                value={environmentFilter}
                onValueChange={setEnvironmentFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Todos os ambientes' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='__all__'>Todos os ambientes</SelectItem>
                  {uniqueEnvironments.map((env) => (
                    <SelectItem key={env} value={env}>
                      {env}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          {/* Ações */}
          <div className='flex gap-2 pt-2 '>
            <Button
              onClick={handleAddMaterial}
              disabled={!isAvailable || isBusy}
              className='w-full gap-2'
            >
              <Plus className='w-4 h-4' />
              Adicionar Material
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dados */}
      {isBusy && !hasData ? (
        <Card>
          <CardContent className='flex items-center justify-center py-6'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <span className='ml-2'>Carregando dados...</span>
          </CardContent>
        </Card>
      ) : !hasData ? (
        <EmptyState
          icon={Layers}
          title='Nenhum revestimento adicionado'
          description='Use o conta-gotas do SketchUp para selecionar um material e clique em "Adicionar Material" para começar.'
        />
      ) : (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Quantitativo de Materiais</CardTitle>
              <div className='flex gap-2'>
                <Badge variant='outline'>{summary.totalItems} itens</Badge>
                <Badge variant='outline'>{summary.totalArea}m² total</Badge>
                {summary.uniqueEnvironments > 0 && (
                  <Badge variant='outline'>
                    {summary.uniqueEnvironments} ambientes
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Seleção de Colunas */}
            <div className='mb-4 p-3 bg-muted rounded-md'>
              <p className='text-sm font-medium mb-2'>Colunas Visíveis:</p>
              <div className='flex flex-wrap gap-3'>
                {AVAILABLE_COLUMNS.map((col) => (
                  <div key={col.id} className='flex items-center gap-2'>
                    <Checkbox
                      id={`col-${col.id}`}
                      checked={isColumnVisible(col.id)}
                      onCheckedChange={() => toggleColumn(col.id)}
                    />
                    <label
                      htmlFor={`col-${col.id}`}
                      className='text-xs cursor-pointer'
                    >
                      {col.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela */}
            <div className='rounded-md border max-h-[600px] overflow-auto'>
              <Table>
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
                          <TableRow className='bg-muted font-semibold'>
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
                    : filteredData.map((item) => {
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
                                onClick={() => handleRemoveItem(originalIndex)}
                              >
                                <Trash2 className='w-4 h-4 text-destructive' />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  {/* Linha de Total */}
                  <TableRow className='bg-muted font-semibold'>
                    <TableCell
                      colSpan={
                        isColumnVisible('area')
                          ? selectedColumns.indexOf('area') + 1
                          : 1
                      }
                    >
                      TOTAL
                    </TableCell>
                    {isColumnVisible('area') && (
                      <>
                        {selectedColumns
                          .slice(
                            selectedColumns.indexOf('area') + 1,
                            selectedColumns.indexOf('total')
                          )
                          .map((col) => (
                            <TableCell key={col}></TableCell>
                          ))}
                      </>
                    )}
                    {isColumnVisible('total') && (
                      <TableCell>{summary.totalArea}</TableCell>
                    )}
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Informação */}
            <div className='mt-4 p-3 bg-muted rounded-md'>
              <p className='text-xs text-muted-foreground'>
                💡 <strong>Dica:</strong> Use o conta-gotas (Material
                Eyedropper) do SketchUp para selecionar um material e clique em
                &quot;Adicionar Material&quot;. O acréscimo percentual é
                calculado automaticamente no total.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
