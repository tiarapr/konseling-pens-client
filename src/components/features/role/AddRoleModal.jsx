import { useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function AddRoleModal({ isOpen, closeModal, onSubmitSuccess }) {
    const [loading, setLoading] = useState(false);
    const [roleName, setRoleName] = useState("");

    const handleSubmit = async () => {
        if (!roleName.trim()) {
            toast.error("Nama role wajib diisi.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/role", { role_name: roleName });
            toast.success("Role berhasil ditambahkan.");
            onSubmitSuccess?.();
            closeModal();
            setRoleName(""); // reset input
        } catch (error) {
            console.error("Gagal menambahkan role:", error);
            toast.error(error?.response?.data?.message || "Gagal menambahkan role");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[400px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Tambah Role Baru
                </h4>

                <Label>Nama Role <span className="text-error-500">*</span></Label>
                <Input
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Contoh: admin, kemahasiswaan, konselor"
                    className="w-full mb-6"
                />

                <div className="flex justify-end gap-3">
                    <Button variant="outline" size="sm" onClick={closeModal}>
                        Batal
                    </Button>
                    <Button size="sm" onClick={handleSubmit} loading={loading}>
                        Tambah
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
