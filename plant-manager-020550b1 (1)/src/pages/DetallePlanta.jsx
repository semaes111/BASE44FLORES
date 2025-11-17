import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Edit, QrCode, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import PlantInfo from "../components/detail/PlantInfo";
import QRCodeDisplay from "../components/detail/QRCodeDisplay";
import DownloadOptions from "../components/detail/DownloadOptions";

export default function DetallePlanta() {
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const plantId = urlParams.get('id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, plantData] = await Promise.all([
          base44.auth.me(),
          base44.entities.Plant.list()
        ]);
        
        setUser(userData);
        const foundPlant = plantData.find(p => p.id === plantId);
        setPlant(foundPlant);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (plantId) {
      fetchData();
    }
  }, [plantId]);

  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Planta no encontrada</p>
            <Button onClick={() => navigate(createPageUrl("Dashboard"))}>
              Volver al Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="border-green-200 hover:bg-green-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {plant.nombre_cientifico}
              </h1>
              <p className="text-gray-600">{plant.nombre_comun}</p>
            </div>
          </div>
          {isAdmin && (
            <Button
              onClick={() => navigate(createPageUrl("EditarPlanta") + `?id=${plant.id}`)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Información de la Planta */}
          <div className="lg:col-span-2 space-y-6">
            <PlantInfo plant={plant} />
          </div>

          {/* QR y Descargas */}
          <div className="space-y-6">
            <QRCodeDisplay qrCode={plant.qr_code} plantName={plant.nombre_cientifico} />
            <DownloadOptions plant={plant} />
          </div>
        </div>
      </div>
    </div>
  );
}