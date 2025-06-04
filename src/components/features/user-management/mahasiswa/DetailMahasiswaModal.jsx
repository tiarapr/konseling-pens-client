import { Modal } from "../../../ui/modal";
import Button from "../../../ui/button/Button";
import Label from "../../../form/Label";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DetailMahasiswaModal({ isOpen, closeModal, mahasiswa }) {
    if (!mahasiswa) return null;

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
            <div className="w-full overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Detail Mahasiswa
                </h4>
                <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
                    Informasi lengkap mahasiswa.
                </p>

                <div className="grid grid-cols-1 gap-4 text-sm lg:grid-cols-2 space-y-3">
                    <div>
                        <Label>Nama Lengkap</Label>
                        <p className="mt-1 text-gray-500 dark:text-white/90">{mahasiswa.nama_lengkap}</p>
                    </div>
                    <div>
                        <Label>NRP</Label>
                        <p className="mt-1 text-gray-500 dark:text-white/90">{mahasiswa.nrp}</p>
                    </div>
                    <div>
                        <Label>Tanggal Lahir</Label>
                        <p className="mt-1 text-gray-500 dark:text-white/90">{formatDate(mahasiswa.tanggal_lahir)}</p>
                    </div>
                    <div>
                        <Label>Jenis Kelamin</Label>
                        <p className="mt-1 text-gray-500 dark:text-white/90">{mahasiswa.jenis_kelamin === "P" ? "Perempuan" : "Laki-Laki"}</p>
                    </div>
                    <div>
                        <Label>Program Studi</Label>
                        <p className="mt-1 text-gray-500 dark:text-white/90">{mahasiswa.program_studi.nama}</p>
                    </div>
                    <div>
                        <Label>Status Verifikasi</Label>
                        <p className="mt-1 text-gray-500 dark:text-white/90">{mahasiswa.status_verifikasi.label}</p>
                    </div>

                    {mahasiswa.ktm_url && (
                        <div className="lg:col-span-2">
                            <Label>Kartu Tanda Mahasiswa (KTM)</Label>
                            <img
                                src={`${BASE_URL}${mahasiswa.ktm_url}`}
                                alt="KTM"
                                className="mt-2 max-w-xs rounded shadow-md border"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="outline" size="sm" onClick={closeModal}>
                        Tutup
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
