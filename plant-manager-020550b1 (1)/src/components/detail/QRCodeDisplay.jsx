import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode } from "lucide-react";

export default function QRCodeDisplay({ qrCode, plantName }) {
  if (!qrCode) {
    return (
      <Card className="border-green-200/50 shadow-sm">
        <CardHeader className="border-b border-green-100">
          <CardTitle className="text-xl text-green-900 flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Código QR
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="py-8">
            <QrCode className="w-16 h-16 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">QR no disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200/50 shadow-sm">
      <CardHeader className="border-b border-green-100">
        <CardTitle className="text-xl text-green-900 flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Código QR Único
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-white p-4 rounded-lg border-2 border-green-200">
          <img 
            src={qrCode} 
            alt={`QR Code for ${plantName}`}
            className="w-full h-auto"
          />
        </div>
        <p className="text-xs text-center text-gray-500 mt-3">
          Este código es único e inalterable
        </p>
      </CardContent>
    </Card>
  );
}