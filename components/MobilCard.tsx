/* eslint-disable @next/next/no-img-element */
// components/MobilCard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";

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

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/mobil/${mobil.id_mobil}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedMobil),
      });
      if (response.ok) {
        onEdit(editedMobil);
        setIsEditing(false);
      } else {
        console.error("Failed to update mobil");
      }
    } catch (error) {
      console.error("Error updating mobil:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {isEditing ? (
        <div className="p-4">
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
            <Button variant="outline" onClick={() => setIsEditing(false)}>
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
