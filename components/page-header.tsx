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
    <div className='w-full py-4 flex-shrink-0'>
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
