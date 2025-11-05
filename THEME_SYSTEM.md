# Sistema de Temas - Projeta Plus

## Visão Geral

O Projeta Plus agora usa o **Material Theme Builder** com suporte completo a 6 esquemas de cores:

### Temas Claros (Light)
- **Light (Padrão)** - Contraste padrão para uso diário
- **Light Medium Contrast** - Melhor legibilidade com contraste moderado
- **Light High Contrast** - Máximo contraste para acessibilidade

### Temas Escuros (Dark)
- **Dark (Padrão)** - Contraste padrão para ambientes com pouca luz
- **Dark Medium Contrast** - Melhor legibilidade no modo escuro
- **Dark High Contrast** - Máximo contraste no modo escuro

## Como Usar

### 1. Alternar Tema (Claro/Escuro)

Use o botão de alternância na sidebar ou vá para **Configurações de Usuário**.

### 2. Ajustar Nível de Contraste

1. Navegue até **Dashboard > Configurações**
2. Na seção "Aparência", selecione o nível de contraste desejado:
   - **Padrão**: Cores equilibradas para uso geral
   - **Médio**: Contraste aumentado para melhor legibilidade
   - **Alto**: Máximo contraste para acessibilidade

### 3. Programaticamente

#### Alternar Contraste

```tsx
import { useContrast } from '@/contexts/ContrastContext';

function MyComponent() {
  const { contrast, setContrast } = useContrast();
  
  // Alterar contraste
  setContrast('high'); // 'default' | 'medium' | 'high'
}
```

#### Alternar Tema

```tsx
import { useTheme } from 'next-themes';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  // Alterar tema
  setTheme('dark'); // 'light' | 'dark' | 'system'
}
```

## Estrutura Técnica

### Arquivos Principais

- **`app/globals.css`**: Define todas as 6 variações de cores do Material Theme Builder
- **`contexts/ContrastContext.tsx`**: Gerencia o estado do nível de contraste
- **`components/ui/theme-selector.tsx`**: Componente UI para seleção de tema e contraste

### Como Funciona

1. O `ThemeProvider` (next-themes) gerencia o modo claro/escuro
2. O `ContrastProvider` gerencia o nível de contraste
3. As classes CSS são aplicadas dinamicamente no elemento `<html>`:
   - `light` → Tema claro padrão
   - `light-medium-contrast` → Tema claro com contraste médio
   - `light-high-contrast` → Tema claro com alto contraste
   - `dark` → Tema escuro padrão
   - `dark-medium-contrast` → Tema escuro com contraste médio
   - `dark-high-contrast` → Tema escuro com alto contraste

### Persistência

- O tema (claro/escuro) é salvo automaticamente pelo `next-themes`
- O nível de contraste é salvo no `localStorage` como `projeta-plus-contrast`

## Cores Material Theme Builder

Todas as cores foram importadas do **Material Theme Builder** com base na cor primária `#CCFF00` (verde-limão).

### Paleta de Cores

#### Primary (Verde)
- Light: `#546524`
- Dark: `#BBCF81`

#### Secondary (Verde-Oliva)
- Light: `#5B6146`
- Dark: `#C3CAA9`

#### Tertiary (Verde-Água)
- Light: `#3A665E`
- Dark: `#A1D0C6`

#### Backgrounds
- Light: `#FBFAED`
- Dark: `#13140D`

## Acessibilidade

Os níveis de contraste foram projetados para atender aos padrões WCAG:

- **Padrão**: Conformidade WCAG AA
- **Médio**: Conformidade WCAG AA aprimorada
- **Alto**: Conformidade WCAG AAA para máxima acessibilidade

## Personalização

Para adicionar novos temas ou modificar cores, edite:

1. **`app/globals.css`**: Adicione/modifique as variáveis CSS
2. **`contexts/ContrastContext.tsx`**: Adicione novos níveis de contraste ao tipo `ContrastLevel`
3. **`components/ui/theme-selector.tsx`**: Adicione novas opções na UI

---

**Última Atualização**: Novembro 2025

