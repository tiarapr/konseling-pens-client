import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import api from "@/api/api";
import { toast } from "react-toastify";

export default function EditProgramStudiModal({ isOpen, closeModal, onSubmitSuccess, selectedData }) {
    const [namaProgramStudi, setNamaProgramStudi] = useState("");
    const [jenjang, setJenjang] = useState("");
    const [departementId, setDepartementId] = useState("");
    const [departementOptions, setDepartementOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && selectedData) {
            setNamaProgramStudi(selectedData.nama_program_studi || "");
            setJenjang(selectedData.jenjang || "");
            setDepartementId(selectedData.departement_id || "");
        }
    }, [isOpen, selectedData]);

    const fetchDepartements = async () => {
        try {
            const res = await api.get("/departement");
            const options = res.data.data.departements.map((item) => ({
                value: item.id,
                label: item.name,
            }));
            setDepartementOptions(options);
        } catch (err) {
            console.error("Gagal memuat departement:", err);
            toast.error("Gagal memuat departement.");
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchDepartements();
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!namaProgramStudi.trim() || !jenjang.trim() || !departementId) {
            toast.error("Semua field wajib diisi.");
            return;
        }

        setLoading(true);
        try {
            await api.patch(`/program-studi/${selectedData.id}`, {
                nama_program_studi: namaProgramStudi.trim(),
                jenjang: jenjang.trim(),
                departement_id: departementId,
            });

            toast.success("Program studi berhasil diperbarui.");
            onSubmitSuccess?.();
            closeModal();
        } catch (err) {
            console.error("Gagal memperbarui program studi:", err);
            toast.error(err?.response?.data?.message || "Gagal memperbarui program studi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Edit Program Studi
                </h4>

                <div className="mb-4">
                    <Label>
                        Nama Program Studi
                    </Label>
                    <Input
                        value={namaProgramStudi}
                        onChange={(e) => setNamaProgramStudi(e.target.value)}
                        placeholder="Contoh: Teknik Informatika"
                        className="w-full"
                    />
                </div>

                <div className="mb-4">
                    <Label>
                        Jenjang
                    </Label>
                    <Input
                        value={jenjang}
                        onChange={(e) => setJenjang(e.target.value)}
                        placeholder="Contoh: D3, D4, S1"
                        className="w-full"
                    />
                </div>

                <div className="mb-6">
                    <Label>
                        Departement
                    </Label>
                    <Select
                        options={departementOptions}
                        value={departementId}
                        onChange={(value) => setDepartementId(value)}
                        placeholder="Pilih departement"
                    />
                </div>

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
