const PageContent = ({ children }: { children: React.ReactNode }) => {
  return <div className='h-full overflow-y-auto pb-6'>{children}</div>;
};

export default PageContent;
