# 🎯 Como Encontrar seu Channel ID do YouTube

Existem várias formas de encontrar o Channel ID. Aqui estão as mais fáceis:

## 📍 Método 1: Via URL do Canal (Mais Fácil)

Se sua URL for algo como:
```
https://www.youtube.com/channel/UCXXXxxxxXXXxxx
```

O Channel ID é: `UCXXXxxxxXXXxxx` (a parte depois de `/channel/`)

## 📍 Método 2: Se você tem @nome-do-canal

1. Acesse seu canal: `https://www.youtube.com/@seu-nome-do-canal`
2. Clique com botão direito na página → **"Ver código-fonte"** (ou `Ctrl+U` / `Cmd+Option+U`)
3. Procure por `"channelId"` (Ctrl+F / Cmd+F)
4. Você verá algo como:

```json
"channelId":"UCXXXxxxxXXXxxx"
```

Copie o ID: `UCXXXxxxxXXXxxx`

## 📍 Método 3: Usando Ferramenta Online

1. Acesse: https://commentpicker.com/youtube-channel-id.php
2. Cole a URL do seu canal
3. Clique em "Find YouTube Channel ID"
4. Copie o resultado

## 📍 Método 4: Via YouTube Studio (Seu Canal)

1. Acesse: https://studio.youtube.com/
2. No topo, clique em **Configurações** (ícone de engrenagem)
3. Vá em **Canal** → **Informações básicas**
4. Copie seu **ID do canal**

## 🔧 Como Configurar no Projeto

Depois de encontrar seu Channel ID, edite o arquivo:

`app/dashboard/page.tsx` (linha 38-40):

```typescript
const USE_CHANNEL = true; // ← Mude para true
const CHANNEL_ID = 'UC-SEU-CHANNEL-ID-AQUI'; // ← Cole seu Channel ID
const MAX_VIDEOS = 5; // ← Quantidade de vídeos (max 50)
```

Salve o arquivo e pronto! Os últimos vídeos do seu canal serão carregados automaticamente! 🎉

## ✅ Validar Channel ID

Para testar se o Channel ID está correto, abra no navegador:

```
http://localhost:3000/api/youtube/channel?channelId=SEU_CHANNEL_ID&maxResults=5
```

Se funcionar, você verá o JSON com os vídeos!

## 🆚 Quando usar Canal vs IDs Manuais?

### Use CANAL (recomendado) quando:
- ✅ Você quer sempre mostrar os vídeos mais recentes
- ✅ Você posta vídeos regularmente
- ✅ Quer atualização automática

### Use IDs MANUAIS quando:
- ✅ Você quer escolher vídeos específicos
- ✅ Quer controlar a ordem dos vídeos
- ✅ Quer mostrar vídeos mais antigos ou de outros canais

## 💡 Exemplo de Channel ID válido

```
UCXXXxxxxXXXxxx
```

**Características:**
- Começa com `UC`
- Tem 24 caracteres
- Contém letras (maiúsculas/minúsculas), números e hífens

## ⚠️ Erros Comuns

❌ **Não use o @ do canal**
```
@meu-canal  ← ERRADO
```

✅ **Use o ID que começa com UC**
```
UCXXXxxxxXXXxxx  ← CORRETO
```

---

💡 Se mesmo assim não conseguir encontrar, me mande a URL do seu canal!

