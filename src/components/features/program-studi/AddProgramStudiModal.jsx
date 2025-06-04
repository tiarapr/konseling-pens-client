import { useEffect, useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function AddProgramStudiModal({ isOpen, closeModal, onSubmitSuccess }) {
    const [namaProgramStudi, setNamaProgramStudi] = useState("");
    const [jenjang, setJenjang] = useState("");
    const [departement, setDepartement] = useState("");
    const [departementOptions, setDepartementOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDepartements = async () => {
        try {
            const response = await api.get("/departement");
            const options = response.data.data.departements.map((item) => ({
                value: item.id,
                label: item.name,
            }));
            setDepartementOptions(options);
        } catch (error) {
            console.error("Failed to fetch departements:", error.message);
            toast.error("Gagal memuat data departement.");
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDepartements();
            // Reset form
            setNamaProgramStudi("");
            setJenjang("");
            setDepartement("");
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!namaProgramStudi.trim() || !jenjang.trim() || !departement) {
            toast.error("Semua field wajib diisi.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/program-studi", {
                nama_program_studi: namaProgramStudi.trim(),
                jenjang: jenjang.trim(),
                departement_id: departement,
            });

            toast.success("Program studi berhasil ditambahkan.");
            onSubmitSuccess?.();
            closeModal();
        } catch (error) {
            console.error("Gagal menambahkan program studi:", error);
            toast.error(error?.response?.data?.message || "Gagal menambahkan program studi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Tambah Program Studi
                </h4>

                <div className="mb-6">
                    <Label htmlFor="departement">
                        Departement <span className="text-error-500">*</span>
                    </Label>
                    <Select
                        id="departement"
                        options={departementOptions}
                        placeholder="Pilih departement"
                        required
                        onChange={(value) => setDepartement(value)}
                        value={departement}
                    />
                </div>

                <div className="mb-6">
                    <Label>
                        Jenjang <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        value={jenjang}
                        onChange={(e) => setJenjang(e.target.value)}
                        placeholder="D3, D4, S1, dll"
                        className="w-full"
                    />
                </div>

                <div className="mb-6">
                    <Label>
                        Nama Program Studi <span className="text-error-500">*</span>
                    </Label>
                    <Input
                        value={namaProgramStudi}
                        onChange={(e) => setNamaProgramStudi(e.target.value)}
                        placeholder="Contoh: Teknik Informatika"
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
