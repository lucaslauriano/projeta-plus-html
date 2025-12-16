# SketchUp Context e Hooks

Sistema centralizado para comunicação com SketchUp API.

## Estrutura

### `SketchupContext.tsx`

Context principal que gerencia:

- Conexão com SketchUp API
- Estado de loading global
- Método genérico `callSketchupMethod`
- Handlers de resposta básicos

### Hooks Específicos

#### `useSectionAnnotation.ts`

Hook para anotações de corte:

```tsx
const { startSectionAnnotation, isLoading } = useSectionAnnotation();

// Uso
const handleClick = () => {
  startSectionAnnotation(); // Sem parâmetros
};
```

#### `useRoomAnnotation.ts`

Hook para anotações de ambiente:

```tsx
const { startRoomAnnotation, isLoading } = useRoomAnnotation();

// Uso
const handleSubmit = () => {
  startRoomAnnotation({
    enviroment_name: 'Sala',
    scale: 25.0,
    font: 'Arial',
    floor_height: '2.80',
    show_ceilling_height: true,
    ceilling_height: '2.80',
    show_level: true,
    is_auto_level: true,
    level_value: '0.00',
  });
};
```

## Como Usar

### 1. Provider já está configurado no `app/layout.tsx`

### 2. Usar hooks nos componentes:

```tsx
import { useSectionAnnotation } from '@/hooks/useSectionAnnotation';

function MyComponent() {
  const { startSectionAnnotation, isLoading, isAvailable } =
    useSectionAnnotation();

  return (
    <Button
      onClick={startSectionAnnotation}
      disabled={isLoading || !isAvailable}
    >
      {isLoading ? 'Carregando...' : 'Iniciar'}
    </Button>
  );
}
```

### 3. Criar novos hooks para outros módulos:

```tsx
// hooks/useMyModule.ts
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export function useMyModule() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();

  useEffect(() => {
    // Handler específico para este módulo
    window.handleMyModuleResult = (response) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    };

    return () => {
      if (window.handleMyModuleResult) {
        delete window.handleMyModuleResult;
      }
    };
  }, []);

  const startMyModule = async (args: MyModuleArgs) => {
    await callSketchupMethod('startMyModule', args);
  };

  return {
    startMyModule,
    isLoading,
    isAvailable,
  };
}
```

## Benefícios

- ✅ **Centralizado**: Uma única fonte de verdade para SketchUp API
- ✅ **Reutilizável**: Hooks específicos para cada módulo
- ✅ **Type-safe**: TypeScript em todos os níveis
- ✅ **Consistente**: Mesmo padrão para todos os módulos
- ✅ **Testável**: Context e hooks podem ser mockados facilmente
- ✅ **Performático**: Estado compartilhado, sem re-renders desnecessários
- ✅ **Manutenível**: Lógica isolada por responsabilidade
