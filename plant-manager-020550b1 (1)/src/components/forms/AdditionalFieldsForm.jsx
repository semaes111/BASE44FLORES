import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function AdditionalFieldsForm({ fields, onChange, onRemove }) {
  if (fields.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay campos adicionales. Haz clic en "Añadir Campo" para agregar información personalizada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={index} className="flex gap-3 items-start p-4 bg-green-50/50 rounded-lg border border-green-100">
          <div className="flex-1 grid grid-cols-2 gap-3">
            <Input
              placeholder="Nombre del campo (ej: pH del suelo)"
              value={field.key}
              onChange={(e) => onChange(index, 'key', e.target.value)}
              className="border-green-200"
            />
            <Input
              placeholder="Valor (ej: 6.5)"
              value={field.value}
              onChange={(e) => onChange(index, 'value', e.target.value)}
              className="border-green-200"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}