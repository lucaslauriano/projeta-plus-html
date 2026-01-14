'use client';

import React, { useState } from 'react';
import { useFurnitureReports } from '@/hooks/useFurnitureReports';
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
import { Loader2, FileSearch } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { EmptyState } from '@/app/dashboard/generate-report/components/empty-state';
import { ReportCategoriesToolbar } from './report-categories-toolbar';

export function FurnitureReports() {
  const {
    isBusy,
    exportXLSX,
    categories,
    isAvailable,
    columnPrefs,
    categoryData,
    getCategoryData,
    saveColumnPreferences,
  } = useFurnitureReports();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [exportPopoverOpen, setExportPopoverOpen] = useState(false);
  // const [deleteDialog, setDeleteDialog] = useState<{
  //   open: boolean;
  //   itemId: number | null;
  //   itemName: string;
  // }>({
  //   open: false,
  //   itemId: null,
  //   itemName: '',
  // });

  const handleCategoryToggle = (category: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter((c) => c !== category);

    setSelectedCategories(newSelected);

    if (checked && !categoryData[category]) {
      console.log('[Forniture] Auto-loading data for category:', category);
      getCategoryData(category);
    }
  };

  const handleColumnToggle = (column: string, checked: boolean) => {
    const newPrefs = {
      ...columnPrefs,
      [column]: checked,
    };
    saveColumnPreferences(newPrefs);
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    if (selectedCategories.length === 0) return;

    exportXLSX(selectedCategories, format, true);
    setExportPopoverOpen(false);
  };

  // const handleIsolate = (entityId: number) => {
  //   isolateFurnitureItem(entityId);
  // };

  // const handleDelete = (entityId: number, itemName: string) => {
  //   setDeleteDialog({
  //     open: true,
  //     itemId: entityId,
  //     itemName,
  //   });
  // };

  // const confirmDelete = () => {
  //   if (deleteDialog.itemId) {
  //     deleteFurnitureItem(deleteDialog.itemId);
  //     setDeleteDialog({ open: false, itemId: null, itemName: '' });
  //   }
  // };

  // const cancelDelete = () => {
  //   setDeleteDialog({ open: false, itemId: null, itemName: '' });
  // };

  const visibleColumns = Object.keys(columnPrefs).filter(
    (col) => columnPrefs[col] !== false
  );

  const consolidatedData = selectedCategories
    .filter((cat) => categoryData[cat])
    .flatMap((category) => {
      const data = categoryData[category];
      return [
        {
          isHeader: true,
          category: category,
          itemCount: data.itemCount,
          total: data.total,
        },
        ...data.items.map((item) => ({
          ...item,
          isHeader: false,
          category: category,
        })),
      ];
    });

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-between gap-2 w-full'>
          <h2 className='text-lg font-bold'>Mobiliário</h2>
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

      <Card className=''>
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
              <EmptyState
                icon={FileSearch}
                title='Sem categorias selecionadas'
                description='Selecione as categorias desejadas acima para visualizar os dados do seu projeto'
              />
            ) : consolidatedData.length === 0 ? (
              <div className='py-6 flex items-center justify-center'>
                <div className='flex flex-col items-center gap-2'>
                  <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
                  <p className='text-sm text-muted-foreground'>
                    Carregando dados das categorias selecionadas...
                  </p>
                </div>
              </div>
            ) : (
              <Table className='border border-t-1'>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.map((col) => (
                      <TableHead key={col}>{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* eslint-disable @typescript-eslint/no-explicit-any */}
                  {consolidatedData.map((row, index) => {
                    if (row.isHeader) {
                      const header = row as {
                        isHeader: true;
                        category: string;
                        itemCount: number;
                        total: number;
                      };
                      return (
                        <TableRow
                          key={`header-${header.category}-${index}`}
                          className='bg-muted/50 hover:bg-muted/70'
                        >
                          <TableCell
                            colSpan={visibleColumns.length + 1}
                            className='font-semibold'
                          >
                            <div className='flex items-center justify-between'>
                              <span>{header.category}</span>
                              <span className='text-sm text-muted-foreground'>
                                {header.itemCount} itens • Total:{' '}
                                {formatCurrency(header.total, {
                                  locale: 'pt-BR',
                                  currency: 'BRL',
                                })}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    const item = row as any;
                    return (
                      <TableRow key={`item-${item.category}-${index}`}>
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
                          <TableCell>
                            {item?.value ? formatCurrency(item?.value) : '-'}
                          </TableCell>
                        )}
                        {visibleColumns.includes('Quantidade') && (
                          <TableCell className='text-center'>
                            {item.quantity}
                          </TableCell>
                        )}
                        {/* 
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
                        */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {/* <DeleteConfirmDialog
        open={deleteDialog.open}
        title='Confirmar Exclusão'
        description={`Deseja realmente remover o item "${deleteDialog.itemName}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      /> */}
    </div>
  );
}
