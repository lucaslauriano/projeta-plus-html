'use client';

import React, { useState } from 'react';
import { useFurnitureReports } from '@/hooks/useFurnitureReports';
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
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Info,
  Trash2,
  Loader2,
  Download,
  PackageSearch,
  FileSpreadsheet,
} from 'lucide-react';
import { DeleteConfirmDialog } from './delete-confirm-dialog';
import { ExportXLSXModal } from './export-xlsx-modal';
import { ExportFormatDialog } from './export-format-dialog';
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from '@radix-ui/react-tooltip';
import { TooltipContent } from '@/components/ui/tooltip';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';
import { EmptyState } from './empty-state';

export function FurnitureReports() {
  const {
    categories,
    categoryData,
    columnPrefs,
    isBusy,
    isAvailable,
    getCategoryData,
    saveColumnPreferences,
    exportCategoryCSV,
    exportXLSX,
    isolateFurnitureItem,
    deleteFurnitureItem,
  } = useFurnitureReports();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loadedCategories, setLoadedCategories] = useState<string[]>([]);
  const [xlsxModalOpen, setXlsxModalOpen] = useState(false);

  // Criar categoryPrefs baseado nas categorias carregadas
  const categoryPrefs = loadedCategories.reduce((acc, cat) => {
    acc[cat] = { show: true, export: true };
    return acc;
  }, {} as Record<string, { show: boolean; export: boolean }>);
  const [exportDialog, setExportDialog] = useState<{
    open: boolean;
    category: string;
  }>({ open: false, category: '' });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    itemId: number | null;
    itemName: string;
  }>({
    open: false,
    itemId: null,
    itemName: '',
  });

  // Função para carregar categorias selecionadas
  const handleLoadCategories = () => {
    selectedCategories.forEach((category) => {
      if (!loadedCategories.includes(category)) {
        console.log('[Forniture] Fetching data for category:', category);
        getCategoryData(category);
      }
    });
    setLoadedCategories(selectedCategories);
  };

  // Toggle de seleção de categoria
  const handleCategoryToggle = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    }
  };

  const handleColumnToggle = (column: string, checked: boolean) => {
    const newPrefs = {
      ...columnPrefs,
      [column]: checked,
    };
    saveColumnPreferences(newPrefs);
  };

  const handleExportCSV = (category: string) => {
    setExportDialog({ open: true, category });
  };

  const handleExportCategory = (format: 'csv' | 'xlsx') => {
    if (format === 'csv') {
      exportCategoryCSV(exportDialog.category);
    } else {
      // Exportação individual - isConsolidated = false
      exportXLSX([exportDialog.category], format, false);
    }
  };

  const handleExportXLSX = (
    selectedCategories: string[],
    format: 'csv' | 'xlsx'
  ) => {
    // Exportação consolidada - isConsolidated = true
    exportXLSX(selectedCategories, format, true);
  };

  const handleIsolate = (entityId: number) => {
    isolateFurnitureItem(entityId);
  };

  const handleDelete = (entityId: number, itemName: string) => {
    setDeleteDialog({
      open: true,
      itemId: entityId,
      itemName,
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.itemId) {
      deleteFurnitureItem(deleteDialog.itemId);
      setDeleteDialog({ open: false, itemId: null, itemName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, itemId: null, itemName: '' });
  };

  const visibleColumns = Object.keys(columnPrefs).filter(
    (col) => columnPrefs[col] !== false
  );

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-between gap-2 w-full'>
          <h2 className='text-lg font-bold'>Mobiliário</h2>
          <ViewConfigMenu
            menuItems={[
              {
                icon: <FileSpreadsheet className='w-4 h-4' />,
                label: 'Exportar Unificado',
                action: () => setXlsxModalOpen(true),
                hasDivider: false,
              },
            ]}
          />
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
        <CardHeader className='flex items-center justify-between '>
          <CardTitle className='px-0'>
            <h2 className='text-md font-medium'> Selecionar Categorias</h2>
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className='w-4 h-4 text-muted-foreground cursor-help' />
              </TooltipTrigger>
              <TooltipContent className='max-w-[200px]'>
                <p>Escolha as categorias que deseja visualizar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className='space-y-4 pt-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
            {categories.map((category) => (
              <div key={category} className='flex items-center space-x-2'>
                <Checkbox
                  id={`select-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) =>
                    handleCategoryToggle(category, checked as boolean)
                  }
                />
                <label
                  htmlFor={`select-${category}`}
                  className='text-sm font-medium cursor-pointer'
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
          <div className='w-fullflex gap-2'>
            <Button
              onClick={handleLoadCategories}
              disabled={isBusy || selectedCategories.length === 0}
              className='w-full'
            >
              {isBusy && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Carregar selecionadas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Column Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Colunas Visíveis</CardTitle>
          <CardDescription>
            Selecione as colunas para exibir no relatório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
            {Object.keys(columnPrefs).map((column) => (
              <div key={column} className='flex items-center space-x-2'>
                <Checkbox
                  id={`col-${column}`}
                  checked={columnPrefs[column] !== false}
                  onCheckedChange={(checked) =>
                    handleColumnToggle(column, checked as boolean)
                  }
                />
                <label
                  htmlFor={`col-${column}`}
                  className='text-sm cursor-pointer'
                >
                  {column}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Tables */}
      {loadedCategories.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title='Sem categorias carregadas'
          description={
            <>
              Selecione as categorias desejadas acima e clique no botão{' '}
              <span className='font-medium text-foreground'>
                &quot;Carregar selecionadas&quot;
              </span>{' '}
              para visualizar os dados do seu projeto
            </>
          }
          steps={[
            { label: 'Selecione categorias' },
            { label: 'Clique em carregar' },
            { label: 'Visualize os dados' },
          ]}
        />
      ) : (
        loadedCategories.map((category) => {
          const data = categoryData[category];
          if (!data) return null;

          return (
            <Card key={category}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle>{category}</CardTitle>
                    <CardDescription>
                      {data.itemCount} itens • Total: R$ {data.total.toFixed(2)}
                    </CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleExportCSV(category)}
                          disabled={isBusy}
                        >
                          <Download className='w-4 h-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className='text-sm'>Exportar</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {visibleColumns.map((col) => (
                          <TableHead key={col}>{col}</TableHead>
                        ))}
                        <TableHead className='text-right'>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.items.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={visibleColumns.length + 1}
                            className='text-center text-muted-foreground'
                          >
                            Nenhum item nesta categoria
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.items.map((item, index) => (
                          <TableRow key={index}>
                            {visibleColumns.includes('Código') && (
                              <TableCell className='font-mono'>
                                <Badge>{item.code}</Badge>
                              </TableCell>
                            )}
                            {visibleColumns.includes('Nome') && (
                              <TableCell>{item.name}</TableCell>
                            )}
                            {visibleColumns.includes('Cor') && (
                              <TableCell>{item.color}</TableCell>
                            )}
                            {visibleColumns.includes('Marca') && (
                              <TableCell>{item.brand}</TableCell>
                            )}
                            {visibleColumns.includes('Dimensão') && (
                              <TableCell>{item.dimension}</TableCell>
                            )}
                            {visibleColumns.includes('Ambiente') && (
                              <TableCell>{item.environment}</TableCell>
                            )}
                            {visibleColumns.includes('Observações') && (
                              <TableCell>{item.observations}</TableCell>
                            )}
                            {visibleColumns.includes('Link') && (
                              <TableCell>
                                {item.link && (
                                  <a
                                    href={item.link}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-500 hover:underline text-sm'
                                  >
                                    Link
                                  </a>
                                )}
                              </TableCell>
                            )}
                            {visibleColumns.includes('Valor') && (
                              <TableCell>{item.value}</TableCell>
                            )}
                            {visibleColumns.includes('Quantidade') && (
                              <TableCell>{item.quantity}</TableCell>
                            )}
                            <TableCell className='text-right'>
                              <div className='flex items-center justify-end gap-2'>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => handleIsolate(item.ids[0])}
                                  title='Isolar'
                                >
                                  <Eye className='w-4 h-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() =>
                                    handleDelete(item.ids[0], item.name)
                                  }
                                  title='Remover'
                                >
                                  <Trash2 className='w-4 h-4 text-destructive' />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Export Format Dialog (Individual) */}
      <ExportFormatDialog
        open={exportDialog.open}
        onOpenChange={(open) => setExportDialog({ open, category: '' })}
        categoryName={exportDialog.category}
        onExport={handleExportCategory}
        isBusy={isBusy}
      />

      {/* Export XLSX Modal */}
      <ExportXLSXModal
        open={xlsxModalOpen}
        onOpenChange={setXlsxModalOpen}
        categories={categories}
        categoryPrefs={categoryPrefs}
        onExport={handleExportXLSX}
        isBusy={isBusy}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        title='Confirmar Exclusão'
        description={`Deseja realmente remover o item "${deleteDialog.itemName}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
