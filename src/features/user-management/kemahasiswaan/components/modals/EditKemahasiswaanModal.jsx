import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import api from "@/api/api";

export default function EditKemahasiswaanModal({
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
        nip: "",
        jabatan: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchKemahasiswaanAccount = async () => {
            if (!selectedData?.user_id) return;
            try {
                const response = await api.get(`/kemahasiswaan/account/${selectedData.user_id}`);
                const kemahasiswaan = response.data.data.kemahasiswaan;

                setFormData({
                    nama_lengkap: kemahasiswaan.nama_lengkap || "",
                    email: kemahasiswaan.email || "",
                    phoneNumber: kemahasiswaan.phone_number || "",
                    password: "",
                    nip: kemahasiswaan.nip || "",
                    jabatan: kemahasiswaan.jabatan || "",
                });
            } catch (error) {
                console.error("Gagal mengambil data kemahasiswaan:", error);
            }
        };

        if (isOpen) fetchKemahasiswaanAccount();
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
                nip: formData.nip,
                jabatan: formData.jabatan,
            };

            if (formData.password.trim()) {
                payload.password = formData.password;
            }

            await api.patch(`/kemahasiswaan/account/${selectedData.id}`, payload);

            onSubmitSuccess();
            closeModal();
        } catch (error) {
            console.error("Gagal update data kemahasiswaan:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Edit Data Kemahasiswaan
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

                <Label>nip</Label>
                <Input
                    value={formData.nip}
                    onChange={(e) => handleChange("nip", e.target.value)}
                    placeholder="Masukkan nip"
                    className="w-full mb-4"
                />

                <Label>jabatan</Label>
                <Input
                    value={formData.jabatan}
                    onChange={(e) => handleChange("jabatan", e.target.value)}
                    placeholder="Masukkan jabatan"
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
