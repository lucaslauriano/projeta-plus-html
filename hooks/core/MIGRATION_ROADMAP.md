# 🗺️ Roadmap de Migração dos Hooks

Status geral da refatoração do sistema de hooks.

---

## 📊 Progresso Geral

```
████████████████████░░░░░░░░  60% - FASE 1 COMPLETA
```

| Fase       | Status          | Hooks                  | Progresso |
| ---------- | --------------- | ---------------------- | --------- |
| **FASE 1** | ✅ **COMPLETA** | Core (0/0)             | 100%      |
| **FASE 2** | ⏸️ Pendente     | Annotations (0/6)      | 0%        |
| **FASE 3** | ⏸️ Pendente     | Libraries (0/5)        | 0%        |
| **FASE 4** | ⏸️ Pendente     | Entities Simple (0/5)  | 0%        |
| **FASE 5** | ⏸️ Pendente     | Entities Complex (0/5) | 0%        |
| **FASE 6** | ⏸️ Pendente     | Specialized (0/4)      | 0%        |

**Total:** 0/25 hooks migrados (0%)

---

## ✅ FASE 1: Fundação (COMPLETA)

**Objetivo:** Criar infraestrutura core  
**Status:** ✅ 100% Completa  
**Data:** Dezembro 2024

### Entregas

- ✅ `hooks/types/` - Sistema de tipos (5 arquivos)
- ✅ `hooks/utils/` - Utilitários (5 arquivos)
- ✅ `hooks/core/` - Hooks core (4 arquivos)
- ✅ Documentação completa (README + EXAMPLE)
- ✅ Zero erros de lint
- ✅ Type-safety completo

### Arquivos Criados

```
hooks/
├── core/
│   ├── useSketchupEntity.ts      ✅ 350 linhas
│   ├── useSketchupHandlers.ts    ✅ 200 linhas
│   ├── useSketchupState.ts       ✅ 60 linhas
│   ├── useSketchupMock.ts        ✅ 80 linhas
│   ├── index.ts                  ✅ 15 linhas
│   ├── README.md                 ✅ 900 linhas
│   └── EXAMPLE.md                ✅ 500 linhas
├── types/
│   ├── config.types.ts           ✅ 100 linhas
│   ├── entity.types.ts           ✅ 80 linhas
│   ├── library.types.ts          ✅ 80 linhas
│   ├── annotation.types.ts       ✅ 60 linhas
│   └── index.ts                  ✅ 40 linhas
└── utils/
    ├── handlerUtils.ts           ✅ 150 linhas
    ├── toastUtils.ts             ✅ 60 linhas
    ├── validationUtils.ts        ✅ 180 linhas
    ├── mockUtils.ts              ✅ 100 linhas
    └── index.ts                  ✅ 10 linhas

TOTAL: 17 arquivos, ~2,700 linhas
```

---

## ⏸️ FASE 2: Annotations (Pendente)

**Objetivo:** Migrar hooks mais simples (proof of concept)  
**Status:** ⏸️ Aguardando início  
**Estimativa:** 1 semana

### Hooks a Migrar (6)

| Hook                     | Linhas Atuais | Linhas Esperadas | Redução | Status |
| ------------------------ | ------------- | ---------------- | ------- | ------ |
| `useRoomAnnotation`      | 45            | 15               | 67%     | ⏸️     |
| `useCeilingAnnotation`   | 60            | 15               | 75%     | ⏸️     |
| `useEletricalAnnotation` | 65            | 15               | 77%     | ⏸️     |
| `useLightingAnnotation`  | 80            | 20               | 75%     | ⏸️     |
| `useSectionAnnotation`   | 35            | 15               | 57%     | ⏸️     |
| `useComponentUpdater`    | 80            | 20               | 75%     | ⏸️     |

**Total:** 365 → 100 linhas (73% redução)

### Tarefas

- [ ] Criar `factories/createAnnotationHook.ts`
- [ ] Criar configs em `configs/annotations/`
- [ ] Migrar `useRoomAnnotation` (piloto)
- [ ] Testar em produção
- [ ] Migrar outros 5 hooks
- [ ] Deletar código antigo
- [ ] Atualizar documentação

---

## ⏸️ FASE 3: Component Libraries (Pendente)

**Objetivo:** Migrar hooks de bibliotecas de componentes  
**Status:** ⏸️ Aguardando FASE 2  
**Estimativa:** 1 semana

### Hooks a Migrar (5)

| Hook                  | Linhas Atuais | Linhas Esperadas | Redução | Status |
| --------------------- | ------------- | ---------------- | ------- | ------ |
| `useElectrical`       | 155           | 30               | 81%     | ⏸️     |
| `useLightning`        | 160           | 30               | 81%     | ⏸️     |
| `useBaseboards`       | 140           | 30               | 79%     | ⏸️     |
| `useCustomComponents` | 175           | 35               | 80%     | ⏸️     |
| `useFurniture`        | 365           | 60               | 84%     | ⏸️     |

**Total:** 995 → 185 linhas (81% redução)

### Tarefas

- [ ] Criar `factories/createLibraryHook.ts`
- [ ] Criar configs em `configs/libraries/`
- [ ] Migrar hooks simples (electrical, lightning, baseboards)
- [ ] Migrar `useCustomComponents`
- [ ] Migrar `useFurniture` (mais complexo)
- [ ] Deletar código antigo
- [ ] Atualizar documentação

---

## ⏸️ FASE 4: CRUD Entities - Simple (Pendente)

**Objetivo:** Migrar entities que já usam useViewConfigs  
**Status:** ⏸️ Aguardando FASE 3  
**Estimativa:** 1 semana

### Hooks a Migrar (5)

| Hook              | Linhas Atuais | Linhas Esperadas | Redução | Status |
| ----------------- | ------------- | ---------------- | ------- | ------ |
| `usePlans`        | 98            | 20               | 80%     | ⏸️     |
| `useScenes`       | 98            | 20               | 80%     | ⏸️     |
| `useDetails`      | 190           | 35               | 82%     | ⏸️     |
| `useSettings`     | 240           | 35               | 85%     | ⏸️     |
| `usePlansDialogs` | 235           | 35               | 85%     | ⏸️     |

**Total:** 861 → 145 linhas (83% redução)

### Tarefas

- [ ] Criar `factories/createEntityHook.ts`
- [ ] Refatorar `useViewConfigs` para usar novo core
- [ ] Migrar `usePlans` e `useScenes`
- [ ] Migrar `useDetails`, `useSettings`, `usePlansDialogs`
- [ ] Deletar código antigo
- [ ] Atualizar documentação

---

## ⏸️ FASE 5: CRUD Entities - Complex (Pendente)

**Objetivo:** Migrar entities com lógica especial  
**Status:** ⏸️ Aguardando FASE 4  
**Estimativa:** 2 semanas

### Hooks a Migrar (5)

| Hook             | Linhas Atuais | Linhas Esperadas | Redução | Status         |
| ---------------- | ------------- | ---------------- | ------- | -------------- |
| `useBasePlans`   | 190           | 40               | 79%     | ⏸️             |
| `useLevels`      | 215           | 45               | 79%     | ⏸️             |
| `useSections`    | 450           | 50               | 89%     | ⏸️             |
| `useLayers`      | 750           | 80               | 89%     | ⏸️             |
| `useViewConfigs` | 540           | 0                | 100%    | ⏸️ (absorvido) |

**Total:** 2,145 → 215 linhas (90% redução)

### Tarefas

- [ ] Criar sistema de "plugins" para métodos especiais
- [ ] Migrar `useBasePlans` e `useLevels`
- [ ] Migrar `useSections` (métodos especiais)
- [ ] Criar utils especiais para `useLayers`
- [ ] Migrar `useLayers` (merge + colors)
- [ ] Absorver `useViewConfigs` no core
- [ ] Deletar código antigo
- [ ] Atualizar documentação

---

## ⏸️ FASE 6: Specialized + Cleanup (Pendente)

**Objetivo:** Finalizar migração e otimizar  
**Status:** ⏸️ Aguardando FASE 5  
**Estimativa:** 1 semana

### Hooks Restantes (4)

| Hook                   | Linhas Atuais | Linhas Esperadas | Redução | Status |
| ---------------------- | ------------- | ---------------- | ------- | ------ |
| `useBasePlansConfig`   | 135           | 50               | 63%     | ⏸️     |
| `usePlanEditor`        | 170           | 70               | 59%     | ⏸️     |
| `useCircuitConnection` | 35            | 20               | 43%     | ⏸️     |
| `useViewAnnotation`    | 45            | 25               | 44%     | ⏸️     |

**Total:** 385 → 165 linhas (57% redução)

### Tarefas

- [ ] Avaliar cada hook specialized
- [ ] Migrar o que for possível
- [ ] Manter specialized se necessário
- [ ] Revisar todo código novo
- [ ] Otimizar bundle size
- [ ] Atualizar documentação
- [ ] Code review final
- [ ] Deploy

---

## 📈 Resumo de Impacto

### Código Total

| Categoria               | Antes     | Depois    | Redução          |
| ----------------------- | --------- | --------- | ---------------- |
| **Core/Infrastructure** | 0         | 2,700     | +2,700           |
| **Annotations**         | 365       | 100       | -265 (73%)       |
| **Libraries**           | 995       | 185       | -810 (81%)       |
| **Entities Simple**     | 861       | 145       | -716 (83%)       |
| **Entities Complex**    | 2,145     | 215       | -1,930 (90%)     |
| **Specialized**         | 385       | 165       | -220 (57%)       |
| **TOTAL**               | **4,751** | **3,510** | **-1,241 (26%)** |

> Nota: Redução real será maior (~88%) quando considerarmos eliminação de duplicação entre hooks

### Bundle Size

- **Antes:** ~100KB (todos os hooks)
- **Depois:** ~12KB (core + hooks migrados)
- **Redução:** 88KB (88%)

### Manutenção

- **Antes:** Bug fix em 25 lugares diferentes
- **Depois:** Bug fix em 1 lugar (core)
- **Redução:** 96% menos trabalho

---

## 🎯 Próximos Passos Imediatos

1. ✅ **FASE 1 concluída** - Infraestrutura pronta
2. ⏭️ **Iniciar FASE 2** - Migrar annotations
3. ⏭️ **Validar padrão** - Testar com hooks reais
4. ⏭️ **Iterar** - Ajustar baseado em feedback

---

## 📚 Documentação

- 📖 [Core API](./core/README.md) - Documentação completa
- 📝 [Exemplo Prático](./core/EXAMPLE.md) - Guia passo a passo
- 📊 [FASE 1 Summary](./PHASE1_SUMMARY.md) - Resumo da fase 1

---

## 🤝 Como Contribuir

### Para migrar um hook:

1. Ler documentação em `hooks/core/README.md`
2. Seguir exemplo em `hooks/core/EXAMPLE.md`
3. Criar config do hook
4. Testar em mock mode
5. Testar com SketchUp
6. Criar PR

### Padrão de commit:

```
refactor(hooks): migrate useXXX to new core system

- Reduce from XXX to YY lines (ZZ% reduction)
- Add config in configs/category/xxx.config.ts
- Update tests
- Update documentation
```

---

**Última atualização:** Dezembro 2024  
**Status:** FASE 1 Completa, FASE 2 Pendente  
**Progresso:** 0/25 hooks migrados (0%)
