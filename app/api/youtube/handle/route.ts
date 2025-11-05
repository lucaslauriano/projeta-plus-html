import { NextRequest, NextResponse } from 'next/server';

// Converte @handle para Channel ID
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const handle = searchParams.get('handle');

  if (!handle) {
    return NextResponse.json({ error: 'Handle is required' }, { status: 400 });
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
    // Remove @ if present
    const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;

    // Use the search API to find the channel by handle/username
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${cleanHandle}&key=${apiKey}`;

    console.log('🔍 Searching for channel with handle:', cleanHandle);

    const response = await fetch(searchUrl, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ YouTube Search API Error:', errorData);
      return NextResponse.json(
        {
          error: 'Failed to search for channel',
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // Get the first result's channel ID
    const channelId = data.items[0].snippet.channelId;
    const channelTitle = data.items[0].snippet.channelTitle;
    console.log(data.items[0]);

    console.log('✅ Found channel:', channelTitle, '→', channelId);

    return NextResponse.json({
      channelId,
      channelTitle,

      handle: cleanHandle,
    });
  } catch (error) {
    console.error('❌ Error in handle conversion:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
