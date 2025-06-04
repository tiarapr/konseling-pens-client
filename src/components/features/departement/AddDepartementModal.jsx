import { useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function AddDepartmentModal({ isOpen, closeModal, onSubmitSuccess }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);

        if (!name.trim()) {
            toast.error("Nama departemen tidak boleh kosong.");
            setLoading(false);
            return;
        }

        try {
            await api.post("/departement", { name });
            toast.success("Departemen berhasil ditambahkan.");
            onSubmitSuccess?.();
            closeModal();
            setName("");
        } catch (error) {
            console.error("Gagal menambahkan departemen:", error);
            toast.error(error?.response?.data?.message || "Gagal menambahkan departemen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Tambah Departemen
                </h4>

                <div className="mb-6">
                    <Label>
                        Nama Departemen <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan nama departemen"
                        className="w-full"
                    />
                </div>

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
