import { Target } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type SelectionStatusAlertProps = {
  isSelected: boolean;
  selectedMessage?: string;
  unselectedMessage?: string;
};

function SelectionStatusAlert({
  isSelected,
  selectedMessage = 'Edite os campos e salve para atualizar o componente.',
  unselectedMessage = 'Selecione um componente ou grupo no SketchUp e clique no botão abaixo.',
}: SelectionStatusAlertProps) {
  return (
    <Alert
      className={cn(
        'mb-4 text-sm',
        isSelected
          ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
          : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900'
      )}
    >
      <Target
        className={cn(
          'h-5 w-5',
          isSelected ? 'text-green-600' : 'text-blue-600'
        )}
      />
      <AlertTitle
        className={cn(
          isSelected
            ? 'text-green-900 dark:text-green-100'
            : 'text-blue-900 dark:text-blue-100'
        )}
      >
        {isSelected ? 'Componente selecionado' : 'Nenhum componente válido'}
      </AlertTitle>
      <AlertDescription
        className={cn(
          isSelected
            ? 'text-green-800 dark:text-green-200'
            : 'text-blue-800 dark:text-blue-200'
        )}
      >
        {isSelected ? selectedMessage : unselectedMessage}
      </AlertDescription>
    </Alert>
  );
}

export default SelectionStatusAlert;

