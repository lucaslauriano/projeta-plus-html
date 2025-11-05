import { NextRequest, NextResponse } from 'next/server';

function parseDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Hoje';
  if (diffInDays === 1) return 'Há 1 dia';
  if (diffInDays < 7) return `Há ${diffInDays} dias`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? 'Há 1 semana' : `Há ${weeks} semanas`;
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? 'Há 1 mês' : `Há ${months} meses`;
  }
  const years = Math.floor(diffInDays / 365);
  return years === 1 ? 'Há 1 ano' : `Há ${years} anos`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const channelId = searchParams.get('channelId');
  const maxResults = searchParams.get('maxResults') || '5';

  if (!channelId) {
    return NextResponse.json(
      { error: 'Channel ID is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error('❌ YouTube API key not configured');
    return NextResponse.json(
      { error: 'YouTube API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Step 1: Search for latest videos from the channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;

    console.log('🔍 Searching latest videos from channel:', channelId);

    const searchResponse = await fetch(searchUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error('❌ YouTube Search API Error:', errorData);
      return NextResponse.json(
        {
          error: 'Failed to search channel videos',
          details: errorData,
        },
        { status: searchResponse.status }
      );
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map(
      (item: { id: { videoId: string } }) => item.id.videoId
    );

    if (videoIds.length === 0) {
      return NextResponse.json({
        videos: [],
        message: 'No videos found for this channel',
      });
    }

    console.log('📹 Found video IDs:', videoIds);

    // Step 2: Get video details (duration, statistics, etc.)
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(
      ','
    )}&key=${apiKey}`;

    console.log('📊 Fetching video details...');

    const detailsResponse = await fetch(detailsUrl, {
      next: { revalidate: 3600 },
    });

    if (!detailsResponse.ok) {
      const errorData = await detailsResponse.json();
      console.error('❌ YouTube Details API Error:', errorData);
      return NextResponse.json(
        {
          error: 'Failed to fetch video details',
          details: errorData,
        },
        { status: detailsResponse.status }
      );
    }

    const detailsData = await detailsResponse.json();
    console.log('✅ Videos loaded:', detailsData.items?.length);

    interface YouTubeItem {
      id: string;
      snippet: {
        title: string;
        description: string;
        publishedAt: string;
        thumbnails: {
          maxres?: { url: string };
          high?: { url: string };
          medium?: { url: string };
        };
      };
      contentDetails: {
        duration: string;
      };
      statistics?: {
        likeCount?: string;
        viewCount?: string;
        commentCount?: string;
      };
    }

    const videos = (detailsData.items as YouTubeItem[]).map((item) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail:
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.medium?.url,
      duration: parseDuration(item.contentDetails.duration),
      publishedAt: getRelativeTime(item.snippet.publishedAt),
      likes: parseInt(item.statistics?.likeCount || '0'),
      views: parseInt(item.statistics?.viewCount || '0'),
      comments: parseInt(item.statistics?.commentCount || '0'),
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('❌ Error in YouTube channel API route:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
