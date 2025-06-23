import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DataTable from "@/components/tables/DataTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import SetJadwalModal from "@/features/konseling/components/modals/SetJadwalModal";
import AlasanPenolakanModal from "../components/modals/AlasanPenolakanModal";
import DetailMahasiswaModal from "@/features/user-management/mahasiswa/components/modals/DetailMahasiswaModal";
import Tabs from "@/components/common/Tabs";
import api from "@/api/api";
import { useModal } from "@/hooks/useModal";
import { toast } from "react-toastify";

export default function MasterManajemenJanjiTemu() {
    const [janjiTemuList, setJanjiTemuList] = useState([]);
    const [konselorList, setKonselorList] = useState([]);
    const [konselingList, setKonselingList] = useState([]);
    const { isOpen, openModal, closeModal } = useModal();
    const { isOpen: isRejectModalOpen, openModal: openRejectModal, closeModal: closeRejectModal } = useModal();
    const [selectedJanjiTemu, setSelectedJanjiTemu] = useState(null);
    const [janjiTemuToReject, setJanjiTemuToReject] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const statusTabs = [
        { label: "Semua", value: "all" },
        { label: "Menunggu", value: "menunggu_konfirmasi" },
        { label: "Dikonfirmasi", value: "dikonfirmasi" },
        { label: "Ditolak", value: "ditolak" },
    ];

    const fetchJanjiTemu = async () => {
        try {
            const response = await api.get("/janji-temu");
            const janjiTemu = response.data.data.janjiTemu;
            setJanjiTemuList(janjiTemu);
        } catch (error) {
            console.error("Error fetching janji temu data:", error);
            toast.error("Gagal mengambil data janji temu");
        }
    };

    const filteredData = selectedStatus === "all"
        ? janjiTemuList
        : janjiTemuList.filter(j => j.status === selectedStatus);

    const fetchKonselors = async () => {
        try {
            const res = await api.get("/konselor");
            setKonselorList(res.data.data.konselors);
        } catch (error) {
            console.error("Error fetching konselor data:", error);
            toast.error("Gagal mengambil data konselor");
        }
    };

    const fetchKonseling = async () => {
        try {
            const response = await api.get("/konseling");
            setKonselingList(response.data.data.konseling);
        } catch (error) {
            console.error("Error fetching konseling data:", error);
            toast.error("Gagal mengambil data konseling");
        }
    };

    const openDetailModal = async (nrp) => {
        try {
            const res = await api.get(`/mahasiswa/nrp/${nrp}`);
            const detail = res.data.data.mahasiswa;
            setSelectedStudent(detail);
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error("Gagal mengambil detail mahasiswa:", error);
        }
    };

    useEffect(() => {
        fetchJanjiTemu();
        fetchKonselors();
        fetchKonseling();
    }, []);

    const updateStatus = async (id, status, alasan_penolakan = null) => {
        try {
            const payload = { status };

            // Jika status ditolak, tambahkan alasan penolakan
            if (status === "ditolak") {
                if (!alasan_penolakan) {
                    throw new Error("Alasan penolakan wajib diisi");
                }
                payload.alasan_penolakan = alasan_penolakan;
            }

            await api.put(`/janji-temu/${id}/status`, payload);
            fetchJanjiTemu();
            toast.success(`Status berhasil diubah menjadi ${status}`);
        } catch (error) {
            console.error(`Gagal mengupdate status ke ${status}:`, error);
            toast.error(error.response?.data?.message || error.message || "Gagal mengupdate status");
        }
    };

    const handleKonfirmasi = (id) => {
        updateStatus(id, "dikonfirmasi");
    };

    const handleTolak = (id) => {
        const janjiTemu = janjiTemuList.find((j) => j.id === id);
        setJanjiTemuToReject(janjiTemu);
        openRejectModal();
    };

    const handleConfirmReject = (alasan_penolakan) => {
        if (janjiTemuToReject) {
            updateStatus(janjiTemuToReject.id, "ditolak", alasan_penolakan);
            closeRejectModal();
        }
    };

    const handleSetJadwal = (id) => {
        const janjiTemu = janjiTemuList.find((j) => j.id === id);
        setSelectedJanjiTemu(janjiTemu);
        openModal();
    };

    const submitJadwal = async (data) => {
        try {
            await api.post("/konseling", data);
            fetchJanjiTemu();
            fetchKonseling();
            closeModal();
            toast.success("Konseling berhasil dijadwalkan");
        } catch (error) {
            console.error("Gagal menyimpan jadwal konseling:", error);
            toast.error(error.response?.data?.message || "Gagal menyimpan jadwal");
        }
    };

    const columns = [
        {
            key: "nomor_tiket",
            title: "Nomor Tiket",
            sortable: true,
        },
        {
            key: "nama_mahasiswa",
            title: "Nama Mahasiswa",
            sortable: true,
            render: (item) => (
                <a onClick={() => openDetailModal(item.nrp)} className="underline hover:text-brand-500">{item.nama_mahasiswa}</a>
            ),
            exportRenderer: (item) => item.nama_mahasiswa
        },
        {
            key: "nrp",
            title: "NRP",
            sortable: true,
        },
        {
            key: "phone_number",
            title: "No. Telp",
            sortable: true,
            render: (item) => {
                return (
                    <a
                        href={`https://wa.me/${item.phone_number}`}
                        className="underline text-green-500"
                    >
                        WhatsApp
                    </a>
                )
            },
            exportRenderer: (item) => item.phone_number
        },
        {
            key: "tipe_konsultasi",
            title: "Tipe Konsultasi",
            sortable: true,
            render: (item) => (
                <span className="capitalize">{item.tipe_konsultasi}</span>
            ),
            exportRenderer: (item) => item.tipe_konsultasi
        },
        {
            key: "nama_konselor",
            title: "Konselor",
            sortable: true,
        },
        {
            key: "jadwal_utama_tanggal",
            title: "Jadwal Utama",
            sortable: true,
            render: (item) => {
                const tanggal = new Date(item.jadwal_utama_tanggal).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                return `${tanggal}, ${item.jadwal_utama_jam_mulai} - ${item.jadwal_utama_jam_selesai}`;
            }
        },
        {
            key: "jadwal_alternatif_tanggal",
            title: "Jadwal Alternatif",
            sortable: true,
            render: (item) => {
                const tanggal = new Date(item.jadwal_alternatif_tanggal).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                return `${tanggal}, ${item.jadwal_alternatif_jam_mulai} - ${item.jadwal_alternatif_jam_selesai}`;
            }
        },
        {
            key: "tanggal_pengajuan",
            title: "Tanggal Pengajuan",
            sortable: true,
            render: (item) => {
                const tanggal = new Date(item.tanggal_pengajuan).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                return `${tanggal}`;
            }
        },
        {
            key: "status",
            title: "Status",
            sortable: true,
            render: (item) => (
                <Badge
                    size="sm"
                    color={
                        item.status === "dikonfirmasi"
                            ? "success"
                            : item.status === "menunggu_konfirmasi"
                                ? "warning"
                                : item.status === "ditolak"
                                    ? "error"
                                    : "gray"
                    }
                >
                    {item.status}
                </Badge>
            ),
            exportRenderer: (item) => item.status
        },
        {
            key: "action",
            title: "Action",
            excludeFromExport: true,
            render: (item) => {
                if (item.status === "menunggu_konfirmasi") {
                    return (
                        <div className="flex space-x-2">
                            <button
                                className="px-4 py-1 text-green-600 border border-green-500 rounded hover:bg-green-500 hover:text-white"
                                onClick={() => handleKonfirmasi(item.id)}
                            >
                                Konfirmasi
                            </button>
                            <button
                                className="px-4 py-1 text-red-600 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                                onClick={() => handleTolak(item.id)}
                            >
                                Tolak
                            </button>
                        </div>
                    );
                } else if (item.status === "dikonfirmasi") {
                    const sudahAdaKonseling = konselingList.some(k => k.janji_temu_id === item.id);

                    if (sudahAdaKonseling) {
                        return <span className="text-gray-400">Jadwal telah ditetapkan</span>;
                    }

                    return (
                        <button
                            className="px-4 py-1 text-blue-600 border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
                            onClick={() => handleSetJadwal(item.id)}
                        >
                            Set Jadwal Konseling
                        </button>
                    );
                } else if (item.status === "ditolak") {
                    return (
                        <span className="text-red-500 italic">
                            Ditolak dengan alasan:{" "}
                            {item.alasan_penolakan || (
                                <span className="text-gray-400">Tidak ada alasan penolakan</span>
                            )}
                        </span>
                    );
                } else {
                    return <span className="text-gray-400">Tidak ada aksi</span>;
                }
            },
        },
    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Janji Temu Mahasiswa"
                description="Halaman Kelola data janji temu mahasiswa"
            />
            <PageBreadcrumb pageTitle="Manajemen Janji Temu" />
            <div className="space-y-6">
                <ComponentCard title="Data Janji Temu Mahasiswa">
                    <Tabs tabs={statusTabs} activeTab={selectedStatus} onChange={setSelectedStatus} />
                    <DataTable
                        data={filteredData}
                        columns={columns}
                        defaultSort={{ key: "tanggal_pengajuan", direction: "desc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                        exportFileName="janji-temu-data"
                    />
                </ComponentCard>
            </div>
            <DetailMahasiswaModal
                isOpen={isDetailModalOpen}
                closeModal={() => setIsDetailModalOpen(false)}
                mahasiswa={selectedStudent}
            />
            <SetJadwalModal
                isOpen={isOpen}
                closeModal={closeModal}
                janjiTemu={selectedJanjiTemu}
                onSubmit={submitJadwal}
                konselorOptions={konselorList}
            />
            <AlasanPenolakanModal
                isOpen={isRejectModalOpen}
                closeModal={closeRejectModal}
                onSubmit={handleConfirmReject}
                janjiTemu={janjiTemuToReject}
            />
        </>
    );
};