import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DataTable from "@/components/tables/DataTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import DetailMahasiswaModal from "@/features/user-management/mahasiswa/components/modals/DetailMahasiswaModal";
import api from "@/api/api";
import Tabs from "@/components/common/Tabs";
import { Link } from "react-router";

export default function KemahasiswaanJanjiTemuList() {
    const [janjiTemuList, setJanjiTemuList] = useState([]);
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
        }
    };

    useEffect(() => {
        fetchJanjiTemu();
    }, []);


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

    const filteredData = selectedStatus === "all"
        ? janjiTemuList
        : janjiTemuList.filter(j => j.status === selectedStatus);

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
            key: "alasan_penolakan",
            title: "Alasan Penolakan",
            sortable: true,
            render: (item) => (
                <div className="w-32">
                    {item.alasan_penolakan != null ? (
                        <span className="text-red-500">{item.alasan_penolakan}</span>
                    ) : (
                        <span className="text-gray-400 italic">Tidak ada alasan penolakan</span>
                    )}
                </div>
            ),
            exportRenderer: (item) => item.alasan_penolakan
        }
    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Manajemen Janji Temu"
                description="Halaman kelola data janji temu mahasiswa"
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
        </>
    );
};
