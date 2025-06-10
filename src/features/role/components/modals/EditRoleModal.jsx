import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import api from "@/api/api";
import { toast } from "react-toastify";

export default function EditRoleModal({ isOpen, closeModal, onSubmitSuccess, selectedData }) {
    const [roleName, setRoleName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && selectedData) {
            setRoleName(selectedData.name || "");
        }
    }, [isOpen, selectedData]);

    const handleSubmit = async () => {
        if (!roleName.trim()) {
            toast.error("Nama role wajib diisi.");
            return;
        }

        setLoading(true);
        try {
            await api.patch(`/role/${selectedData.id}`, { role_name: roleName });
            toast.success("Role berhasil diperbarui.");
            onSubmitSuccess?.();
            closeModal();
        } catch (error) {
            console.error("Gagal mengubah role:", error);
            toast.error(error?.response?.data?.message || "Gagal mengubah role");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[400px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Edit Role
                </h4>

                <Label>Nama Role</Label>
                <Input
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
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
