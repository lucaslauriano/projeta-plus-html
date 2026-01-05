'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';

interface ExportXLSXModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  categoryPrefs: Record<string, { show?: boolean; export?: boolean }>;
  onExport: (selectedCategories: string[], format: 'csv' | 'xlsx') => void;
  isBusy?: boolean;
}

export function ExportXLSXModal({
  open,
  onOpenChange,
  categories,
  categoryPrefs,
  onExport,
  isBusy = false,
}: ExportXLSXModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [format, setFormat] = useState<'csv' | 'xlsx'>('xlsx');

  // Inicializa categorias selecionadas quando o modal abre
  React.useEffect(() => {
    if (open) {
      const preSelected = categories.filter(
        (cat) => categoryPrefs[cat]?.export !== false
      );
      setSelectedCategories(preSelected);
    }
  }, [open, categories, categoryPrefs]);

  const handleToggleCategory = (category: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  const handleSelectAll = () => {
    setSelectedCategories([...categories]);
  };

  const handleDeselectAll = () => {
    setSelectedCategories([]);
  };

  const handleExport = () => {
    if (selectedCategories.length > 0) {
      onExport(selectedCategories, format);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FileSpreadsheet className='w-5 h-5' />
            Exportar Consolidado
          </DialogTitle>
          <DialogDescription className='flex text-start items-center justify-start text-xs text-muted-foreground'>
            Selecione as categorias e o formato de arquivo
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-2 py-2'>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleSelectAll}
              disabled={isBusy}
            >
              Selecionar Todas
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handleDeselectAll}
              disabled={isBusy}
            >
              Desmarcar Todas
            </Button>
          </div>

          <div className='max-h-[300px] overflow-y-auto border rounded-md p-4'>
            <div>
              {categories.map((category) => (
                <div
                  key={category}
                  className='flex items-center space-x-3 hover:bg-accent/50 p-2 rounded-md transition-colors'
                >
                  <Checkbox
                    id={`export-modal-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) =>
                      handleToggleCategory(category, checked as boolean)
                    }
                    disabled={isBusy}
                  />
                  <label
                    htmlFor={`export-modal-${category}`}
                    className='flex-1 text-sm font-medium cursor-pointer'
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Formato de Exportação */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium'>Formato de Arquivo</Label>
            <RadioGroup
              value={format}
              onValueChange={(val) => setFormat(val as 'csv' | 'xlsx')}
            >
              <div className='flex gap-4'>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='xlsx' id='consolidated-xlsx' />
                  <Label
                    htmlFor='consolidated-xlsx'
                    className='flex items-center gap-2 cursor-pointer text-sm'
                  >
                    <FileSpreadsheet className='w-4 h-4 text-green-600' />
                    XLSX (Excel)
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='csv' id='consolidated-csv' />
                  <Label
                    htmlFor='consolidated-csv'
                    className='flex items-center gap-2 cursor-pointer text-sm'
                  >
                    <FileText className='w-4 h-4 text-blue-600' />
                    CSV
                  </Label>
                </div>
              </div>
            </RadioGroup>
            <p className='text-xs text-muted-foreground'>
              {format === 'xlsx'
                ? 'Arquivo Excel formatado (requer MS Excel instalado)'
                : 'Arquivo de texto simples, compatível com qualquer planilha'}
            </p>
          </div>
        </div>

        <DialogFooter className='!flex !flex-row !justify-between gap-2 w-full'>
          <Button
            size='sm'
            variant='outline'
            className='flex-1'
            onClick={() => onOpenChange(false)}
            disabled={isBusy}
          >
            Cancelar
          </Button>
          <Button
            size='sm'
            className='flex-1'
            onClick={handleExport}
            disabled={selectedCategories.length === 0 || isBusy}
          >
            {isBusy && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Exportar Consolidado{' '}
            {selectedCategories.length > 0 && `(${selectedCategories.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
