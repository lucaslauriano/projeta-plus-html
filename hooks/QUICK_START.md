# 🚀 Quick Start Guide

Guia rápido para começar a usar o novo sistema de hooks.

---

## ⚡ TL;DR

```typescript
// Antes (450 linhas)
export function useSections() {
  const [data, setData] = useState({ sections: [] });
  const [isBusy, setIsBusy] = useState(false);
  // ... 400+ linhas de boilerplate
}

// Depois (40 linhas)
export function useSections() {
  return useSketchupEntity({
    entityName: 'sections',
    initialData: { sections: [] },
    methods: { get: 'getSections', add: 'addSection' },
    handlers: { onGet: (result, { setData }) => setData(result) },
    mockData: {
      sections: [
        /* ... */
      ],
    },
  });
}
```

**Redução: 91%** 🎉

---

## 📦 O que foi criado?

```
hooks/
├── core/              ✅ Hooks principais
│   ├── useSketchupEntity.ts
│   ├── useSketchupHandlers.ts
│   ├── useSketchupState.ts
│   └── useSketchupMock.ts
├── types/             ✅ Tipos TypeScript
│   ├── config.types.ts
│   ├── entity.types.ts
│   └── ...
└── utils/             ✅ Utilitários
    ├── handlerUtils.ts
    ├── validationUtils.ts
    └── ...
```

---

## 🎯 Criar um Hook em 5 Minutos

### 1. Importar

```typescript
import { useSketchupEntity } from './core';
```

### 2. Configurar

```typescript
export function useSections() {
  return useSketchupEntity({
    // Nome da entidade
    entityName: 'sections',

    // Dados iniciais
    initialData: { sections: [] },

    // Métodos Ruby
    methods: {
      get: 'getSections',
      add: 'addSection',
      delete: 'deleteSection',
    },

    // Handlers
    handlers: {
      onGet: (result, { setData }) => {
        setData({ sections: result.sections });
      },
    },

    // Mock data
    mockData: {
      sections: [{ id: '1', name: 'Test' }],
    },
  });
}
```

### 3. Usar

```typescript
function MyComponent() {
  const { data, isBusy, addItem, deleteItem } = useSections();

  return (
    <div>
      {data.sections.map((section) => (
        <div key={section.id}>
          {section.name}
          <button onClick={() => deleteItem(section.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

**Pronto!** ✅

---

## 🎨 Recursos Principais

### ✅ CRUD Automático

```typescript
const {
  getItems, // Buscar todos
  addItem, // Adicionar
  updateItem, // Atualizar
  deleteItem, // Remover
} = useSketchupEntity({
  /* config */
});
```

### ✅ JSON Persistence

```typescript
const {
  saveToJson, // Salvar em JSON
  loadFromJson, // Carregar de JSON
  loadDefault, // Carregar padrão
  loadFromFile, // Carregar de arquivo
} = useSketchupEntity({
  /* config */
});
```

### ✅ Estado Gerenciado

```typescript
const {
  data, // Dados da entidade
  isBusy, // Operação em andamento?
  isLoading, // Carregando?
  isAvailable, // SketchUp disponível?
} = useSketchupEntity({
  /* config */
});
```

### ✅ Mock Mode Automático

```typescript
// Funciona automaticamente sem SketchUp!
mockData: {
  sections: [
    { id: '1', name: 'Mock Section' }
  ],
}
```

### ✅ Métodos Customizados

```typescript
customMethods: {
  createStandard: {
    rubyMethod: 'createStandardSections',
    successMessage: 'Criado!',
    reloadAfter: true,
  },
}

// Uso
const { createStandard } = useSections();
await createStandard();
```

### ✅ Validações Built-in

```typescript
import { validateRequired, validateCoordinates } from './utils';

validators: {
  name: (v) => validateRequired(v, 'Nome'),
  position: (v) => validateCoordinates(v),
}
```

---

## 📖 Documentação Completa

### Para Iniciantes

1. 📝 **[EXAMPLE.md](./core/EXAMPLE.md)** - Tutorial passo a passo
2. 🗺️ **[MIGRATION_ROADMAP.md](./MIGRATION_ROADMAP.md)** - Status da migração

### Para Avançados

1. 📚 **[README.md](./core/README.md)** - API completa
2. 📊 **[PHASE1_SUMMARY.md](./PHASE1_SUMMARY.md)** - Detalhes técnicos

---

## 🔥 Exemplos Rápidos

### Exemplo 1: Hook Simples (CRUD)

```typescript
export function useNotes() {
  return useSketchupEntity({
    entityName: 'notes',
    initialData: { notes: [] },
    methods: {
      get: 'getNotes',
      add: 'addNote',
      delete: 'deleteNote',
    },
    handlers: {
      onGet: (result, { setData }) => {
        setData({ notes: result.notes });
      },
    },
  });
}
```

### Exemplo 2: Com Validação

```typescript
import { validateRequired } from './utils';

export function useTags() {
  return useSketchupEntity({
    entityName: 'tags',
    initialData: { tags: [] },
    methods: { get: 'getTags', add: 'addTag' },
    handlers: {
      onGet: (r, { setData }) => setData({ tags: r.tags }),
    },
    validators: {
      name: (v) => validateRequired(v, 'Nome da tag'),
    },
  });
}
```

### Exemplo 3: Com Métodos Customizados

```typescript
export function useLayers() {
  return useSketchupEntity({
    entityName: 'layers',
    initialData: { layers: [] },
    methods: { get: 'getLayers' },
    handlers: {
      onGet: (r, { setData }) => setData({ layers: r.layers }),
    },
    customMethods: {
      toggleVisibility: {
        rubyMethod: 'toggleLayerVisibility',
        params: ['layerName', 'visible'],
        successMessage: 'Visibilidade alterada!',
      },
      importFromFile: {
        rubyMethod: 'importLayersFromFile',
        successMessage: (r) => `${r.count} layers importadas!`,
        reloadAfter: true,
      },
    },
  });
}

// Uso
const { toggleVisibility, importFromFile } = useLayers();
await toggleVisibility('Layer1', false);
await importFromFile();
```

---

## 🐛 Troubleshooting

### Handler não funciona?

```typescript
// ❌ Errado - nome do handler incorreto
handlers: {
  onGetData: (result, ctx) => {
    /* ... */
  };
}

// ✅ Correto - use nomes padrão
handlers: {
  onGet: (result, ctx) => {
    /* ... */
  };
}
```

### Mock mode não ativa?

```typescript
// Certifique-se de adicionar mockData
mockData: {
  sections: [{ id: '1', name: 'Test' }],
}
```

### Type errors?

```typescript
// Sempre tipar o resultado
onGet: (result, { setData }) => {
  setData({ sections: result.sections as Section[] });
};
```

---

## ⚡ Performance Tips

### ✅ Bom

```typescript
handlers: {
  onGet: (result, { setData }) => {
    // Leve, apenas atualiza dados
    setData({ sections: result.sections });
  },
}
```

### ❌ Evitar

```typescript
handlers: {
  onGet: (result, { setData }) => {
    // Processamento pesado no handler
    const processed = heavyProcessing(result.sections);
    setData({ sections: processed });
  },
}
```

**Dica:** Deixe processamento pesado para `useMemo` no componente.

---

## 🎓 Próximos Passos

1. ✅ Ler [EXAMPLE.md](./core/EXAMPLE.md)
2. ✅ Criar seu primeiro hook
3. ✅ Testar em mock mode
4. ✅ Testar com SketchUp
5. ✅ Migrar hooks existentes

---

## 💬 Suporte

**Dúvidas?**

- 📖 Ver [documentação completa](./core/README.md)
- 📝 Ver [exemplo prático](./core/EXAMPLE.md)
- 🗺️ Ver [roadmap](./MIGRATION_ROADMAP.md)

---

## 🎉 Benefícios

- ✅ **88% menos código**
- ✅ **Type-safe**
- ✅ **Mock mode automático**
- ✅ **Validações built-in**
- ✅ **Handlers padronizados**
- ✅ **Zero boilerplate**
- ✅ **Fácil manutenção**

---

**Versão:** 1.0.0  
**Status:** ✅ Pronto para uso  
**Última atualização:** Dezembro 2024

---

**Comece agora!** 🚀
