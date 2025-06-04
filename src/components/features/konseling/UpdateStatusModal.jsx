import { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Select from "../../form/Select";

export default function UpdateStatusModal({ isOpen, closeModal, onSubmit, selectedData, statusOptions = [] }) {
    const [statusId, setStatusId] = useState("");

    useEffect(() => {
        if (selectedData) {
            setStatusId(selectedData.status?.id || "");
        }
    }, [selectedData]);

    const handleSelectChange = (value) => {
        setStatusId(value);
    };

    const handleSubmit = () => {
        if (!statusId) return;
        onSubmit({
            id: selectedData.id,
            status_id: statusId,
        });
        closeModal();
    };

    // Filter hanya status "Berlangsung" dan "Dibatalkan"
    const filteredOptions = statusOptions.filter((status) =>
        status.label.toLowerCase() === "berlangsung" || status.label.toLowerCase() === "dibatalkan"
    );

    // Peta opsi status untuk dropdown
    const options = filteredOptions.map((s) => ({
        value: s.id,
        label: s.label,
    }));

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Update Status Konseling
                </h4>

                <Label>Status</Label>
                <Select
                    id="status"
                    value={statusId}
                    options={options}
                    placeholder="Pilih status"
                    onChange={handleSelectChange}
                    className="w-full"
                />

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" size="sm" onClick={closeModal}>Batal</Button>
                    <Button size="sm" onClick={handleSubmit} disabled={!statusId}>Simpan</Button>
                </div>
            </div>
        </Modal>
    );
}
