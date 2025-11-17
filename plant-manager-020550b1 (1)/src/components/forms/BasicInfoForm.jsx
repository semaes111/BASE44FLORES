import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BasicInfoForm({ formData, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="nombre_cientifico" className="text-gray-700">
          Nombre Científico <span className="text-red-500">*</span>
        </Label>
        <Input
          id="nombre_cientifico"
          value={formData.nombre_cientifico}
          onChange={(e) => onChange('nombre_cientifico', e.target.value)}
          placeholder="Ej: Rosa damascena"
          required
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre_comun" className="text-gray-700">Nombre Común</Label>
        <Input
          id="nombre_comun"
          value={formData.nombre_comun}
          onChange={(e) => onChange('nombre_comun', e.target.value)}
          placeholder="Ej: Rosa de Damasco"
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="familia" className="text-gray-700">Familia</Label>
        <Input
          id="familia"
          value={formData.familia}
          onChange={(e) => onChange('familia', e.target.value)}
          placeholder="Ej: Rosaceae"
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proveedor" className="text-gray-700">Proveedor</Label>
        <Input
          id="proveedor"
          value={formData.proveedor}
          onChange={(e) => onChange('proveedor', e.target.value)}
          placeholder="Nombre del proveedor"
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ubicacion" className="text-gray-700">Ubicación</Label>
        <Input
          id="ubicacion"
          value={formData.ubicacion}
          onChange={(e) => onChange('ubicacion', e.target.value)}
          placeholder="Ej: Almacén, Nave, etc."
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="formato" className="text-gray-700">Formato</Label>
        <Input
          id="formato"
          value={formData.formato}
          onChange={(e) => onChange('formato', e.target.value)}
          placeholder="Ej: M17, Jardinera 40, etc."
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color_contenedor" className="text-gray-700">Color Contenedor</Label>
        <Input
          id="color_contenedor"
          value={formData.color_contenedor}
          onChange={(e) => onChange('color_contenedor', e.target.value)}
          placeholder="Ej: Gris, Negro, etc."
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado" className="text-gray-700">Estado</Label>
        <Select value={formData.estado} onValueChange={(value) => onChange('estado', value)}>
          <SelectTrigger className="border-green-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nuevo">Nuevo</SelectItem>
            <SelectItem value="reutilizado">Reutilizado</SelectItem>
            <SelectItem value="en_cultivo">En Cultivo</SelectItem>
            <SelectItem value="para_venta">Para Venta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="precio" className="text-gray-700">Precio (€)</Label>
        <Input
          id="precio"
          type="number"
          step="0.01"
          min="0"
          value={formData.precio}
          onChange={(e) => onChange('precio', parseFloat(e.target.value) || 0)}
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock_inicial" className="text-gray-700">Stock Inicial</Label>
        <Input
          id="stock_inicial"
          type="number"
          min="0"
          value={formData.stock_inicial}
          onChange={(e) => onChange('stock_inicial', parseInt(e.target.value) || 0)}
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock_actual" className="text-gray-700">Stock Actual</Label>
        <Input
          id="stock_actual"
          type="number"
          min="0"
          value={formData.stock_actual}
          onChange={(e) => onChange('stock_actual', parseInt(e.target.value) || 0)}
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fecha_recepcion" className="text-gray-700">Fecha de Recepción</Label>
        <Input
          id="fecha_recepcion"
          type="date"
          value={formData.fecha_recepcion}
          onChange={(e) => onChange('fecha_recepcion', e.target.value)}
          className="border-green-200 focus:border-green-400"
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="notas" className="text-gray-700">Notas</Label>
        <Textarea
          id="notas"
          value={formData.notas}
          onChange={(e) => onChange('notas', e.target.value)}
          placeholder="Información adicional relevante..."
          rows={4}
          className="border-green-200 focus:border-green-400"
        />
      </div>
    </div>
  );
}