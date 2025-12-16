'use client';

import React, { useState } from 'react';
import { Eye, Grid3x3, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useSections } from '@/hooks/useSections';
import { ViewConfigMenu } from '@/app/dashboard/inteli-sket/components/view-config-menu';

export default function SectionsComponent() {
  const {
    data,
    isBusy,
    isAvailable,
    getSections,
    createStandardSections,
    createAutoViews,
    createIndividualSection,
    deleteSection,
    saveToJson,
    loadFromJson,
    loadDefault,
    loadFromFile,
    importToModel,
    clearAll,
  } = useSections();

  const [isIndividualDialogOpen, setIsIndividualDialogOpen] = useState(false);
  const [individualSectionName, setIndividualSectionName] = useState('');
  const [individualSectionDirection, setIndividualSectionDirection] =
    useState('frente');

  const handleCreateIndividualSection = () => {
    if (!individualSectionName.trim()) {
      return;
    }

    createIndividualSection(individualSectionDirection, individualSectionName);
    setIsIndividualDialogOpen(false);
    setIndividualSectionName('');
    setIndividualSectionDirection('frente');
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-semibold'>Seções</h2>
          {!isAvailable && (
            <Badge variant='outline' className='text-xs'>
              Modo Simulação
            </Badge>
          )}
        </div>
        <Button
          size='sm'
          variant='ghost'
          onClick={getSections}
          disabled={isBusy}
        >
          <ViewConfigMenu
            isBusy={isBusy}
            entityLabel='Seção'
            onEdit={() => {}}
          />
        </Button>
      </div>

      {/* Main Actions */}
      <div className='flex flex-col gap-2 w-full'>
        <Button
          size='sm'
          variant='default'
          onClick={createStandardSections}
          disabled={isBusy}
        >
          <Grid3x3 className='w-5 h-5' />
          Cortes Gerais (A, B, C, D)
        </Button>

        <Button
          size='sm'
          variant='default'
          onClick={createAutoViews}
          disabled={isBusy}
        >
          <Eye className='w-5 h-5' />
          Vistas Auto (Objeto Selecionado)
        </Button>

        <Dialog
          open={isIndividualDialogOpen}
          onOpenChange={setIsIndividualDialogOpen}
        >
          <DialogTrigger asChild>
            <Button size='sm' variant='default' disabled={isBusy}>
              <Scissors className='w-5 h-5' />
              Corte Individual
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Corte Individual</DialogTitle>
              <DialogDescription>
                Configure o nome e a direção do corte
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='section-name'>Nome do Corte</Label>
                <Input
                  id='section-name'
                  placeholder='Ex: Cozinha, Banheiro...'
                  value={individualSectionName}
                  onChange={(e) => setIndividualSectionName(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='section-direction'>Direção</Label>
                <Select
                  value={individualSectionDirection}
                  onValueChange={setIndividualSectionDirection}
                >
                  <SelectTrigger id='section-direction'>
                    <SelectValue placeholder='Selecione a direção' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='frente'>Frente</SelectItem>
                    <SelectItem value='esquerda'>Esquerda</SelectItem>
                    <SelectItem value='voltar'>Voltar</SelectItem>
                    <SelectItem value='direita'>Direita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsIndividualDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateIndividualSection}>Criar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
