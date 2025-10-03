import { ChevronRightIcon } from 'lucide-react';

const PageHeader = ({
  title,
  breadcrumbs,
}: {
  title: string;
  breadcrumbs: { name: string; href: string }[];
}) => {
  return (
    <div className='w-full lg:flex lg:items-center lg:justify-between pb-10'>
      <div className='min-w-0 flex-1 border-b border-border pb-5'>
        <nav aria-label='Breadcrumb' className='flex'>
          <ol role='list' className='flex items-center space-x-4'>
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.name}>
                <div className='flex'>
                  {index > 0 && (
                    <ChevronRightIcon
                      aria-hidden='true'
                      className='size-5 shrink-0 text-muted-foreground'
                    />
                  )}
                  <a
                    href={breadcrumb.href}
                    className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {breadcrumb.name}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </nav>
        <h2 className='mt-2 text-base font-bold text-foreground sm:truncate sm:text-3xl sm:tracking-tight'>
          {title}
        </h2>
      </div>
    </div>
  );
};

export default PageHeader;
