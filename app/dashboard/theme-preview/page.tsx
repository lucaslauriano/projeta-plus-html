import PageHeader from '@/components/page-header';
import PageContent from '@/components/ui/page-content';
import PageWrapper from '@/components/ui/page-wraper';
import { ThemePreview } from '@/components/theme-preview';
import { ThemeSelector } from '@/components/ui/theme-selector';

const ThemePreviewPage = () => {
  return (
    <PageWrapper>
      <PageHeader title='Tema' description='Visualização de tema' />
      <PageContent>
        <ThemeSelector />
        <ThemePreview />
      </PageContent>
    </PageWrapper>
  );
};

export default ThemePreviewPage;
