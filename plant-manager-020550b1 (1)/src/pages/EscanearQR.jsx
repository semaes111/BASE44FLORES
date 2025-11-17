import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, QrCode, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EscanearQR() {
  const navigate = useNavigate();
  const [plantId, setPlantId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!plantId.trim()) {
      setError("Por favor ingresa un ID de planta");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Buscar en ambas entidades
      const [plantas, plantasFormulario] = await Promise.all([
        base44.entities.Plant.list(),
        base44.entities.PlantaFormulario.list()
      ]);

      const plantaEncontrada = plantas.find(p => p.id === plantId) || 
                              plantasFormulario.find(p => p.id === plantId);

      if (plantaEncontrada) {
        navigate(createPageUrl("DetallePlanta") + `?id=${plantId}`);
      } else {
        setError("No se encontró ninguna planta con ese ID");
      }
    } catch (err) {
      setError("Error al buscar la planta. Intenta de nuevo.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
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
            <h1 className="text-3xl font-bold text-gray-900">Buscar Planta</h1>
            <p className="text-gray-600">Ingresa el ID de la planta del código QR</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-green-200/50 shadow-lg">
          <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-xl text-green-900 flex items-center gap-2">
              <QrCode className="w-6 h-6" />
              Acceder a Datos de Planta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>¿Cómo funciona?</strong>
                  <br />
                  1. Escanea el código QR con la cámara de tu dispositivo
                  <br />
                  2. Tu dispositivo te redirigirá automáticamente a los datos de la planta
                  <br />
                  <br />
                  O si prefieres, copia el ID de la planta del QR e ingrésalo aquí manualmente.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plantId" className="text-gray-700 font-medium">
                  ID de la Planta
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="plantId"
                    value={plantId}
                    onChange={(e) => setPlantId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ej: abc123def456..."
                    className="border-green-200 focus:border-green-400"
                    disabled={isSearching}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching || !plantId.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Buscar
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  El ID aparece en la URL del código QR después de "id="
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">¿No tienes el ID?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Puedes buscar plantas directamente desde el panel principal o crear nuevas plantas con códigos QR.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(createPageUrl("Dashboard"))}
                  className="flex-1 border-green-200 hover:bg-green-50"
                >
                  Ver Todas las Plantas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200/50 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">¿Cómo escanear un QR?</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>iPhone:</strong> Abre la app Cámara y apunta al código QR</li>
                  <li>• <strong>Android:</strong> Usa Google Lens o la app de Cámara</li>
                  <li>• <strong>Navegador:</strong> El QR te llevará directamente a esta aplicación</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}