'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Download } from 'lucide-react';

export default function CoatingsReport() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Revestimentos</CardTitle>
          <CardDescription>
            Visualize e exporte dados de revestimentos do seu projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Em desenvolvimento</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              O módulo de relatórios de revestimentos está sendo desenvolvido.
              Em breve você poderá gerar relatórios detalhados de pisos, paredes,
              azulejos e outros revestimentos com metragens e quantitativos.
            </p>
            <div className="flex gap-2">
              <Button disabled>
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
              <Button disabled variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar XLSX
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
