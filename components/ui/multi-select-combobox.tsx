'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

export interface MultiSelectComboboxProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  showBadges?: boolean;
  showClearAll?: boolean;
}

export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder = 'Selecionar...',
  searchPlaceholder = 'Buscar...',
  emptyText = 'Nenhum item encontrado.',
  className,
  showBadges = true,
  showClearAll = true,
}: MultiSelectComboboxProps) {
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

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getSelectedLabels = () => {
    return selected
      .map((val) => options.find((opt) => opt.value === val)?.label)
      .filter(Boolean);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            <span className='truncate'>
              {selected.length === 0
                ? placeholder
                : `${selected.length} ${
                    selected.length === 1 ? 'item selecionado' : 'itens selecionados'
                  }`}
            </span>
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0' align='start'>
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleToggle(option.value)}
                  >
                    <div className='flex items-center w-full'>
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selected.includes(option.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <span>{option.label}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Badges */}
      {showBadges && selected.length > 0 && (
        <div className='flex flex-wrap gap-2 items-center'>
          {getSelectedLabels().map((label, index) => (
            <Badge
              key={selected[index]}
              variant='secondary'
              className='pl-3 pr-1 py-1'
            >
              {label}
              <Button
                variant='ghost'
                size='sm'
                className='h-4 w-4 p-0 ml-1 hover:bg-transparent'
                onClick={() => handleRemove(selected[index])}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          ))}
          {showClearAll && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleClearAll}
              className='h-7 px-2 text-xs text-muted-foreground hover:text-foreground'
            >
              Limpar tudo
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
