import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function Tabs2({
  tabs,
  onTabChange,
}: {
  tabs: {
    name: string;
    href: string;
    current: boolean;
    icon: React.ComponentType;
    id?: string;
  }[];
  onTabChange?: (tabId: string) => void;
}) {
  return (
    <div className='flex items-center justify-center w-full overflow-x-hidden'>
      <nav aria-label='Tabs' className=' flex space-x-5 justify-center w-full'>
        {tabs.map((tab) => (
          <Tooltip key={tab.id}>
            <TooltipTrigger asChild>
              <button
                key={tab.name}
                onClick={() => onTabChange?.(tab.id || tab.name)}
                aria-current={tab.current ? 'page' : undefined}
                className={cn(
                  tab.current
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:border-primary hover:text-primary',
                  'border-b-2 px-1 pb-2 text-sm font-medium whitespace-nowrap transition-colors'
                )}
              >
                <tab.icon />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tab.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </div>
  );
}
