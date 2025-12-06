const PageHeader = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div className='w-full pb-4 flex-shrink-0 sticky -top-4 z-10 bg-background border-b border-border -mt-8 pt-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-foreground tracking-tight'>
          {title}
        </h1>
        <div>{icon && icon}</div>
      </div>
      <p className='text-sm text-muted-foreground mt-1'>{description}</p>
    </div>
  );
};

export default PageHeader;
