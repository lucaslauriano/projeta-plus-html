const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col w-full max-w-2xl mx-auto'>{children}</div>
  );
};

export default PageWrapper;
