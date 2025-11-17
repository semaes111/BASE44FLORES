import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Save, Leaf } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NuevoFormulario() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre_cientifico: "",
    nombre_comun: "",
    familia: "",
    proveedor: "",
    ubicacion: "",
    cultivo: "",
    formato: "",
    color: "",
    estado: "RESTO NUEVOS",
    precio: 0,
    stock_inicial: 0,
    stock_actual: 0,
    fecha_recepcion: new Date().toISOString().split('T')[0],
    notas: "",
    campos_adicionales: []
  });

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        if (currentUser.role !== 'admin') {
          navigate(createPageUrl("Dashboard"));
        }
      } catch (error) {
        navigate(createPageUrl("Dashboard"));
      }
    };
    fetchUser();
  }, [navigate]);

  const createPlantaMutation = useMutation({
    mutationFn: async (plantaData) => {
      const createdPlanta = await base44.entities.PlantaFormulario.create(plantaData);
      
      // Construir URL completa de la planta
      const fullUrl = `${window.location.origin}${createPageUrl("DetallePlanta")}?id=${createdPlanta.id}`;
      
      console.log("URL completa generada para QR:", fullUrl);

      // Generar código QR
      const qrCode = `https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=${encodeURIComponent(fullUrl)}`;
      
      console.log("Código QR generado:", qrCode);
      
      await base44.entities.PlantaFormulario.update(createdPlanta.id, {
        codigo_qr: qrCode
      });
      
      return createdPlanta;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['plantas'] });
      navigate(createPageUrl("DetallePlanta") + `?id=${data.id}`);
    },
    onError: (err) => {
      setError("Error al guardar la planta. Por favor, intenta de nuevo.");
      console.error("Error:", err);
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCustomField = () => {
    setFormData(prev => ({
      ...prev,
      campos_adicionales: [...prev.campos_adicionales, { etiqueta: "", valor: "" }]
    }));
  };

  const removeCustomField = (index) => {
    setFormData(prev => ({
      ...prev,
      campos_adicionales: prev.campos_adicionales.filter((_, i) => i !== index)
    }));
  };

  const updateCustomField = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      campos_adicionales: prev.campos_adicionales.map((campo, i) => 
        i === index ? { ...campo, [field]: value } : campo
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    createPlantaMutation.mutate(formData);
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-green-800 flex items-center gap-3">
              <Leaf className="w-8 h-8 text-green-600" />
              Registrar Nueva Planta
            </h1>
            <p className="text-gray-600 mt-1">Completa el formulario con los datos de la planta</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="shadow-xl border-green-100 mb-6">
            <CardHeader className="bg-gradient-to-r from-green-50 to-amber-50 border-b border-green-100">
              <CardTitle className="text-xl text-green-800">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre_cientifico" className="text-gray-700 font-medium">
                    Nombre Científico <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nombre_cientifico"
                    value={formData.nombre_cientifico}
                    onChange={(e) => handleInputChange('nombre_cientifico', e.target.value)}
                    required
                    className="rounded-xl border-gray-300"
                    placeholder="Ej: Rosa chinensis"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre_comun" className="text-gray-700 font-medium">
                    Nombre Común
                  </Label>
                  <Input
                    id="nombre_comun"
                    value={formData.nombre_comun}
                    onChange={(e) => handleInputChange('nombre_comun', e.target.value)}
                    className="rounded-xl border-gray-300"
                    placeholder="Ej: Rosa china"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="familia" className="text-gray-700 font-medium">
                    Familia
                  </Label>
                  <Input
                    id="familia"
                    value={formData.familia}
                    onChange={(e) => handleInputChange('familia', e.target.value)}
                    className="rounded-xl border-gray-300"
                    placeholder="Ej: Rosaceae"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proveedor" className="text-gray-700 font-medium">
                    Proveedor
                  </Label>
                  <Input
                    id="proveedor"
                    value={formData.proveedor}
                    onChange={(e) => handleInputChange('proveedor', e.target.value)}
                    className="rounded-xl border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ubicacion" className="text-gray-700 font-medium">
                    Ubicación
                  </Label>
                  <Input
                    id="ubicacion"
                    value={formData.ubicacion}
                    onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                    className="rounded-xl border-gray-300"
                    placeholder="Ej: Nave A, Almacén"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cultivo" className="text-gray-700 font-medium">
                    Tipo de Cultivo
                  </Label>
                  <Input
                    id="cultivo"
                    value={formData.cultivo}
                    onChange={(e) => handleInputChange('cultivo', e.target.value)}
                    className="rounded-xl border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formato" className="text-gray-700 font-medium">
                    Formato
                  </Label>
                  <Input
                    id="formato"
                    value={formData.formato}
                    onChange={(e) => handleInputChange('formato', e.target.value)}
                    className="rounded-xl border-gray-300"
                    placeholder="Ej: M17, Jardinera 40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="text-gray-700 font-medium">
                    Color
                  </Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="rounded-xl border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado" className="text-gray-700 font-medium">
                    Estado
                  </Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) => handleInputChange('estado', value)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RESTO NUEVOS">Resto Nuevos</SelectItem>
                      <SelectItem value="REUTILIZADO">Reutilizado</SelectItem>
                      <SelectItem value="PALET">Palet</SelectItem>
                      <SelectItem value="EN CULTIVO">En Cultivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precio" className="text-gray-700 font-medium">
                    Precio (€)
                  </Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => handleInputChange('precio', parseFloat(e.target.value) || 0)}
                    className="rounded-xl border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock_inicial" className="text-gray-700 font-medium">
                    Stock Inicial
                  </Label>
                  <Input
                    id="stock_inicial"
                    type="number"
                    value={formData.stock_inicial}
                    onChange={(e) => handleInputChange('stock_inicial', parseInt(e.target.value) || 0)}
                    className="rounded-xl border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock_actual" className="text-gray-700 font-medium">
                    Stock Actual
                  </Label>
                  <Input
                    id="stock_actual"
                    type="number"
                    value={formData.stock_actual}
                    onChange={(e) => handleInputChange('stock_actual', parseInt(e.target.value) || 0)}
                    className="rounded-xl border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_recepcion" className="text-gray-700 font-medium">
                    Fecha de Recepción
                  </Label>
                  <Input
                    id="fecha_recepcion"
                    type="date"
                    value={formData.fecha_recepcion}
                    onChange={(e) => handleInputChange('fecha_recepcion', e.target.value)}
                    className="rounded-xl border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas" className="text-gray-700 font-medium">
                  Notas
                </Label>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => handleInputChange('notas', e.target.value)}
                  className="rounded-xl border-gray-300 min-h-24"
                  placeholder="Información adicional..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-green-100 mb-6">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-green-50 border-b border-green-100">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-green-800">Campos Personalizados</CardTitle>
                <Button
                  type="button"
                  onClick={addCustomField}
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Campo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {formData.campos_adicionales.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay campos personalizados. Haz clic en "Agregar Campo" para añadir uno.
                </p>
              ) : (
                <div className="space-y-4">
                  {formData.campos_adicionales.map((campo, index) => (
                    <div key={index} className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label className="text-gray-700 font-medium">Etiqueta</Label>
                        <Input
                          value={campo.etiqueta}
                          onChange={(e) => updateCustomField(index, 'etiqueta', e.target.value)}
                          placeholder="Nombre del campo"
                          className="rounded-xl border-gray-300"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label className="text-gray-700 font-medium">Valor</Label>
                        <Input
                          value={campo.valor}
                          onChange={(e) => updateCustomField(index, 'valor', e.target.value)}
                          placeholder="Valor del campo"
                          className="rounded-xl border-gray-300"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeCustomField(index)}
                        variant="outline"
                        size="icon"
                        className="rounded-xl text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="rounded-xl"
              disabled={createPlantaMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createPlantaMutation.isPending || !formData.nombre_cientifico}
              className="bg-green-600 hover:bg-green-700 rounded-xl"
            >
              <Save className="w-4 h-4 mr-2" />
              {createPlantaMutation.isPending ? 'Guardando...' : 'Guardar Planta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}