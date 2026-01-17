# Configuração da YouTube Data API v3

Este documento explica como configurar a integração automática com a API do YouTube para buscar informações dos vídeos (título, descrição, duração, thumbnail).

## 📋 Passo a Passo

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em **"Select a project"** → **"New Project"**
3. Dê um nome ao projeto (ex: "Projeta Plus Videos")
4. Clique em **"Create"**

### 2. Habilitar a YouTube Data API v3

1. No menu lateral, vá em **"APIs & Services"** → **"Library"**
2. Busque por **"YouTube Data API v3"**
3. Clique na API e depois em **"Enable"**

### 3. Criar Credenciais (API Key)

1. Vá em **"APIs & Services"** → **"Credentials"**
2. Clique em **"+ CREATE CREDENTIALS"** → **"API key"**
3. Uma API Key será gerada (copie ela)
4. **Recomendado:** Clique em **"Edit API key"** para restringir o uso:
   - **Application restrictions**: HTTP referrers (websites)
   - Adicione seu domínio: `*.seu-dominio.com/*`
   - **API restrictions**: Restrict key → Selecione **YouTube Data API v3**
5. Clique em **"Save"**

### 4. Configurar no Projeto

1. Crie um arquivo `.env.local` na raiz do projeto (se não existir)
2. Adicione sua API Key:

```bash
NEXT_PUBLIC_YOUTUBE_API_KEY=SUA_API_KEY_AQUI
```

### 5. Adicionar IDs dos Vídeos

Edite o arquivo `app/dashboard/page.tsx` e atualize o array `VIDEO_IDS`:

```typescript
const VIDEO_IDS = [
  'u5buz0H6wgk', // Substitua pelo ID real do seu vídeo
  'T02gKBoOH-k', // ID do segundo vídeo
  'abc123xyz',   // ID do terceiro vídeo
  // ... adicione mais vídeos
];
```

**Como encontrar o ID do vídeo:**
- URL: `https://www.youtube.com/watch?v=u5buz0H6wgk`
- ID: `u5buz0H6wgk` (parte depois do `v=`)

## 🔄 Como Funciona

O sistema busca automaticamente da API do YouTube:
- ✅ **Título** do vídeo
- ✅ **Descrição** completa
- ✅ **Thumbnail** em alta qualidade (maxres → high → medium)
- ✅ **Duração** formatada (ex: 12:34)
- ✅ **Data de publicação** relativa (ex: "Há 2 dias")

### Sem API Key Configurada

Se não configurar a API key, o sistema:
- Mostra título genérico: "Título do vídeo não disponível"
- Exibe mensagem para configurar: "Configure NEXT_PUBLIC_YOUTUBE_API_KEY"
- **Thumbnail ainda funciona** (via URL direta do YouTube)

## 📊 Limites e Custos

**Limites da API (Gratuito):**
- 10.000 unidades/dia (quota)
- Cada busca de vídeo = 1 unidade
- Para 5 vídeos = 5 unidades por requisição
- Com cache de 1 hora, você pode ter milhares de pageviews sem problemas

**Quota Calculation:**
- 10.000 unidades/dia ÷ 5 vídeos = 2.000 carregamentos/dia
- Com cache de 1h = até 48.000 carregamentos/dia

**100% GRATUITO** para a maioria dos casos de uso!

## 🎨 Recursos Implementados

- ⚡ **Cache automático** de 1 hora (revalidate: 3600)
- 🎯 **Loading skeleton** enquanto busca os dados
- 🖱️ **Click no card** abre o vídeo no YouTube em nova aba
- 📱 **Totalmente responsivo** com scroll horizontal suave
- 🔄 **Fallback inteligente** se a API falhar

## 🔧 Troubleshooting

### Erro 403: API key not valid
- Verifique se a API key está correta no `.env.local`
- Confirme que a YouTube Data API v3 está habilitada

### Thumbnail não carrega
- Verifique se o ID do vídeo está correto
- Adicione o domínio `img.youtube.com` ao `next.config.ts` (já configurado)

### Vídeos não aparecem
- Abra o Console do navegador (F12) e veja se há erros
- Verifique se o `.env.local` está na raiz do projeto
- Reinicie o servidor Next.js após criar/editar `.env.local`

## 📝 Exemplo de Resposta da API

```json
{
  "id": "u5buz0H6wgk",
  "title": "PLUGIN SKETCHUP INTELIGENTE - Apresentação Geral",
  "description": "Esse plugin é parte do meu processo real...",
  "thumbnail": "https://i.ytimg.com/vi/u5buz0H6wgk/maxresdefault.jpg",
  "duration": "12:34",
  "publishedAt": "Há 2 dias"
}
```

## 🚀 Deploy em Produção

Não esqueça de adicionar a variável de ambiente no seu serviço de deploy:

**Vercel:**
1. Vá em Project Settings → Environment Variables
2. Adicione: `NEXT_PUBLIC_YOUTUBE_API_KEY` = sua_api_key

**Outras plataformas:** Siga o mesmo processo

---

💡 **Dica:** Para desenvolvimento, você pode usar a mesma API key. Para produção, crie uma API key separada com restrições de domínio.

