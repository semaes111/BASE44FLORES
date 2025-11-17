import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, MapPin, Package, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PlantCard({ planta, isAdmin }) {
  const stockPercentage = planta.stock_inicial > 0 
    ? (planta.stock_actual / planta.stock_inicial) * 100 
    : 0;

  const getStockColor = (percentage) => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Link to={`${createPageUrl('DetallePlanta')}?id=${planta.id}`}>
      <Card className="group hover:shadow-2xl transition-all duration-300 border-green-100 hover:border-green-300 cursor-pointer overflow-hidden h-full">
        <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors truncate">
                  {planta.nombre_cientifico || 'Sin nombre'}
                </h3>
                {planta.nombre_comun && (
                  <p className="text-sm text-gray-500 truncate">{planta.nombre_comun}</p>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            {planta.proveedor && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="truncate">{planta.proveedor}</span>
              </div>
            )}
            
            {planta.ubicacion && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate">{planta.ubicacion}</span>
              </div>
            )}

            {planta.fecha_recepcion && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{format(new Date(planta.fecha_recepcion), 'dd MMM yyyy', { locale: es })}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Stock Actual</p>
              <p className="text-xl font-bold text-gray-900">{planta.stock_actual || 0}</p>
            </div>
            {planta.precio && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Precio</p>
                <p className="text-xl font-bold text-green-600">{planta.precio}€</p>
              </div>
            )}
          </div>

          {planta.stock_inicial > 0 && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Nivel de stock</span>
                <span>{Math.round(stockPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${getStockColor(stockPercentage)} transition-all duration-300`}
                  style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                />
              </div>
            </div>
          )}

          {planta.estado && (
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
              {planta.estado}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}