import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Package, DollarSign, TrendingUp } from 'lucide-react';

export default function StatsOverview({ plantas }) {
  const totalPlantas = plantas.length;
  const totalStock = plantas.reduce((sum, p) => sum + (p.stock_actual || 0), 0);
  const valorTotal = plantas.reduce((sum, p) => sum + ((p.precio || 0) * (p.stock_actual || 0)), 0);
  const promedioStock = totalPlantas > 0 ? Math.round(totalStock / totalPlantas) : 0;

  const stats = [
    {
      title: 'Total Especies',
      value: totalPlantas,
      icon: Leaf,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Stock Total',
      value: totalStock.toLocaleString(),
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Valor Inventario',
      value: `${valorTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`,
      icon: DollarSign,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Promedio por Especie',
      value: promedioStock,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden border-green-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
            <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${stat.color}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}