import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, QrCode, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function DownloadOptions({ plant }) {
  const [downloading, setDownloading] = useState(null);

  const downloadQRImage = async () => {
    if (!plant.qr_code) return;
    
    setDownloading('qr');
    try {
      const response = await fetch(plant.qr_code);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_${plant.nombre_cientifico.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading QR:", error);
    } finally {
      setDownloading(null);
    }
  };

  const downloadPDF = () => {
    setDownloading('pdf');
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ficha de Planta - ${plant.nombre_cientifico}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px; 
            max-width: 800px; 
            margin: 0 auto;
          }
          h1 { 
            color: #059669; 
            border-bottom: 3px solid #059669; 
            padding-bottom: 10px;
          }
          .section { 
            margin: 30px 0; 
          }
          .section-title { 
            font-weight: bold; 
            color: #047857; 
            font-size: 18px; 
            margin-bottom: 15px;
            border-left: 4px solid #059669;
            padding-left: 10px;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
          }
          .info-item { 
            margin-bottom: 10px; 
          }
          .label { 
            color: #6b7280; 
            font-size: 14px; 
            font-weight: 500;
          }
          .value { 
            color: #111827; 
            font-size: 16px; 
            margin-top: 4px;
          }
          .qr-section { 
            text-align: center; 
            margin: 30px 0; 
            page-break-inside: avoid;
          }
          .qr-section img { 
            max-width: 300px; 
            border: 2px solid #059669;
            padding: 10px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>${plant.nombre_cientifico}</h1>
        ${plant.nombre_comun ? `<p style="font-size: 18px; color: #6b7280; margin-top: -10px;">${plant.nombre_comun}</p>` : ''}
        
        <div class="section">
          <div class="section-title">Identificación</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Nombre Científico</div>
              <div class="value">${plant.nombre_cientifico || '-'}</div>
            </div>
            <div class="info-item">
              <div class="label">Nombre Común</div>
              <div class="value">${plant.nombre_comun || '-'}</div>
            </div>
            <div class="info-item">
              <div class="label">Familia</div>
              <div class="value">${plant.familia || '-'}</div>
            </div>
            <div class="info-item">
              <div class="label">Estado</div>
              <div class="value">${plant.estado?.replace(/_/g, ' ') || '-'}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Logística</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Proveedor</div>
              <div class="value">${plant.proveedor || '-'}</div>
            </div>
            <div class="info-item">
              <div class="label">Ubicación</div>
              <div class="value">${plant.ubicacion || '-'}</div>
            </div>
            <div class="info-item">
              <div class="label">Formato</div>
              <div class="value">${plant.formato || '-'}</div>
            </div>
            <div class="info-item">
              <div class="label">Color Contenedor</div>
              <div class="value">${plant.color_contenedor || '-'}</div>
            </div>
            <div class="info-item">
              <div class="label">Fecha de Recepción</div>
              <div class="value">${plant.fecha_recepcion ? format(new Date(plant.fecha_recepcion), 'dd/MM/yyyy') : '-'}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Inventario</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="label">Precio Unitario</div>
              <div class="value">${plant.precio ? `€${plant.precio.toFixed(2)}` : '-'}</div>
            </div>
            <div class="info-item">
              <div class="label">Stock Inicial</div>
              <div class="value">${plant.stock_inicial || 0}</div>
            </div>
            <div class="info-item">
              <div class="label">Stock Actual</div>
              <div class="value" style="color: #059669; font-weight: bold;">${plant.stock_actual || 0}</div>
            </div>
          </div>
        </div>

        ${plant.caracteristicas && Object.keys(plant.caracteristicas).length > 0 ? `
          <div class="section">
            <div class="section-title">Características Adicionales</div>
            <div class="info-grid">
              ${Object.entries(plant.caracteristicas).map(([key, value]) => `
                <div class="info-item">
                  <div class="label">${key}</div>
                  <div class="value">${value}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${plant.notas ? `
          <div class="section">
            <div class="section-title">Notas</div>
            <div class="value">${plant.notas}</div>
          </div>
        ` : ''}

        ${plant.qr_code ? `
          <div class="qr-section">
            <div class="section-title">Código QR Único</div>
            <img src="${plant.qr_code}" alt="QR Code" />
            <p style="margin-top: 10px; color: #6b7280; font-size: 12px;">Este código es único e inalterable</p>
          </div>
        ` : ''}

        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
    
    setTimeout(() => setDownloading(null), 1000);
  };

  const downloadExcel = () => {
    setDownloading('excel');
    
    const data = {
      'Nombre Científico': plant.nombre_cientifico,
      'Nombre Común': plant.nombre_comun,
      'Familia': plant.familia,
      'Proveedor': plant.proveedor,
      'Ubicación': plant.ubicacion,
      'Formato': plant.formato,
      'Color Contenedor': plant.color_contenedor,
      'Estado': plant.estado,
      'Precio': plant.precio,
      'Stock Inicial': plant.stock_inicial,
      'Stock Actual': plant.stock_actual,
      'Fecha de Recepción': plant.fecha_recepcion,
      'Notas': plant.notas,
      ...(plant.caracteristicas || {})
    };

    const headers = Object.keys(data);
    const values = Object.values(data).map(v => v || '');
    
    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      values.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${plant.nombre_cientifico.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setDownloading(null), 500);
  };

  return (
    <Card className="border-green-200/50 shadow-sm">
      <CardHeader className="border-b border-green-100">
        <CardTitle className="text-xl text-green-900 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Descargas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        <Button
          onClick={downloadPDF}
          disabled={downloading === 'pdf'}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {downloading === 'pdf' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileText className="w-4 h-4 mr-2" />
          )}
          Descargar PDF Completo
        </Button>

        {plant.qr_code && (
          <Button
            onClick={downloadQRImage}
            disabled={downloading === 'qr'}
            variant="outline"
            className="w-full border-green-300 hover:bg-green-50"
          >
            {downloading === 'qr' ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <QrCode className="w-4 h-4 mr-2" />
            )}
            Descargar Solo QR
          </Button>
        )}

        <Button
          onClick={downloadExcel}
          disabled={downloading === 'excel'}
          variant="outline"
          className="w-full border-green-300 hover:bg-green-50"
        >
          {downloading === 'excel' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Exportar a Excel
        </Button>
      </CardContent>
    </Card>
  );
}