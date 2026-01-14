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
  categories: string[];
  selectedCategories: string[];
  categoryData: Record<string, unknown>;
  isBusy: boolean;
  onCategoryToggle: (category: string, selected: boolean) => void;
  onExport: (format: 'csv' | 'xlsx') => void;
  exportPopoverOpen: boolean;
  onExportPopoverChange: (open: boolean) => void;
  // Optional column customization
  columnPrefs?: Record<string, boolean>;
  onColumnToggle?: (column: string, checked: boolean) => void;
}

export function ReportCategoriesToolbar({
  categories,
  selectedCategories,
  categoryData,
  isBusy,
  onCategoryToggle,
  onExport,
  exportPopoverOpen,
  onExportPopoverChange,
  columnPrefs,
  onColumnToggle,
}: ReportCategoriesToolbarProps) {
  return (
    <div className='flex items-center justify-between gap-2 pb-4 px-2 flex-wrap'>
      {/* Desktop: Tabs */}
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

      {/* Column Customization & Export */}
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
