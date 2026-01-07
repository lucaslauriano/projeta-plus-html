# Exemplo Prático: Criando um Hook com useSketchupEntity

Este guia mostra passo a passo como criar um hook usando o novo sistema core.

## Cenário

Vamos criar um hook `useSections` para gerenciar seções (section planes) do SketchUp.

### Requisitos

- CRUD básico (get, add, update, delete)
- Persistência JSON (save, load)
- Métodos especiais:
  - `createStandard()` - Cria secoes padrões (A, B, C, D)
  - `createAutoViews(environmentName)` - Cria vistas automáticas para um ambiente
  - `createIndividual(directionType, name)` - Cria corte individual

---

## Passo 1: Definir os Tipos

```typescript
// hooks/types/entity.types.ts (adicionar)

export interface Section extends BaseEntity {
  position: [number, number, number];
  direction: [number, number, number];
  active: boolean;
}

export interface SectionsData {
  sections: Section[];
}

interface SectionsMethods {
  get: string;
  add: string;
  update: string;
  delete: string;
  saveToJson: string;
  loadFromJson: string;
  loadDefault: string;
  loadFromFile: string;
  import: string;
}
```

---

## Passo 2: Criar o Hook

```typescript
// hooks/useSections.ts

import { useSketchupEntity } from './core';
import type { Section, SectionsData } from './types';

export function useSections() {
  return useSketchupEntity<SectionsData, SectionsMethods>({
    // 1. Identificação
    entityName: 'sections',
    entityNameSingular: 'section',

    // 2. Estado inicial
    initialData: { sections: [] },

    // 3. Métodos Ruby (mapeamento)
    methods: {
      get: 'getSections',
      add: 'addSection',
      update: 'updateSection',
      delete: 'deleteSection',
      saveToJson: 'saveSectionsToJson',
      loadFromJson: 'loadSectionsFromJson',
      loadDefault: 'loadDefaultSections',
      loadFromFile: 'loadSectionsFromFile',
      import: 'importSectionsToModel',
    },

    // 4. Handlers (callbacks do Ruby)
    handlers: {
      // Handler GET - atualiza dados
      onGet: (result, { setData }) => {
        if (result.sections) {
          setData({ sections: result.sections as Section[] });
        }
      },

      // Handler LOAD - atualiza dados do JSON
      onLoadFromJson: (result, { setData }) => {
        if (result.data?.sections) {
          setData(result.data as SectionsData);
        }
      },

      // Outros handlers usam comportamento padrão
      // (toast automático + reload)
    },

    // 5. Métodos customizados
    customMethods: {
      // Método simples sem parâmetros
      createStandard: {
        rubyMethod: 'createStandardSections',
        successMessage: 'Seções gerais (A, B, C, D) criados!',
        reloadAfter: true,
      },

      // Método com parâmetros e validação
      createAutoViews: {
        rubyMethod: 'createAutoViews',
        params: ['environmentName'],
        validate: (params) => {
          if (
            !params.environmentName ||
            String(params.environmentName).trim() === ''
          ) {
            return 'Nome do ambiente é obrigatório';
          }
        },
        successMessage: (result) =>
          `Vistas automáticas criadas: ${(result as any).count || 4}`,
        reloadAfter: true,
      },

      // Método com múltiplos parâmetros
      createIndividual: {
        rubyMethod: 'createIndividualSection',
        params: ['directionType', 'name'],
        validate: (params) => {
          if (!params.name) return 'Nome é obrigatório';
          if (!params.directionType) return 'Tipo de direção é obrigatório';
        },
        successMessage: 'Seção individual criado!',
        reloadAfter: true,
      },
    },

    // 6. Dados mock para desenvolvimento
    mockData: {
      sections: [
        {
          id: 'A',
          name: 'A',
          position: [0, 40, 0],
          direction: [0, 1, 0],
          active: true,
        },
        {
          id: 'B',
          name: 'B',
          position: [40, 0, 0],
          direction: [1, 0, 0],
          active: false,
        },
      ],
    },
  });
}
```

---

## Passo 3: Usar no Componente

```typescript
// app/dashboard/sections/page.tsx

'use client';

import { useSections } from '@/hooks/useSections';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function SectionsPage() {
  const {
    // Estado
    data,
    isBusy,
    isLoading,
    isAvailable,

    // CRUD
    addItem,
    deleteItem,

    // Métodos customizados
    createStandard,
    createAutoViews,
    createIndividual,

    // JSON
    saveToJson,
    loadFromJson,
    loadDefault,
  } = useSections();

  const [environmentName, setEnvironmentName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Gerenciar Seções</h1>

      {/* Loading indicator */}
      {isLoading && (
        <div className='text-sm text-muted-foreground'>Carregando...</div>
      )}

      {/* Modo simulação */}
      {!isAvailable && (
        <div className='bg-yellow-100 p-3 rounded'>
          Modo simulação (SketchUp não disponível)
        </div>
      )}

      {/* Ações rápidas */}
      <div className='space-y-2'>
        <h2 className='font-semibold'>Ações Rápidas</h2>
        <div className='flex gap-2'>
          <Button onClick={createStandard} disabled={isBusy}>
            Criar Seções Gerais (A, B, C, D)
          </Button>

          <Button onClick={loadDefault} disabled={isBusy} variant='outline'>
            Carregar Padrão
          </Button>
        </div>
      </div>

      {/* Vistas automáticas */}
      <div className='space-y-2'>
        <h2 className='font-semibold'>Vistas Automáticas</h2>
        <div className='flex gap-2'>
          <Input
            placeholder='Nome do ambiente (ex: sala)'
            value={environmentName}
            onChange={(e) => setEnvironmentName(e.target.value)}
          />
          <Button
            onClick={() => createAutoViews(environmentName)}
            disabled={isBusy || !environmentName}
          >
            Criar Vistas
          </Button>
        </div>
      </div>

      {/* Adicionar seção */}
      <div className='space-y-2'>
        <h2 className='font-semibold'>Adicionar Seção</h2>
        <div className='flex gap-2'>
          <Input
            placeholder='Nome da seção'
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
          />
          <Button
            onClick={() =>
              addItem({
                name: newSectionName,
                position: [0, 0, 0],
                direction: [0, 1, 0],
              })
            }
            disabled={isBusy || !newSectionName}
          >
            Adicionar
          </Button>
        </div>
      </div>

      {/* Lista de seções */}
      <div className='space-y-2'>
        <h2 className='font-semibold'>Seções ({data.sections.length})</h2>
        <div className='space-y-2'>
          {data.sections.map((section) => (
            <div
              key={section.id}
              className='flex items-center justify-between p-3 border rounded'
            >
              <div>
                <div className='font-medium'>{section.name}</div>
                <div className='text-sm text-muted-foreground'>
                  Position: {section.position.join(', ')}
                </div>
              </div>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => deleteItem(section.name)}
                disabled={isBusy}
              >
                Remover
              </Button>
            </div>
          ))}

          {data.sections.length === 0 && (
            <div className='text-center py-8 text-muted-foreground'>
              Nenhuma seção criada
            </div>
          )}
        </div>
      </div>

      {/* JSON actions */}
      <div className='flex gap-2 pt-4 border-t'>
        <Button onClick={saveToJson} disabled={isBusy} variant='outline'>
          Salvar JSON
        </Button>
        <Button onClick={loadFromJson} disabled={isBusy} variant='outline'>
          Carregar JSON
        </Button>
      </div>
    </div>
  );
}
```

---

## Passo 4: Testar

### Teste 1: Modo Mock (sem SketchUp)

```bash
npm run dev
```

Abra o navegador e teste:

- ✅ Deve mostrar "Modo simulação"
- ✅ Deve mostrar 2 seções mock (A e B)
- ✅ Botões devem funcionar com toast "modo simulação"
- ✅ Loading states devem aparecer

### Teste 2: Com SketchUp

1. Abra o SketchUp
2. Carregue o plugin
3. Abra a interface
4. Teste cada funcionalidade:
   - ✅ Criar seções padrões
   - ✅ Criar vistas automáticas
   - ✅ Adicionar seção individual
   - ✅ Remover seção
   - ✅ Salvar/carregar JSON

---

## Comparação: Antes vs Depois

### Antes (código antigo - 450 linhas)

```typescript
export function useSections() {
  const { callSketchupMethod, isAvailable } = useSketchup();
  const [data, setData] = useState<SectionsData>({ sections: [] });
  const [isBusy, setIsBusy] = useState(false);

  // 200 linhas de handlers
  useEffect(() => {
    window.handleGetSectionsResult = (result) => {
      setIsBusy(false);
      if (result.success && result.sections) {
        setData({ sections: result.sections });
      } else {
        toast.error(result.message || 'Erro ao carregar seções');
      }
    };

    window.handleAddSectionResult = (result) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(result.message);
        getSections();
      } else {
        toast.error(result.message);
      }
    };

    // ... mais 10 handlers

    return () => {
      delete window.handleGetSectionsResult;
      delete window.handleAddSectionResult;
      // ... cleanup de 12 handlers
    };
  }, []);

  // 250 linhas de métodos
  const getSections = useCallback(() => {
    if (!isAvailable) {
      setData({
        sections: [
          /* mock */
        ],
      });
      return;
    }
    setIsBusy(true);
    callSketchupMethod('getSections');
  }, [callSketchupMethod, isAvailable]);

  const addSection = useCallback(
    async (params) => {
      if (!params.name || params.name.trim() === '') {
        toast.error('Nome da seção é obrigatório');
        return false;
      }
      if (!isAvailable) {
        toast.info('Seção adicionada (modo simulação)');
        return true;
      }
      setIsBusy(true);
      callSketchupMethod('addSection', params);
      return true;
    },
    [callSketchupMethod, isAvailable]
  );

  // ... mais 10 métodos

  useEffect(() => {
    getSections();
  }, []);

  return {
    data,
    isBusy,
    isAvailable,
    getSections,
    addSection,
    // ... 12 métodos
  };
}
```

### Depois (novo sistema - 80 linhas)

```typescript
export function useSections() {
  return useSketchupEntity<SectionsData, SectionsMethods>({
    entityName: 'sections',
    entityNameSingular: 'section',
    initialData: { sections: [] },

    methods: {
      get: 'getSections',
      add: 'addSection',
      // ... 7 métodos
    },

    handlers: {
      onGet: (result, { setData }) => {
        if (result.sections) setData({ sections: result.sections });
      },
      // ... 2 handlers customizados
    },

    customMethods: {
      createStandard: {
        rubyMethod: 'createStandardSections',
        successMessage: 'Seções criados!',
        reloadAfter: true,
      },
      // ... 2 métodos customizados
    },

    mockData: {
      sections: [
        /* mock */
      ],
    },
  });
}
```

### Redução

- **450 → 80 linhas** (82% redução)
- **12 handlers → 2 handlers** (83% redução)
- **15 métodos → config declarativa** (100% menos boilerplate)
- **Type-safety completo** ✅
- **Mock mode automático** ✅
- **Validações built-in** ✅

---

## Próximos Passos

1. ✅ Hook criado e funcionando
2. ⏭️ Testar extensivamente
3. ⏭️ Migrar outros hooks similares
4. ⏭️ Criar factories para padrões comuns
5. ⏭️ Documentar padrões específicos

---

## Dicas

### Performance

```typescript
// ❌ Evitar
handlers: {
  onGet: (result, { setData }) => {
    // Processamento pesado aqui
    const processed = heavyProcessing(result.sections);
    setData({ sections: processed });
  },
}

// ✅ Melhor
handlers: {
  onGet: (result, { setData }) => {
    // Processamento leve, deixar o pesado para useMemo no componente
    setData({ sections: result.sections });
  },
}
```

### Debugging

```typescript
handlers: {
  onGet: (result, ctx) => {
    console.log('GET result:', result);
    console.log('Context:', ctx);
    // ...
  },
}
```

### Type Safety

```typescript
// ✅ Sempre tipar result
onGet: (result, { setData }) => {
  if (result.sections) {
    setData({ sections: result.sections as Section[] });
  }
},
```

---

**Exemplo completo funcionando!** 🎉
