import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import api from "@/api/api";
import { toast } from "react-toastify";
import { TrashBinIcon } from "@/icons";

export default function AddPermissionModal({ isOpen, closeModal, onSubmitSuccess }) {
    const [formData, setFormData] = useState([{ name: "" }]);
    const [loading, setLoading] = useState(false);

    const handleChange = (index, value) => {
        const updated = [...formData];
        updated[index].name = value;
        setFormData(updated);
    };

    const handleAddField = () => {
        setFormData([...formData, { name: "" }]);
    };

    const handleRemoveField = (index) => {
        const updated = formData.filter((_, i) => i !== index);
        setFormData(updated);
    };

    const handleSubmit = async () => {
        setLoading(true);

        if (formData.some(p => !p.name.trim())) {
            toast.error("Semua field permission harus diisi.");
            setLoading(false);
            return;
        }

        try {
            const payload = formData.length === 1 ? formData[0] : formData;
            await api.post("/permissions", payload);

            toast.success("Permission berhasil ditambahkan.");
            onSubmitSuccess?.();
            closeModal();
            setFormData([{ name: "" }]);
        } catch (error) {
            console.error("Gagal menambahkan permission:", error);
            toast.error(error?.response?.data?.message || "Gagal menambahkan permission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Tambah Permission
                </h4>

                {formData.map((item, index) => (
                    <div key={index} className="mb-4">
                        <Label>
                            Nama Permission <span className="text-error-500">*</span>
                        </Label>

                        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                            <Input
                                value={item.name}
                                onChange={(e) => handleChange(index, e.target.value)}
                                placeholder="Masukkan nama permission"
                                className="w-full"
                            />

                            {formData.length > 1 && (
                                <button
                                    onClick={() => handleRemoveField(index)}
                                    className="p-3 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                                >
                                    <TrashBinIcon />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleAddField}
                    className="mb-6 text-sm text-brand-600 hover:underline"
                >
                    + Tambah Field Permission
                </button>

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
