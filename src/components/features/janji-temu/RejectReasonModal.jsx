import { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import TextArea from "../../form/input/TextArea";

const RejectReasonModal = ({
    isOpen,
    closeModal,
    onSubmit,
    janjiTemu
}) => {
    const [alasanPenolakan, setAlasanPenolakan] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Reset form when modal opens
        if (isOpen) {
            setAlasanPenolakan("");
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleTextAreaChange = (value) => {
        setAlasanPenolakan(value);
    };

    const handleSubmit = async () => {
        if (!alasanPenolakan.trim()) {
            alert("Alasan penolakan wajib diisi");
            return;
        }

        if (alasanPenolakan.trim().length < 20) {
            alert("Alasan penolakan minimal 20 karakter");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(alasanPenolakan);
            closeModal();
        } catch (error) {
            console.error("Gagal menolak janji temu:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={!isSubmitting && closeModal} className="max-w-[500px]">
            <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Tolak Janji Temu
                </h4>

                {janjiTemu && (
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Mahasiswa</p>
                                <p className="font-medium">{janjiTemu.nama_mahasiswa}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">NRP</p>
                                <p className="font-medium">{janjiTemu.nrp}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tipe Konsultasi</p>
                                <p className="font-medium capitalize">{janjiTemu.tipe_konsultasi}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Pengajuan</p>
                                <p className="font-medium">
                                    {new Date(janjiTemu.tanggal_pengajuan).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <Label htmlFor="alasanPenolakan" required>
                        Alasan Penolakan
                    </Label>
                    <TextArea
                        id="alasanPenolakan"
                        value={alasanPenolakan}
                        onChange={handleTextAreaChange}
                        placeholder="Masukkan alasan penolakan (minimal 20 karakter)"
                        rows={5}
                        className="w-full"
                        disabled={isSubmitting}
                        hint={alasanPenolakan.length > 0 ? `${alasanPenolakan.length}/200 karakter` : ""}
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={closeModal}
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!alasanPenolakan || alasanPenolakan.trim().length < 10 || isSubmitting}
                        className="bg-error-500"
                        loading={isSubmitting}
                    >
                        Tolak Janji Temu
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default RejectReasonModal;