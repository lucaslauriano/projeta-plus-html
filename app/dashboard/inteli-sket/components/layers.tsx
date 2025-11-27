'use client';

import React, { useState } from 'react';
import {
  Folder,
  Tag,
  Trash2,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Save,
  FileJson,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useLayers } from '@/hooks/useLayers';

export default function LayersComponent() {
  const {
    data,
    jsonPath,
    isBusy,
    countTags,
    rgbToHex,
    loadLayers,
    addFolder,
    addTag,
    deleteLayer,
    toggleVisibility,
    saveToJson,
    loadFromJson,
    importToModel,
    clearAll,
  } = useLayers();

  const [newFolderName, setNewFolderName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#00d9ff');
  const [selectedFolder, setSelectedFolder] = useState<string>('root');

  const handleAddFolder = () => {
    if (addFolder(newFolderName)) {
      setNewFolderName('');
    }
  };

  const handleAddTag = () => {
    if (addTag(newTagName, newTagColor, selectedFolder)) {
      setNewTagName('');
    }
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold flex items-center gap-2'>
          <Tag className='w-5 h-5' />
          Gerenciador de Tags
        </h2>
        <Badge variant='secondary'>{countTags()}</Badge>
      </div>

      {jsonPath && (
        <div className='text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded border break-all'>
          📁 {jsonPath}
        </div>
      )}

      <div className='grid gap-3 p-3 border rounded-lg bg-card/50'>
        <h3 className='text-sm font-medium flex items-center gap-1'>
          <Plus className='w-4 h-4' />
          Adicionar
        </h3>
        <div className='flex gap-2 items-center'>
          <Input
            placeholder='Nova Pasta'
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className='h-8'
          />
          <Button
            size='sm'
            variant='outline'
            onClick={handleAddFolder}
            className='h-8 bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/30'
          >
            <Folder className='w-4 h-4 mr-1' />
            Pasta
          </Button>
        </div>

        <div className='flex gap-2 items-center flex-wrap'>
          <Input
            placeholder='Nova Tag'
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className='h-8 w-40 flex-1'
          />
          <input
            type='color'
            value={newTagColor}
            onChange={(e) => setNewTagColor(e.target.value)}
            className='h-8 w-8 rounded cursor-pointer border-0 p-0'
          />
          <Select value={selectedFolder} onValueChange={setSelectedFolder}>
            <SelectTrigger className='h-8 w-[140px]'>
              <SelectValue placeholder='Pasta' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='root'>Sem Pasta</SelectItem>
              {data.folders.map((f, i) => (
                <SelectItem key={i} value={f.name}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size='sm'
            onClick={handleAddTag}
            className='h-8 bg-green-500/10 hover:bg-green-500/20 border-green-500/30'
          >
            <Tag className='w-4 h-4 mr-1' />
            Tag
          </Button>
        </div>
      </div>

      <div className='border rounded-lg bg-card/50'>
        <div className='px-3 py-2 border-b flex items-center gap-2'>
          <h3 className='text-sm font-medium flex items-center gap-1'>
            📋 Lista de Tags
          </h3>
          <Badge variant='outline' className='text-xs'>
            {countTags()}
          </Badge>
        </div>
        <div className='h-[300px] p-3 overflow-y-auto'>
          {isBusy ? (
            <div className='flex justify-center items-center h-full text-muted-foreground'>
              <RefreshCw className='w-6 h-6 animate-spin mr-2' />
              Carregando...
            </div>
          ) : (
            <div className='space-y-2'>
              {data.folders.map((folder, i) => (
                <div
                  key={i}
                  className='border rounded-md overflow-hidden bg-muted/20'
                >
                  <div className='bg-yellow-500/10 px-3 py-2 flex items-center justify-between border-l-2 border-yellow-500'>
                    <div className='flex items-center gap-2 font-medium text-sm'>
                      <Folder className='w-4 h-4 text-yellow-500' />
                      {folder.name}
                    </div>
                    <Badge
                      variant='outline'
                      className='text-xs bg-green-500/20 border-green-500/30'
                    >
                      {folder.tags.length}
                    </Badge>
                  </div>
                  <div className='p-2 space-y-1'>
                    {folder.tags.map((tag, j) => (
                      <div
                        key={j}
                        className='flex items-center gap-2 px-2 py-1 rounded hover:bg-accent/50 text-sm group'
                      >
                        <Checkbox
                          checked={tag.visible}
                          onCheckedChange={(checked) =>
                            toggleVisibility(tag.name, !!checked)
                          }
                          className='h-3 w-3'
                        />
                        <div
                          className='w-3 h-3 rounded-full border border-white/20'
                          style={{
                            backgroundColor: rgbToHex(
                              tag.color[0],
                              tag.color[1],
                              tag.color[2]
                            ),
                          }}
                        />
                        <span className='flex-1'>{tag.name}</span>
                        <button
                          onClick={() => deleteLayer(tag.name)}
                          className='opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    ))}
                    {folder.tags.length === 0 && (
                      <div className='text-xs text-muted-foreground px-2 italic'>
                        Vazio
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {data.tags.map((tag, i) => (
                <div
                  key={i}
                  className='flex items-center gap-2 px-3 py-2 rounded border hover:bg-accent/50 text-sm group'
                >
                  <Checkbox
                    checked={tag.visible}
                    onCheckedChange={(checked) =>
                      toggleVisibility(tag.name, !!checked)
                    }
                    className='h-3 w-3'
                  />
                  <div
                    className='w-3 h-3 rounded-full border border-white/20'
                    style={{
                      backgroundColor: rgbToHex(
                        tag.color[0],
                        tag.color[1],
                        tag.color[2]
                      ),
                    }}
                  />
                  <span className='flex-1'>{tag.name}</span>
                  <button
                    onClick={() => deleteLayer(tag.name)}
                    className='opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              ))}

              {data.folders.length === 0 && data.tags.length === 0 && (
                <div className='text-center text-muted-foreground py-8'>
                  Nenhuma tag encontrada
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='flex gap-2 flex-wrap'>
        <Button
          variant='outline'
          size='sm'
          onClick={loadLayers}
          disabled={isBusy}
          className='bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30'
        >
          <Download className='w-4 h-4 mr-2' />
          Trazer do Modelo
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={loadFromJson}
          className='bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30'
        >
          <FileJson className='w-4 h-4 mr-2' />
          Carregar JSON
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={saveToJson}
          className='bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30'
        >
          <Save className='w-4 h-4 mr-2' />
          Salvar JSON
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={importToModel}
          className='bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30'
        >
          <Upload className='w-4 h-4 mr-2' />
          Importar no Modelo
        </Button>
        <Button variant='destructive' size='sm' onClick={clearAll}>
          <Trash2 className='w-4 h-4 mr-2' />
          Limpar
        </Button>
      </div>
    </div>
  );
}
