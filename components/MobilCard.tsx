/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import api from "../lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Pencil, Trash2 } from "lucide-react";

interface Mobil {
  id_mobil: number;
  merk: string;
  model: string;
  tahun: number;
  gambar: string;
  harga_sewa_per_hari: number;
}

interface MobilCardProps {
  mobil: Mobil;
  onEdit: (updatedMobil: Mobil) => void;
  onDelete: (id: number) => void;
}

export default function MobilCard({ mobil, onEdit, onDelete }: MobilCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMobil, setEditedMobil] = useState({ ...mobil });
  const [error, setError] = useState<string | null>(null);

  const validateInputs = () => {
    if (!editedMobil.merk || editedMobil.merk.trim() === "") {
      return "Merk mobil tidak boleh kosong.";
    }
    if (!editedMobil.model || editedMobil.model.trim() === "") {
      return "Model mobil tidak boleh kosong.";
    }
    if (
      editedMobil.tahun <= 0 ||
      editedMobil.tahun > new Date().getFullYear()
    ) {
      return `Tahun harus antara 1 dan ${new Date().getFullYear()}.`;
    }
    if (!editedMobil.gambar || !editedMobil.gambar.startsWith("http")) {
      return "Link gambar harus valid (dimulai dengan http).";
    }
    if (editedMobil.harga_sewa_per_hari <= 0) {
      return "Harga sewa per hari harus lebih dari 0.";
    }
    return null;
  };

  const handleSave = async () => {
    setError(null);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await api.put(`/mobil/${mobil.id_mobil}`, editedMobil);
      onEdit({ ...editedMobil, id_mobil: mobil.id_mobil });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating mobil:", error);
      setError(
        error.response?.data?.message ||
          "Gagal memperbarui mobil. Silakan coba lagi."
      );
    }
  };

  const handleCancel = () => {
    setEditedMobil({ ...mobil });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {isEditing ? (
        <div className="p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Input
            value={editedMobil.merk}
            onChange={(e) =>
              setEditedMobil({ ...editedMobil, merk: e.target.value })
            }
            className="mb-2"
            placeholder="Merk"
          />
          <Input
            value={editedMobil.model}
            onChange={(e) =>
              setEditedMobil({ ...editedMobil, model: e.target.value })
            }
            className="mb-2"
            placeholder="Model"
          />
          <Input
            type="number"
            value={editedMobil.tahun}
            onChange={(e) =>
              setEditedMobil({
                ...editedMobil,
                tahun: parseInt(e.target.value) || 0,
              })
            }
            className="mb-2"
            placeholder="Tahun"
          />
          <Input
            value={editedMobil.gambar}
            onChange={(e) =>
              setEditedMobil({ ...editedMobil, gambar: e.target.value })
            }
            className="mb-2"
            placeholder="Link Gambar"
          />
          <Input
            type="number"
            value={editedMobil.harga_sewa_per_hari}
            onChange={(e) =>
              setEditedMobil({
                ...editedMobil,
                harga_sewa_per_hari: parseFloat(e.target.value) || 0,
              })
            }
            className="mb-2"
            placeholder="Harga Sewa Per Hari"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Simpan</Button>
          </div>
        </div>
      ) : (
        <>
          <img
            src={mobil.gambar}
            alt={`${mobil.merk} ${mobil.model}`}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">
              {mobil.merk} {mobil.model}
            </h3>
            <p className="text-gray-600">Tahun: {mobil.tahun}</p>
            <p className="text-gray-600">
              Harga Sewa: Rp {mobil.harga_sewa_per_hari.toLocaleString()}/hari
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="text-blue-500 border-blue-500 hover:bg-blue-50">
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(mobil.id_mobil)}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
