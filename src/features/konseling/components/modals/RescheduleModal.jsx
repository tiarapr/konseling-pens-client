import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { useState, useEffect } from "react";

export default function RescheduleModal({
    isOpen,
    closeModal,
    konseling,
    onSubmit,
    konselorOptions = [],
}) {
    const [formData, setFormData] = useState({
        konselor_profil_id: "",
        tanggal_konseling: "",
        jam_mulai: "",
        jam_selesai: "",
        lokasi: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (konseling) {
            // Format the date to YYYY-MM-DD for the date input
            const formattedDate = konseling.tanggal_konseling
                ? new Date(konseling.tanggal_konseling).toISOString().split('T')[0]
                : "";

            setFormData({
                konselor_profil_id: konseling.konselor?.id || "",
                tanggal_konseling: formattedDate,
                jam_mulai: konseling.jam_mulai || "",
                jam_selesai: konseling.jam_selesai || "",
                lokasi: konseling.lokasi || "",
            });
        }
    }, [konseling]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            closeModal();
        } catch (error) {
            console.error("Reschedule error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const konselorSelectOptions = konselorOptions.map((k) => ({
        label: k.nama_lengkap,
        value: k.id,
    }));

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
            <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Reschedule Konseling
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                    Atur ulang jadwal konseling untuk janji temu mahasiswa.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <div>
                            <Label htmlFor="konselor_profil_id">Konselor</Label>
                            <Select
                                id="konselor_profil_id"
                                name="konselor_profil_id"
                                value={formData.konselor_profil_id}
                                options={konselorSelectOptions}
                                placeholder="Pilih Konselor"
                                onChange={(value) => handleSelectChange("konselor_profil_id", value)}
                                required
                                className="w-full"
                            />
                        </div>

                        <div>
                            <Label htmlFor="tanggal_konseling">Tanggal Konseling</Label>
                            <Input
                                id="tanggal_konseling"
                                type="date"
                                name="tanggal_konseling"
                                value={formData.tanggal_konseling}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
                            />
                        </div>

                        <div>
                            <Label htmlFor="jam_mulai">Jam Mulai</Label>
                            <Input
                                id="jam_mulai"
                                type="time"
                                name="jam_mulai"
                                value={formData.jam_mulai}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="jam_selesai">Jam Selesai</Label>
                            <Input
                                id="jam_selesai"
                                type="time"
                                name="jam_selesai"
                                value={formData.jam_selesai}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="lokasi">Lokasi</Label>
                            <Input
                                id="lokasi"
                                type="text"
                                name="lokasi"
                                value={formData.lokasi}
                                onChange={handleChange}
                                required
                                placeholder="Masukkan lokasi konseling"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={closeModal}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Jadwal"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}