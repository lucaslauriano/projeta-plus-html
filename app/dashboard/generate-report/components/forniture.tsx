'use client';

import React, { useState, useEffect } from 'react';
import { useFurnitureReports } from '@/hooks/useFurnitureReports';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, FileSpreadsheet, Eye, Trash2 } from 'lucide-react';
import { DeleteConfirmDialog } from './delete-confirm-dialog';

export function FurnitureReports() {
  const {
    categories,
    categoryData,
    categoryPrefs,
    columnPrefs,
    isBusy,
    isAvailable,
    getCategoryData,
    saveCategoryPreferences,
    saveColumnPreferences,
    exportCategoryCSV,
    exportXLSX,
    isolateFurnitureItem,
    deleteFurnitureItem,
  } = useFurnitureReports();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    itemId: number | null;
    itemName: string;
  }>({
    open: false,
    itemId: null,
    itemName: '',
  });

  // Sincroniza selectedCategories com categoryPrefs
  useEffect(() => {
    const selected = categories.filter(
      (cat) => categoryPrefs[cat]?.show !== false
    );
    console.log('[Forniture] Categories:', categories);
    console.log('[Forniture] CategoryPrefs:', categoryPrefs);
    console.log('[Forniture] Selected categories:', selected);
    setSelectedCategories(selected);
  }, [categories, categoryPrefs]);

  // Carrega dados das categorias selecionadas
  useEffect(() => {
    console.log(
      '[Forniture] Loading data for selected categories:',
      selectedCategories
    );
    console.log('[Forniture] Current categoryData:', categoryData);
    selectedCategories.forEach((category) => {
      if (!categoryData[category]) {
        console.log('[Forniture] Fetching data for category:', category);
        getCategoryData(category);
      }
    });
  }, [selectedCategories, categoryData, getCategoryData]);

  const handleCategoryToggle = (category: string, checked: boolean) => {
    const newPrefs = {
      ...categoryPrefs,
      [category]: {
        ...categoryPrefs[category],
        show: checked,
      },
    };
    saveCategoryPreferences(newPrefs);
  };

  const handleExportCategoryToggle = (category: string, checked: boolean) => {
    const newPrefs = {
      ...categoryPrefs,
      [category]: {
        ...categoryPrefs[category],
        export: checked,
      },
    };
    saveCategoryPreferences(newPrefs);
  };

  const handleColumnToggle = (column: string, checked: boolean) => {
    const newPrefs = {
      ...columnPrefs,
      [column]: checked,
    };
    saveColumnPreferences(newPrefs);
  };

  const handleExportCSV = (category: string) => {
    exportCategoryCSV(category);
  };

  const handleExportXLSX = () => {
    const categoriesToExport = categories.filter(
      (cat) => categoryPrefs[cat]?.export !== false
    );
    exportXLSX(categoriesToExport);
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
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Mobiliário</h2>
          <p className='text-sm text-muted-foreground'>
            Gerencie e exporte relatórios de mobiliário do projeto
          </p>
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

      {/* Category Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
          <CardDescription>
            Selecione as categorias para exibir e exportar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {categories.map((category) => (
              <div key={category} className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id={`show-${category}`}
                    checked={categoryPrefs[category]?.show !== false}
                    onCheckedChange={(checked) =>
                      handleCategoryToggle(category, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`show-${category}`}
                    className='text-sm font-medium cursor-pointer'
                  >
                    {category}
                  </label>
                </div>
                <div className='flex items-center space-x-2 ml-6'>
                  <Checkbox
                    id={`export-${category}`}
                    checked={categoryPrefs[category]?.export !== false}
                    onCheckedChange={(checked) =>
                      handleExportCategoryToggle(category, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`export-${category}`}
                    className='text-xs text-muted-foreground cursor-pointer'
                  >
                    Exportar
                  </label>
                </div>
              </div>
            ))}
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

      {/* Export Actions */}
      <div className='flex gap-2'>
        <Button
          onClick={handleExportXLSX}
          disabled={isBusy || false}
          title='Exportação XLSX disponível apenas no Windows'
        >
          <FileSpreadsheet className='w-4 h-4 mr-2' />
          Exportar XLSX
        </Button>
      </div>

      {/* Category Tables */}
      {selectedCategories.map((category) => {
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
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleExportCSV(category)}
                  disabled={isBusy}
                >
                  <Download className='w-4 h-4 mr-2' />
                  CSV
                </Button>
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
      })}

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
