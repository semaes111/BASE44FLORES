import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Search, Leaf, Download } from "lucide-react";

import StatsOverview from "../components/dashboard/StatsOverview";
import PlantCard from "../components/dashboard/PlantCard";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  const { data: plantas, isLoading } = useQuery({
    queryKey: ['plantas'],
    queryFn: () => base44.entities.PlantaFormulario.list("-created_date"),
    initialData: [],
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const filteredPlantas = plantas.filter(planta => {
    const searchLower = searchTerm.toLowerCase();
    return (
      planta.nombre_cientifico?.toLowerCase().includes(searchLower) ||
      planta.nombre_comun?.toLowerCase().includes(searchLower) ||
      planta.proveedor?.toLowerCase().includes(searchLower) ||
      planta.ubicacion?.toLowerCase().includes(searchLower)
    );
  });

  const isAdmin = user?.role === 'admin';

  const exportToExcel = () => {
    const exportData = plantas.map(planta => ({
      'Nombre Científico': planta.nombre_cientifico,
      'Nombre Común': planta.nombre_comun,
      'Proveedor': planta.proveedor,
      'Ubicación': planta.ubicacion,
      'Cultivo': planta.cultivo,
      'Formato': planta.formato,
      'Color': planta.color,
      'Estado': planta.estado,
      'Precio': planta.precio,
      'Stock Inicial': planta.stock_inicial,
      'Stock Actual': planta.stock_actual,
      'Fecha Recepción': planta.fecha_recepcion,
      'Código QR': planta.codigo_qr,
      'Notas': planta.notas,
    }));

    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `plantas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Leaf className="w-10 h-10 text-green-600" />
              Base de Datos de Plantas
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Gestión completa del inventario botánico</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={exportToExcel}
              disabled={plantas.length === 0}
              className="flex-1 md:flex-none border-green-200 hover:bg-green-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            {isAdmin && (
              <Link to={createPageUrl("NuevoFormulario")} className="flex-1 md:flex-none">
                <Button className="w-full bg-green-600 hover:bg-green-700 shadow-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Nueva Planta
                </Button>
              </Link>
            )}
          </div>
        </div>

        <StatsOverview plantas={plantas} />

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-green-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, proveedor, ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredPlantas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
            <Leaf className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No se encontraron plantas' : 'Aún no hay plantas registradas'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza registrando tu primera planta'}
            </p>
            {isAdmin && !searchTerm && (
              <Link to={createPageUrl("NuevoFormulario")}>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Registrar Primera Planta
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlantas.map((planta) => (
              <PlantCard key={planta.id} planta={planta} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}