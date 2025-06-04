import { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function EditPermissionModal({ isOpen, closeModal, onSubmitSuccess, selectedData }) {
    const [permissionName, setPermissionName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && selectedData) {
            setPermissionName(selectedData.name || "");
        }
    }, [isOpen, selectedData]);

    const handleSubmit = async () => {
        if (!permissionName.trim()) {
            toast.error("Nama permission wajib diisi.");
            return;
        }

        setLoading(true);
        try {
            await api.put(`/permissions/${selectedData.id}`, { name: permissionName });

            toast.success("Permission berhasil diperbarui.");
            onSubmitSuccess?.();
            closeModal();
        } catch (error) {
            console.error("Gagal mengubah permission:", error);
            toast.error(error?.response?.data?.message || "Gagal mengubah permission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[400px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Edit Permission
                </h4>

                <Label>
                    Nama Permission <span className="text-error-500">*</span>
                </Label>
                <Input
                    value={permissionName}
                    onChange={(e) => setPermissionName(e.target.value)}
                    placeholder="Contoh: manage-users, view-dashboard"
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
