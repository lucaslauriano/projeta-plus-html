import { useRoomAnnotation } from '@/hooks/useRoomAnnotation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RoomAnnotationTool() {
  const { startAnnotation } = useRoomAnnotation();

  const handleStartAnnotation = () => {
    startAnnotation({
      enviroment_name: 'Room',
      floor_height: '2,80',
      show_ceilling_height: 'sim',
      ceilling_height: '2,80',
      show_level: 'sim',
      level: '0,00',
      scale: 100,
      font: 'Arial',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Annotation</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleStartAnnotation} className='w-full'>
          Start Room Annotation
        </Button>
      </CardContent>
    </Card>
  );
}
