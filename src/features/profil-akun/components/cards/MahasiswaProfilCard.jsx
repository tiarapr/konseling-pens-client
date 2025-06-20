import { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Badge from "@/components/ui/badge/Badge";
import api from "@/api/api";
import Alert from "@/components/ui/alert/Alert";
import { Link } from "react-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MahasiswaProfilCard() {
    const [mahasiswa, setMahasiswa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchMahasiswa = async () => {
        try {
            const response = await api.get("/mahasiswa/me");
            setMahasiswa(response.data.data.mahasiswa);
        } catch (err) {
            setError("Gagal mengambil data mahasiswa.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMahasiswa();
    }, []);

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleMintaTinjau = async () => {
        setSubmitting(true);
        try {
            await api.put(`/mahasiswa/${mahasiswa.id}/tinjau-ulang`);
            alert("Permintaan tinjau ulang berhasil dikirim.");
            fetchMahasiswa();
        } catch (err) {
            console.error("Gagal meminta tinjau ulang:", err);
            alert("Terjadi kesalahan saat mengirim permintaan.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="p-4">Memuat data...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;
    if (!mahasiswa) return <p className="p-4">Data mahasiswa tidak ditemukan</p>;

    const isTinjau = ["Revisi Diperlukan", "Verifikasi Ditolak"].includes(mahasiswa.status_verifikasi?.label);

    return (
        <div className="p-5 border border-gray-200 rounded-sm dark:border-gray-800 lg:p-6 relative">
            {/* Data Pribadi */}
            <div className="mb-8">
                <div className="flex flex-col xl:flex-row justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                            Data Pribadi
                        </h2>
                    </div>

                    <div className="flex gap-2 space-y-4 mb-2">
                        {isTinjau && (
                            <button
                                onClick={handleMintaTinjau}
                                disabled={submitting}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? "Memproses..." : "Minta Tinjau Ulang"}
                            </button>
                        )}
                        <Link to={`/dashboard/mahasiswa/${mahasiswa.id}/edit`}>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                            >
                                <svg
                                    className="fill-current"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Edit Data
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700" />

                {isTinjau && (
                    <>
                        <div className="my-8">
                            <Alert variant="warning" title="Perbarui profil dengan data yang valid. Setelah memperbarui profil, minta tinjauan. Atau akun anda akan dinonaktifkan." />
                        </div>
                    </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2 mt-4">
                    <div className="space-y-1">
                        <Label>Nama Lengkap</Label>
                        <p className="text-gray-700 dark:text-white/90">{mahasiswa.nama_lengkap}</p>
                    </div>
                    <div className="space-y-1">
                        <Label>NRP</Label>
                        <p className="text-gray-700 dark:text-white/90">{mahasiswa.nrp}</p>
                    </div>
                    <div className="space-y-1">
                        <Label>Tanggal Lahir</Label>
                        <p className="text-gray-700 dark:text-white/90">{formatDate(mahasiswa.tanggal_lahir)}</p>
                    </div>
                    <div className="space-y-1">
                        <Label>Jenis Kelamin</Label>
                        <p className="text-gray-700 dark:text-white/90">
                            {mahasiswa.jenis_kelamin === "P" ? "Perempuan" : "Laki-Laki"}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <Label>Status Verifikasi</Label>
                        <Badge
                            size="sm"
                            color={mahasiswa.status_verifikasi ? mahasiswa.status_verifikasi.warna : "gray"}
                        >
                            {mahasiswa.status_verifikasi ? mahasiswa.status_verifikasi.label : "Unknown Status"}
                        </Badge>
                    </div>
                    <div className="space-y-1">
                        <Label>Catatan Verifikasi</Label>
                        <p className="text-gray-700 dark:text-white/90">{mahasiswa.catatan_verifikasi || "-"}</p>
                    </div>
                </div>
            </div>

            {/* Data Akademik */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    Data Akademik
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-3">
                    <div className="space-y-1">
                        <Label>Program Studi</Label>
                        <p className="text-gray-700 dark:text-white/90">
                            {mahasiswa.program_studi?.jenjang || "-"} {mahasiswa.program_studi?.nama_program_studi || "-"}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <Label>Departemen</Label>
                        <p className="text-gray-700 dark:text-white/90">
                            {mahasiswa.program_studi?.departement || "-"}
                        </p>
                    </div>
                </div>
            </div>

            {/* KTM */}
            {mahasiswa.ktm_url && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            EEPIS SMARTCARD
                        </h3>
                    </div>
                    <div className="w-full max-w-xs overflow-hidden border border-gray-200 rounded-sm dark:border-gray-700">
                        <img
                            src={`${mahasiswa.ktm_url}`}
                            alt="Kartu Tanda Mahasiswa"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}