const PageHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className='w-full mb-6 pt-4'>
      <h1 className='text-2xl font-bold text-foreground tracking-tight'>
        {title}
      </h1>
      <p className='text-sm text-muted-foreground mt-1'>{description}</p>
    </div>
  );
};

export default PageHeader;
