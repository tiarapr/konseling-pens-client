import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import api from "@/api/api";
import { toast } from "react-toastify";

export default function EditDepartementModal({ isOpen, closeModal, onSubmitSuccess, selectedData }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && selectedData) {
            setName(selectedData.name || "");
        }
    }, [isOpen, selectedData]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("Nama departement wajib diisi.");
            return;
        }

        setLoading(true);
        try {
            await api.patch(`/departement/${selectedData.id}`, { name });
            toast.success("Departement berhasil diperbarui.");
            onSubmitSuccess?.();
            closeModal();
        } catch (error) {
            console.error("Gagal mengubah departement:", error);
            toast.error(error?.response?.data?.message || "Gagal mengubah departement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[400px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Edit Departement
                </h4>

                <Label>Nama Departement</Label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: admin, kemahasiswaan"
                    className="w-full mb-6"
                />

                <div className="flex justify-end gap-3">
                    <Button variant="outline" size="sm" onClick={closeModal}>
                        Batal
                    </Button>
                    <Button size="sm" onClick={handleSubmit} loading={loading}>
                        Simpan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
