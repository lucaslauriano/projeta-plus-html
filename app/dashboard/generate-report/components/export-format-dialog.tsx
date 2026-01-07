'use client';

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';

interface ExportFormatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  onExport: (format: 'csv' | 'xlsx') => void;
  isBusy?: boolean;
}

export function ExportFormatDialog({
  open,
  onExport,
  onOpenChange,
  categoryName,
  isBusy = false,
}: ExportFormatDialogProps) {
  const [format, setFormat] = useState<'csv' | 'xlsx'>('xlsx');

  const handleExport = () => {
    onExport(format);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex text-start'>
            Exportar {categoryName}
          </AlertDialogTitle>
          <AlertDialogDescription className='flex text-start items-center justify-start'>
            Escolha o formato do arquivo para exportação
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='py-2'>
          <RadioGroup
            value={format}
            onValueChange={(val) => setFormat(val as 'csv' | 'xlsx')}
          >
            <div className='space-y-4'>
              <div className='flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors'>
                <RadioGroupItem
                  value='xlsx'
                  id='format-xlsx'
                  className='mt-1'
                />
                <div className='flex-1'>
                  <Label
                    htmlFor='format-xlsx'
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <FileSpreadsheet className='w-4 h-4 text-green-600' />
                    <span className='font-medium'>XLSX (Excel)</span>
                  </Label>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Arquivo Excel formatado com cores e estilos. Requer
                    Microsoft Excel instalado.
                  </p>
                </div>
              </div>

              {/* CSV Option */}
              <div className='flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors'>
                <RadioGroupItem value='csv' id='format-csv' className='mt-1' />
                <div className='flex-1'>
                  <Label
                    htmlFor='format-csv'
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <FileText className='w-4 h-4 text-blue-600' />
                    <span className='font-medium'>CSV</span>
                  </Label>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Arquivo de texto simples, compatível com qualquer planilha.
                    Sem formatação especial.
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <AlertDialogFooter className='gap-y-2'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isBusy}
          >
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isBusy}>
            {isBusy && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Exportar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
