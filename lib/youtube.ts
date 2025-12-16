export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  likes: number;
  views: number;
  comments: number;
  shares: number;
  downloads: number;
  uploads: number;
  subscribers: number;
  videos: number;
  playlists: number;
  channels: number;
};

// Converte @handle para Channel ID
async function resolveChannelId(
  channelIdOrHandle: string
): Promise<string | null> {
  // Se já é um Channel ID válido (começa com UC e tem 24 caracteres)
  if (channelIdOrHandle.startsWith('UC') && channelIdOrHandle.length === 24) {
    return channelIdOrHandle;
  }

  // Se é um handle (@username), converte para Channel ID
  try {
    const response = await fetch(
      `/api/youtube/handle?handle=${encodeURIComponent(channelIdOrHandle)}`
    );

    if (!response.ok) {
      console.error('❌ Failed to convert handle');
      return null;
    }

    const data = await response.json();
    return data.channelId;
  } catch (error) {
    console.error('❌ Error converting handle:', error);
    return null;
  }
}

// Busca os últimos vídeos de um canal (aceita Channel ID ou @handle)
export async function getYouTubeChannelVideos(
  channelIdOrHandle: string,
  maxResults: number = 5
): Promise<YouTubeVideo[]> {
  try {
    // Resolve Channel ID (se for @handle, converte primeiro)
    const channelId = await resolveChannelId(channelIdOrHandle);

    if (!channelId) {
      console.error('❌ Could not resolve channel ID');
      return [];
    }

    const url = `/api/youtube/channel?channelId=${channelId}&maxResults=${maxResults}`;

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch channel videos');
    }

    const data = await response.json();

    return data.videos;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }

    return [];
  }
}

// Busca vídeos específicos por IDs
export async function getYouTubeVideos(
  videoIds: string[]
): Promise<YouTubeVideo[]> {
  try {
    // Call our internal API route instead of YouTube directly
    const url = `/api/youtube?ids=${videoIds.join(',')}`;

    const response = await fetch(url, {
      cache: 'no-store', // Don't cache on client side
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch videos');
    }

    const data = await response.json();

    return data.videos;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }

    // Return fallback data on error
    return videoIds.map((id) => ({
      id,
      title: 'Erro ao carregar vídeo',
      description: 'Verifique o console (F12) para mais detalhes',
      thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      duration: '0:00',
      publishedAt: 'Recente',
      likes: 0,
      views: 0,
      comments: 0,
      shares: 0,
      downloads: 0,
      uploads: 0,
      subscribers: 0,
      videos: 0,
      playlists: 0,
      channels: 0,
    }));
  }
}
