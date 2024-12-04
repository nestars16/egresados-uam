import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function AdvertisementManagerDynamic() {
    const { toast } = useToast();
    const [form, setForm] = useState<{
        name: string;
        placement: string[];
        format: string;
        content: string;
        mediaFile: File | null;
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

    const handleSubmit = () => {
        const isValid =
            form.name &&
            form.placement.length > 0 &&
            (form.format === "TEXT" ? form.content : form.mediaFile) &&
            form.redirectUrl;

        if (isValid) {
            toast({
                variant: "default",
                title: "¡Éxito!",
                description: "La publicidad se creó correctamente.",
            });
            setForm({
                name: "",
                placement: [],
                format: "TEXT",
                content: "",
                mediaFile: null,
                previewUrl: "",
                redirectUrl: "",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Por favor, rellena todos los campos obligatorios.",
            });
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Advertisement</h1>
            <Tabs defaultValue="published">
                <TabsList className="mb-6 flex">
                    <TabsTrigger value="published" className="mr-2 px-4 py-2 font-medium text-sm bg-muted hover:bg-accent focus:ring-2 focus:ring-offset-2">
                        Manage Ads
                    </TabsTrigger>
                    <TabsTrigger value="notPublished" className="px-4 py-2 font-medium text-sm bg-muted hover:bg-accent focus:ring-2 focus:ring-offset-2">
                        Create Ad
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="published">
                    <Card>
                        <CardHeader>
                            <CardTitle>Publicidades Publicadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">No hay publicidades publicadas actualmente.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notPublished">
                    <Card>
                        <CardHeader>
                            <CardTitle>Crear Nueva Publicidad</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <label className="block mb-2 font-medium">Nombre</label>
                                <Input
                                    type="text"
                                    placeholder="Nombre de la publicidad"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block mb-2 font-medium">Ubicaciones</label>
                                <div className="space-y-2">
                                    <div>
                                        <input
                                            type="checkbox"
                                            value="HOMEPAGE"
                                            checked={form.placement.includes("HOMEPAGE")}
                                            onChange={(e) => handlePlacementChange(e.target.value)}
                                        />
                                        <label>Página Principal</label>
                                    </div>
                                    <div>
                                        <input
                                            type="checkbox"
                                            value="DASHBOARD"
                                            checked={form.placement.includes("DASHBOARD")}
                                            onChange={(e) => handlePlacementChange(e.target.value)}
                                        />
                                        <label>Dashboard</label>
                                    </div>
                                </div>
                            </div>
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
                            <div className="mb-6">
                                <label className="block mb-2 font-medium">{form.format === "TEXT" ? "Contenido" : "Archivo"}</label>
                                {form.format === "TEXT" ? (
                                    <Textarea
                                        placeholder="Escribe el contenido aquí"
                                        value={form.content}
                                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    />
                                ) : (
                                    <Input type="file" accept="image/*" onChange={handleFileUpload} />
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 font-medium">URL de Redirección</label>
                                <Input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={form.redirectUrl}
                                    onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleSubmit}>Guardar</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}