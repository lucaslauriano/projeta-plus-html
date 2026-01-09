'use client';

import * as React from 'react';
import { Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectCommandProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  showSummary?: boolean;
  showClearButton?: boolean;
  groupHeading?: string;
}

export function MultiSelectCommand({
  options,
  selected,
  onChange,
  placeholder = 'Selecionar...',
  searchPlaceholder = 'Digite para buscar...',
  emptyText = 'Nenhum item encontrado.',
  className,
  showSummary = true,
  showClearButton = true,
  groupHeading = 'Itens disponíveis',
}: MultiSelectCommandProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (value: string) => {
    const isSelected = selected.includes(value);
    if (isSelected) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getSelectedLabels = () => {
    return selected
      .map((val) => options.find((opt) => opt.value === val)?.label)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className={cn('space-y-3', className)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='w-full justify-between'>
            <div className='flex items-center gap-2'>
              <Search className='h-4 w-4 opacity-50' />
              <span className='truncate'>
                {selected.length === 0
                  ? placeholder
                  : `${placeholder} (${selected.length})`}
              </span>
            </div>
            <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
              ⌘K
            </kbd>
          </Button>
        </DialogTrigger>
        <DialogContent className='p-0 gap-0'>
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup heading={groupHeading}>
                {filteredOptions.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleToggle(option.value)}
                    >
                      <div className='flex items-center w-full'>
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span>{option.label}</span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Resumo das seleções */}
      {showSummary && selected.length > 0 && (
        <div className='flex items-center gap-2 text-sm'>
          <span className='text-muted-foreground'>Selecionadas:</span>
          <span className='flex-1 truncate'>{getSelectedLabels()}</span>
          {showClearButton && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleClearAll}
              className='h-7 px-2 text-xs'
            >
              Limpar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
