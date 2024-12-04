import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

export default function AdvertisementManagerDynamic() {
  const [form, setForm] = useState<{
    name: string;
    placement: string[];
    format: string;
    content: string;
    mediaFile: File | null; // Acepta File o null
    previewUrl: string;
    redirectUrl: string;
  }>({
    name: "",
    placement: [],
    format: "TEXT",
    content: "",
    mediaFile: null,
    previewUrl: "",
    redirectUrl: "",
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setForm({ ...form, mediaFile: file, previewUrl });
    }
  };

  const handlePlacementChange = (value: string) => {
    if (form.placement.includes(value)) {
      setForm({
        ...form,
        placement: form.placement.filter((item) => item !== value),
      });
    } else {
      setForm({ ...form, placement: [...form.placement, value] });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Advertisement</h1>
      <Tabs defaultValue="published">
        <div className="flex flex-row justify-between">
          <TabsList className="mb-6 flex">
            <TabsTrigger
              value="published"
              className="mr-2 px-4 py-2 font-medium text-sm bg-muted hover:bg-accent focus:ring-2 focus:ring-offset-2"
            >
              Manage Ads
            </TabsTrigger>
            <TabsTrigger
              value="notPublished"
              className="px-4 py-2 font-medium text-sm bg-muted hover:bg-accent focus:ring-2 focus:ring-offset-2"
            >
              Create Ad
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab: Publicidades Publicadas */}
        <TabsContent value="published">
          <Card>
            <CardHeader>
              <CardTitle>Publicidades Publicadas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                No hay publicidades publicadas actualmente.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Publicidades No Publicadas */}
        <TabsContent value="notPublished">
          <Card>
            <CardHeader>
              <CardTitle>Crear Nueva Publicidad</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Nombre */}
              <div className="mb-4">
                <label className="block mb-2 font-medium">Nombre</label>
                <Input type="text" placeholder="Nombre de la publicidad" />
              </div>

              {/* Ubicación */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Ubicaciones</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="homepage"
                      value="HOMEPAGE"
                      checked={form.placement.includes("HOMEPAGE")}
                      onChange={(e) => handlePlacementChange(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="homepage">Página Principal</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="dashboard"
                      value="DASHBOARD"
                      checked={form.placement.includes("DASHBOARD")}
                      onChange={(e) => handlePlacementChange(e.target.value)}
                      className="mr-2"
                    />
                    <label htmlFor="dashboard">Dashboard</label>
                  </div>
                </div>
              </div>

              {/* Formato */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Formato</label>
                <Select
                  value={form.format}
                  onValueChange={(value) => setForm({ ...form, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">Texto</SelectItem>
                    <SelectItem value="IMAGE">Imagen</SelectItem>
                    <SelectItem value="BANNER">Banner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campo dinámico según formato */}
              {form.format === "TEXT" ? (
                <div className="mb-6">
                  <label className="block mb-2 font-medium">Contenido</label>
                  <Textarea
                    placeholder="Ingresa el contenido del texto"
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    Subir Imagen/Banner
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  {form.previewUrl && (
                    <div className="mt-4">
                      <p className="text-gray-500 mb-2">Vista Previa:</p>
                      <img
                        src={form.previewUrl}
                        alt="Vista previa"
                        className="w-full max-h-60 rounded-lg object-contain border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* URL de redirección */}
              <div className="mb-4">
                <label className="block mb-2 font-medium">
                  Enlace de Redirección
                </label>
                <Input type="url" placeholder="https://example.com" />
              </div>

              {/* Botón de Crear */}
              <div className="text-right">
                <Button className="px-4 py-2">Guardar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
