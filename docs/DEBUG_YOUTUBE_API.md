# 🐛 Debug YouTube API - Guia Rápido

## 🔍 O que foi corrigido agora:

Reescrevi a integração para usar uma **API Route** (servidor) ao invés de chamar direto do cliente. Isso resolve:
- ✅ Problemas de CORS
- ✅ Cache mais eficiente
- ✅ API Key mais segura
- ✅ Logs detalhados no servidor

## 📝 Checklist de Debug

### 1️⃣ Verifique se o arquivo `.env.local` existe

```bash
# Na raiz do projeto
ls -la .env.local
```

Se não existir, crie:
```bash
touch .env.local
```

### 2️⃣ Verifique o conteúdo do `.env.local`

Deve conter:
```bash
NEXT_PUBLIC_YOUTUBE_API_KEY=SUA_CHAVE_AQUI
```

⚠️ **IMPORTANTE:** 
- Não pode ter espaços antes ou depois do `=`
- Não pode ter aspas ao redor da chave
- Deve começar com `NEXT_PUBLIC_` para funcionar no cliente

### 3️⃣ Reinicie o servidor Next.js

Depois de criar/editar o `.env.local`:
```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

### 4️⃣ Abra o Console do Navegador

1. Abra o navegador (Chrome/Firefox/Edge)
2. Pressione **F12** ou **Cmd+Option+I** (Mac)
3. Vá na aba **Console**
4. Recarregue a página (F5)

### 5️⃣ Verifique os logs no Console

Você deve ver algo assim se tudo estiver certo:

```
🔍 Fetching YouTube videos: ["u5buz0H6wgk", "T02gKBoOH-k", ...]
🚀 Calling API route: /api/youtube?ids=u5buz0H6wgk,T02gKBoOH-k,...
📡 API Response status: 200
✅ Videos received: 5
```

### 6️⃣ Verifique os logs do Servidor

No terminal onde o Next.js está rodando, procure por:

```
🚀 Fetching YouTube data from server...
📡 YouTube API Response status: 200
✅ YouTube data received: 5 videos
```

## 🚨 Erros Comuns e Soluções

### ❌ Erro 400: "API key not valid"

**Causa:** API Key incorreta ou não configurada corretamente

**Solução:**
1. Verifique se a chave está correta no `.env.local`
2. Confirme que você habilitou a YouTube Data API v3 no Google Cloud Console
3. Se adicionou restrições na API Key, remova temporariamente para testar

### ❌ Erro 403: "The request is missing a valid API key"

**Causa:** Variável de ambiente não está sendo lida

**Solução:**
```bash
# 1. Verifique se o arquivo existe
cat .env.local

# 2. Deve mostrar sua API key
# Se não mostrar, crie o arquivo:
echo "NEXT_PUBLIC_YOUTUBE_API_KEY=SUA_CHAVE" > .env.local

# 3. SEMPRE reinicie o servidor depois
```

### ❌ Erro 403: "Daily quota exceeded"

**Causa:** Você ultrapassou o limite de 10.000 unidades/dia

**Solução:**
- Aguarde até o dia seguinte (reset automático às 00:00 PST)
- Ou solicite aumento de quota no Google Cloud Console

### ❌ Vídeos aparecem com título "Erro ao carregar vídeo"

**Causa:** Algum erro no fetch

**Solução:**
1. Abra o Console (F12)
2. Procure por mensagens em vermelho começando com `❌`
3. Copie o erro e verifique aqui

### ❌ API Key não está sendo lida (shows "N/A")

**Causa:** Arquivo `.env.local` na pasta errada ou servidor não reiniciado

**Solução:**
```bash
# Verifique se está na raiz do projeto
pwd
# Deve mostrar: /Users/.../projeta-plus-html

# Liste arquivos
ls -la | grep env

# Deve aparecer: .env.local

# Se não aparecer, está na pasta errada!
```

## 🧪 Teste Rápido

Abra no navegador:
```
http://localhost:3000/api/youtube?ids=u5buz0H6wgk
```

**Resposta esperada (sucesso):**
```json
{
  "videos": [
    {
      "id": "u5buz0H6wgk",
      "title": "PLUGIN SKETCHUP INTELIGENTE...",
      "description": "...",
      "thumbnail": "https://...",
      "duration": "12:34",
      "publishedAt": "Há 2 dias"
    }
  ]
}
```

**Resposta esperada (erro):**
```json
{
  "error": "YouTube API key not configured"
}
```

## 📊 Teste se a API Key está funcionando direto

Execute no terminal:
```bash
# Substitua YOUR_API_KEY pela sua chave
curl "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=u5buz0H6wgk&key=YOUR_API_KEY"
```

Se funcionar, você verá o JSON completo do vídeo.

## 🔧 Última Tentativa: Recrie a API Key

1. Vá no [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Delete a API Key antiga
3. Crie uma nova
4. **NÃO adicione restrições** (pelo menos no início)
5. Copie a nova chave
6. Atualize `.env.local`
7. Reinicie o servidor

## 📞 Ainda não funciona?

Me envie:
1. Output completo do Console do navegador (F12)
2. Output completo do terminal do Next.js
3. O resultado do teste: `http://localhost:3000/api/youtube?ids=u5buz0H6wgk`

---

💡 **Dica:** Na maioria dos casos, o problema é:
1. ❌ Esqueceu de reiniciar o servidor após criar `.env.local`
2. ❌ API Key com restrições muito rigorosas
3. ❌ Arquivo `.env.local` na pasta errada

