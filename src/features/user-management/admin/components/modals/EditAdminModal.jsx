import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import api from "@/api/api";
import { toast } from "react-toastify";

export default function EditAdminModal({
    isOpen,
    closeModal,
    onSubmitSuccess,
    selectedData,
}) {
    const [formData, setFormData] = useState({
        nama_lengkap: "",
        email: "",
        phoneNumber: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAdminAccount = async () => {
            if (!selectedData?.user_id) return;
            try {
                const response = await api.get(`/admin/account/${selectedData.user_id}`);
                const admin = response.data.data.admin;

                setFormData({
                    nama_lengkap: admin.nama_lengkap || "",
                    email: admin.email || "",
                    phoneNumber: admin.phone_number || "",
                    password: "", // kosongkan password
                });
            } catch (error) {
                console.error("Gagal mengambil data admin:", error);
            }
        };

        if (isOpen) fetchAdminAccount();
    }, [selectedData, isOpen]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                nama_lengkap: formData.nama_lengkap,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
            };

            if (formData.password.trim()) {
                payload.password = formData.password;
            }

            await api.patch(`/admin/account/${selectedData.id}`, payload);

            onSubmitSuccess(); // Refresh data di parent
            closeModal();
        } catch (error) {
            console.error("Gagal update data admin:", error);
            toast.error("Gagal update data admin:", error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Edit Data Admin
                </h4>

                <Label>Nama Lengkap</Label>
                <Input
                    value={formData.nama_lengkap}
                    onChange={(e) => handleChange("nama_lengkap", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full mb-4"
                />

                <Label>Email</Label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Masukkan email"
                    className="w-full mb-4"
                />

                <Label>Nomor Telepon</Label>
                <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    placeholder="Masukkan nomor telepon"
                    className="w-full mb-4"
                />

                <Label>Password (Opsional)</Label>
                <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Kosongkan jika tidak ingin mengubah password"
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
