import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea";

export default function UpdateStatusVerifikasiModal({
    isOpen,
    closeModal,
    onSubmit,
    selectedData,
    statusOptions = [],
}) {
    const [statusVerifikasiId, setStatusVerifikasiId] = useState("");
    const [catatanVerifikasi, setCatatanVerifikasi] = useState("");

    useEffect(() => {
        if (selectedData) {
            setStatusVerifikasiId(selectedData.status?.id || "");
            setCatatanVerifikasi("");
        }
    }, [selectedData]);

    const handleSubmit = () => {
        if (!statusVerifikasiId) return;

        const selectedStatus = statusOptions.find(
            (s) => s.id === statusVerifikasiId
        );
        const isTerverifikasi =
            selectedStatus?.label.toLowerCase() === "terverifikasi";

        const payload = {
            id: selectedData.id,
            status_verifikasi_id: statusVerifikasiId,
        };

        if (!isTerverifikasi) {
            payload.catatan_verifikasi = catatanVerifikasi;
        }

        onSubmit(payload);
        closeModal();
    };

    const filteredStatusOptions = statusOptions.filter((s) => 
        s.label.toLowerCase() !== "menunggu verifikasi" && s.label.toLowerCase() !== "menunggu peninjauan"
    );

    const options = filteredStatusOptions.map((s) => ({
        value: s.id,
        label: s.label,
    }));

    const selectedStatus = statusOptions.find((s) => s.id === statusVerifikasiId);
    const isTerverifikasi = selectedStatus?.label.toLowerCase() === "terverifikasi";

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Update Status Verifikasi Mahasiswa
                </h4>

                <Label>Status</Label>
                <Select
                    id="status"
                    value={statusVerifikasiId}
                    options={options}
                    placeholder="Pilih status"
                    onChange={setStatusVerifikasiId}
                    className="w-full"
                />

                {!isTerverifikasi && (
                    <>
                        <Label className="mt-4">Catatan Verifikasi</Label>
                        <TextArea
                            id="catatan"
                            value={catatanVerifikasi}
                            onChange={setCatatanVerifikasi}
                            placeholder="Masukkan catatan verifikasi"
                            className="w-full"
                        />
                    </>
                )}

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" size="sm" onClick={closeModal}>
                        Batal
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!statusVerifikasiId}
                    >
                        Simpan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
