'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDown, Download, FileSpreadsheet, Columns3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportCategoriesToolbarProps {
  isBusy: boolean;
  categories: string[];
  columnPrefs?: Record<string, boolean>;
  categoryData: Record<string, unknown>;
  exportPopoverOpen: boolean;
  selectedCategories: string[];
  onExport: (format: 'csv' | 'xlsx') => void;
  onColumnToggle?: (column: string, checked: boolean) => void;
  onCategoryToggle: (category: string, selected: boolean) => void;
  onExportPopoverChange: (open: boolean) => void;
}

export function ReportCategoriesToolbar({
  isBusy,
  categories,
  columnPrefs,
  categoryData,
  exportPopoverOpen,
  selectedCategories,
  onExport,
  onColumnToggle,
  onCategoryToggle,
  onExportPopoverChange,
}: ReportCategoriesToolbarProps) {
  return (
    <div className='flex items-center justify-between gap-2 pb-4 px-3.5 flex-wrap'>
      <div className='hidden lg:flex items-center gap-1 flex-wrap flex-1 min-w-0'>
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          const hasData = !!categoryData[category];

          return (
            <Button
              key={category}
              size='sm'
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onCategoryToggle(category, !isSelected)}
              className={cn(
                'relative gap-2',
                isSelected && 'bg-primary text-primary-foreground'
              )}
            >
              {category}
              {hasData && (
                <span
                  className={cn(
                    'inline-flex h-2 w-2 rounded-full',
                    isSelected ? 'bg-primary-foreground' : 'bg-green-500'
                  )}
                />
              )}
            </Button>
          );
        })}
      </div>

      {/* Mobile: Dropdown */}
      <div className='flex lg:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='gap-2'>
              <span>Grupos</span>
              {selectedCategories.length > 0 && (
                <Badge variant='secondary' className='ml-1'>
                  {selectedCategories.length}
                </Badge>
              )}
              <ChevronDown className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-[200px]'>
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) =>
                  onCategoryToggle(category, checked)
                }
              >
                {category}
                {categoryData[category] ? (
                  <span className='ml-2 inline-flex h-2 w-2 rounded-full bg-green-500' />
                ) : null}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='flex items-center gap-2 ml-auto'>
        {columnPrefs && onColumnToggle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='gap-2'>
                <Columns3 className='h-4 w-4' />
                <span className='hidden sm:inline'>Colunas</span>
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[200px]'>
              {Object.keys(columnPrefs).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column}
                  checked={columnPrefs[column] !== false}
                  onCheckedChange={(checked) =>
                    onColumnToggle(column, checked as boolean)
                  }
                >
                  {column}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Popover open={exportPopoverOpen} onOpenChange={onExportPopoverChange}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='gap-2'
              disabled={selectedCategories.length === 0 || isBusy}
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
                onClick={() => onExport('csv')}
              >
                <FileSpreadsheet className='h-4 w-4' />
                Exportar CSV
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start gap-2'
                onClick={() => onExport('xlsx')}
              >
                <FileSpreadsheet className='h-4 w-4' />
                Exportar XLSX
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
