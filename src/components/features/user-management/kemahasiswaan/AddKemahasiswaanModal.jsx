import { useState } from "react";
import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import Label from "../../../form/Label";
import Input from "../../../form/input/InputField";
import api from "../../../../api/api";
import { toast } from "react-toastify";
import { EyeIcon, EyeCloseIcon } from "../../../../icons";

export default function AddKemahasiswaanModal({ isOpen, closeModal, onSubmitSuccess }) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        nama_lengkap: "",
        email: "",
        phoneNumber: "",
        nip: "",
        jabatan: "",
        password: "",
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);

        const requiredFields = ["nama_lengkap", "email", "phoneNumber", "nip", "jabatan", "password"];
        const emptyField = requiredFields.find(field => !formData[field]);

        if (emptyField) {
            toast.error("Semua field wajib diisi.");
            setLoading(false);
            return;
        }

        try {
            await api.post("/kemahasiswaan/account", formData);
            toast.success("Akun kemahasiswaan berhasil ditambahkan.");
            onSubmitSuccess();
            closeModal();

            // Reset form
            setFormData({
                nama_lengkap: "",
                email: "",
                phoneNumber: "",
                nip: "",
                jabatan: "",
                password: "",
            });
        } catch (error) {
            console.error("Gagal menambahkan akun kemahasiswaan:", error);
            toast.error(error?.response?.data?.message || "Gagal menambahkan akun");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Tambah Akun Kemahasiswaan
                </h4>

                <Label>Nama Lengkap <span className="text-error-500">*</span></Label>
                <Input
                    value={formData.nama_lengkap}
                    onChange={(e) => handleChange("nama_lengkap", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full mb-4"
                />

                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Masukkan email"
                    className="w-full mb-4"
                />

                <Label>Nomor Telepon <span className="text-error-500">*</span></Label>
                <Input
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    placeholder="Masukkan nomor telepon"
                    className="w-full mb-4"
                />

                <Label>NIP <span className="text-error-500">*</span></Label>
                <Input
                    value={formData.nip}
                    onChange={(e) => handleChange("nip", e.target.value)}
                    placeholder="Masukkan NIP"
                    className="w-full mb-4"
                />

                <Label>Jabatan <span className="text-error-500">*</span></Label>
                <Input
                    value={formData.jabatan}
                    onChange={(e) => handleChange("jabatan", e.target.value)}
                    placeholder="Masukkan jabatan"
                    className="w-full mb-4"
                />

                <Label>Password <span className="text-error-500">*</span></Label>
                <div className="relative mb-6">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        placeholder="Masukkan password"
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                        {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        )}
                    </span>
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
