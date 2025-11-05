'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getYouTubeVideos,
  getYouTubeChannelVideos,
  type YouTubeVideo,
} from '@/lib/youtube';
import { formatLikes } from '@/lib/format';

type VideoCarouselProps = {
  useChannel?: boolean;
  channelId?: string;
  videoIds?: string[];
  maxVideos?: number;
  title?: string;
  description?: string;
};

export function VideoCarousel({
  useChannel = true,
  channelId = '@francielimadeira',
  videoIds = [],
  maxVideos = 5,
  title = 'Últimos Tutoriais',
  description = 'Aprenda a usar todas as funcionalidades',
}: VideoCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      setIsLoading(true);
      const data = useChannel
        ? await getYouTubeChannelVideos(channelId, maxVideos)
        : await getYouTubeVideos(videoIds);
      setVideos(data);
      setIsLoading(false);
    }
    loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useChannel, channelId, maxVideos]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-bold font-sans'>{title}</h2>
          <p className='text-sm text-muted-foreground font-serif'>
            {description}
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => scroll('left')}
            className='hidden md:flex'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => scroll('right')}
            className='hidden md:flex'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className='flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar'
      >
        {isLoading
          ? // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                className='min-w-[320px] md:min-w-[380px] snap-start animate-pulse overflow-hidden p-0'
              >
                <div className='relative overflow-hidden h-[200px] bg-muted' />
                <CardHeader className='pb-3 px-6 pt-6'>
                  <div className='h-5 bg-muted rounded w-3/4 mb-2' />
                  <div className='h-4 bg-muted rounded w-full' />
                  <div className='h-4 bg-muted rounded w-5/6' />
                </CardHeader>
                <CardContent className='pt-0 px-6 pb-6'>
                  <div className='flex items-center justify-between'>
                    <div className='h-3 bg-muted rounded w-20' />
                    <div className='h-5 bg-muted rounded w-12' />
                  </div>
                </CardContent>
              </Card>
            ))
          : videos.map((video) => (
              <Card
                key={video.id}
                className='min-w-[320px] md:min-w-[380px] snap-start cursor-pointer hover:shadow-lg transition-shadow group overflow-hidden p-0'
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/watch?v=${video.id}`,
                    '_blank'
                  )
                }
              >
                <div className='relative overflow-hidden h-[200px]'>
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                    <div className='bg-secondary/90 p-4 rounded-full'>
                      <Play className='h-8 w-8 text-white fill-white' />
                    </div>
                  </div>
                  <div className='absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded'>
                    {video.duration}
                  </div>
                </div>
                <CardHeader className='pb-2 px-4 pt-2'>
                  <CardTitle className='font-sans text-base line-clamp-2'>
                    {video.title}
                  </CardTitle>
                  <CardDescription className='font-serif text-sm line-clamp-2'>
                    {video.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-0 px-6 pb-6'>
                  <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <span>{video.publishedAt}</span>
                    <Badge variant='secondary' className='text-xs'>
                      👍 {formatLikes(video.likes)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
