import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const estadoColors = {
  nuevo: "bg-green-100 text-green-800 border-green-200",
  reutilizado: "bg-blue-100 text-blue-800 border-blue-200",
  en_cultivo: "bg-yellow-100 text-yellow-800 border-yellow-200",
  para_venta: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function PlantInfo({ plant }) {
  return (
    <Card className="border-green-200/50 shadow-sm">
      <CardHeader className="border-b border-green-100">
        <CardTitle className="text-xl text-green-900">Información Completa</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Información Básica */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Identificación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Nombre Científico" value={plant.nombre_cientifico} />
            <InfoItem label="Nombre Común" value={plant.nombre_comun} />
            <InfoItem label="Familia" value={plant.familia} />
            <InfoItem 
              label="Estado" 
              value={
                <Badge className={`${estadoColors[plant.estado]} border`}>
                  {plant.estado?.replace(/_/g, ' ')}
                </Badge>
              } 
            />
          </div>
        </div>

        <Separator />

        {/* Proveedor y Ubicación */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Logística</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Proveedor" value={plant.proveedor} />
            <InfoItem label="Ubicación" value={plant.ubicacion} />
            <InfoItem label="Formato" value={plant.formato} />
            <InfoItem label="Color Contenedor" value={plant.color_contenedor} />
            <InfoItem 
              label="Fecha de Recepción" 
              value={plant.fecha_recepcion ? format(new Date(plant.fecha_recepcion), 'dd/MM/yyyy', { locale: es }) : '-'} 
            />
          </div>
        </div>

        <Separator />

        {/* Información de Stock */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Inventario</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="Precio Unitario" value={plant.precio ? `€${plant.precio.toFixed(2)}` : '-'} />
            <InfoItem label="Stock Inicial" value={plant.stock_inicial || 0} />
            <InfoItem label="Stock Actual" value={plant.stock_actual || 0} highlight />
          </div>
        </div>

        {/* Características Adicionales */}
        {plant.caracteristicas && Object.keys(plant.caracteristicas).length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Características Adicionales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(plant.caracteristicas).map(([key, value]) => (
                  <InfoItem key={key} label={key} value={value} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Notas */}
        {plant.notas && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Notas</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                {plant.notas}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value, highlight }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`font-medium ${highlight ? 'text-green-700 text-lg' : 'text-gray-900'}`}>
        {value || '-'}
      </p>
    </div>
  );
}