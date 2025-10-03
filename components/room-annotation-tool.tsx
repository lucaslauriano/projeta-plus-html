import { useRoomAnnotation } from '@/hooks/useRoomAnnotation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RoomAnnotationTool() {
  const { startRoomAnnotation } = useRoomAnnotation();

  const handleStartAnnotation = () => {
    startRoomAnnotation({
      enviroment_name: 'Room',
      show_ceilling_height: true,
      ceilling_height: '2,80',
      show_level: true,
      is_auto_level: true,
      level_value: '0,00',
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
