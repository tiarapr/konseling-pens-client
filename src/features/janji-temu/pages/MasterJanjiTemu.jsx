import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DataTable from "@/components/tables/DataTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useModal } from "@/hooks/useModal";
import api from "@/api/api";
import { toast } from "react-toastify";
import SetJadwalModal from "@/features/konseling/components/modals/SetJadwalModal";

export default function MasterJanjiTemu() {
    const [janjiTemuList, setJanjiTemuList] = useState([]);
    const [konselorList, setKonselorList] = useState([]);
    const [konselingList, setKonselingList] = useState([]);
    const { isOpen, openModal, closeModal } = useModal();
    const [selectedJanjiTemu, setSelectedJanjiTemu] = useState(null);

    const fetchJanjiTemu = async () => {
        try {
            const response = await api.get("/janji-temu");
            const janjiTemu = response.data.data.janjiTemu;
            setJanjiTemuList(janjiTemu);
        } catch (error) {
            console.error("Error fetching janji temu data:", error);
        }
    };

    const fetchKonselors = async () => {
        const res = await api.get("/konselor");
        setKonselorList(res.data.data.konselors);
        console.log("Konselor List:", res.data.data.konselors);
    };

    const fetchKonseling = async () => {
        try {
            const response = await api.get("/konseling");
            setKonselingList(response.data.data.konseling);
        } catch (error) {
            console.error("Error fetching konseling data:", error);
        }
    };

    useEffect(() => {
        fetchJanjiTemu();
        fetchKonselors();
        fetchKonseling();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/janji-temu/${id}/status`, { status });
            // Refresh list after status update
            fetchJanjiTemu();
        } catch (error) {
            console.error(`Gagal mengupdate status ke ${status}:`, error);
        }
    };

    const handleKonfirmasi = (id) => {
        updateStatus(id, "dikonfirmasi");
    };

    const handleTolak = (id) => {
        updateStatus(id, "ditolak");
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
            toast.error("Gagal menyimpan jadwal.");
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
                <Link to='/admin-dashboard/mahasiswa'>
                    <a className="underline hover:text-brand-500">{item.nama_mahasiswa}</a>
                </Link>
            ),
        },
        {
            key: "nrp",
            title: "NRP",
            sortable: true,
        },
        {
            key: "tipe_konsultasi",
            title: "Tipe Konsultasi",
            sortable: true,
            render: (item) => (
                <span className="capitalize">{item.tipe_konsultasi}</span>
            ),
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
            key: "nama_konselor",
            title: "Konselor",
            sortable: true,
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
            )
        },
        {
            key: "action",
            title: "Action",
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
                            className="px-4 py-1 text-theme-xs text-blue-600 border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
                            onClick={() => handleSetJadwal(item.id)}
                        >
                            Set Jadwal Konseling
                        </button>
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
                title="Konseling PENS Dashboard | Manajemen Janji Temu"
                description="Kelola data janji temu mahasiswa"
            />
            <PageBreadcrumb pageTitle="Manajemen Janji Temu" />
            <div className="space-y-6">
                <ComponentCard title="Data Janji Temu Mahasiswa">
                    <DataTable
                        data={janjiTemuList}
                        columns={columns}
                        defaultSort={{ key: "tanggal_pengajuan", direction: "desc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                    />
                </ComponentCard>
            </div>
            <SetJadwalModal
                isOpen={isOpen}
                closeModal={closeModal}
                janjiTemu={selectedJanjiTemu}
                onSubmit={submitJadwal}
                konselorOptions={konselorList}
            />
        </>
    );
};
