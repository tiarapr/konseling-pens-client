import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import api from "@/api/api";

export default function EditKonselorModal({
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
        sipp: "",
        spesialisasi: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchKonselorAccount = async () => {
            if (!selectedData?.user_id) return;
            try {
                const response = await api.get(`/konselor/account/${selectedData.user_id}`);
                const konselor = response.data.data.konselor;

                setFormData({
                    nama_lengkap: konselor.nama_lengkap || "",
                    email: konselor.email || "",
                    phoneNumber: konselor.phone_number || "",
                    password: "",
                    sipp: konselor.sipp || "",
                    spesialisasi: konselor.spesialisasi || "",
                });
            } catch (error) {
                console.error("Gagal mengambil data konselor:", error);
            }
        };

        if (isOpen) fetchKonselorAccount();
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
                sipp: formData.sipp,
                spesialisasi: formData.spesialisasi,
            };

            if (formData.password.trim()) {
                payload.password = formData.password;
            }

            await api.patch(`/konselor/account/${selectedData.id}`, payload);

            onSubmitSuccess();
            closeModal();
        } catch (error) {
            console.error("Gagal update data konselor:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Edit Data Konselor
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

                <Label>SIPP</Label>
                <Input
                    value={formData.sipp}
                    onChange={(e) => handleChange("sipp", e.target.value)}
                    placeholder="Masukkan SIPP"
                    className="w-full mb-4"
                />

                <Label>Spesialisasi</Label>
                <Input
                    value={formData.spesialisasi}
                    onChange={(e) => handleChange("spesialisasi", e.target.value)}
                    placeholder="Masukkan spesialisasi"
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
