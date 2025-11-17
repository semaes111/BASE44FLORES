import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import BasicInfoForm from "../components/forms/BasicInfoForm";
import AdditionalFieldsForm from "../components/forms/AdditionalFieldsForm";

export default function CrearPlanta() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre_cientifico: '',
    nombre_comun: '',
    familia: '',
    proveedor: '',
    ubicacion: '',
    formato: '',
    color_contenedor: '',
    estado: 'nuevo',
    precio: 0,
    stock_inicial: 0,
    stock_actual: 0,
    fecha_recepcion: new Date().toISOString().split('T')[0],
    notas: '',
  });

  const [additionalFields, setAdditionalFields] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        if (userData.role !== 'admin') {
          navigate(createPageUrl("Dashboard"));
        }
      } catch (error) {
        navigate(createPageUrl("Dashboard"));
      }
    };
    fetchUser();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddField = () => {
    setAdditionalFields(prev => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveField = (index) => {
    setAdditionalFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    setAdditionalFields(prev => {
      const newFields = [...prev];
      newFields[index][field] = value;
      return newFields;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const caracteristicas = {};
      additionalFields.forEach(field => {
        if (field.key && field.value) {
          caracteristicas[field.key] = field.value;
        }
      });

      const plantData = {
        ...formData,
        caracteristicas: Object.keys(caracteristicas).length > 0 ? caracteristicas : null,
      };

      const createdPlant = await base44.entities.Plant.create(plantData);

      // Construir URL completa de la planta
      const fullUrl = `${window.location.origin}${createPageUrl("DetallePlanta")}?id=${createdPlant.id}`;
      
      console.log("URL completa generada para QR:", fullUrl);

      // Generar código QR
      const qrCode = `https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=${encodeURIComponent(fullUrl)}`;
      
      console.log("Código QR generado:", qrCode);

      await base44.entities.Plant.update(createdPlant.id, { qr_code: qrCode });

      navigate(createPageUrl("DetallePlanta") + `?id=${createdPlant.id}`);
    } catch (error) {
      setError("Error al crear la planta. Por favor, intenta de nuevo.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
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
            <h1 className="text-3xl font-bold text-gray-900">Nueva Planta</h1>
            <p className="text-gray-600">Registra una nueva especie en la base de datos</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <Card className="border-green-200/50 shadow-sm">
            <CardHeader className="border-b border-green-100">
              <CardTitle className="text-xl text-green-900">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <BasicInfoForm formData={formData} onChange={handleInputChange} />
            </CardContent>
          </Card>

          {/* Campos Adicionales */}
          <Card className="border-green-200/50 shadow-sm">
            <CardHeader className="border-b border-green-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-green-900">Campos Adicionales</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddField}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Campo
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Agrega información personalizada según tus necesidades
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <AdditionalFieldsForm
                fields={additionalFields}
                onChange={handleFieldChange}
                onRemove={handleRemoveField}
              />
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end sticky bottom-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              disabled={isLoading}
              className="border-gray-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.nombre_cientifico}
              className="bg-green-600 hover:bg-green-700 shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Planta
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}