import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DataTable from "@/components/tables/DataTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import api from "@/api/api";
import { Link } from "react-router";
import Tabs from "@/components/common/Tabs";
import DetailMahasiswaModal from "@/features/user-management/mahasiswa/components/modals/DetailMahasiswaModal";

export default function KemahasiswaanKonselingList() {
    const [konselingList, setKonselingList] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const statusTabs = [
        { label: "Semua", value: "all" },
        { label: "Dijadwalkan", value: "dijadwalkan" },
        { label: "Dijadwalkan Ulang", value: "dijadwalkan_ulang" },
        { label: "Berlangsung", value: "berlangsung" },
        { label: "Dibatalkan", value: "dibatalkan" },
        { label: "Dibatalkan Otomatis", value: "dibatalkan_otomatis" },
        { label: "Selesai", value: "selesai" },
    ];

    const fetchKonseling = async () => {
        try {
            const response = await api.get("/konseling");
            const konseling = response.data.data.konseling;
            setKonselingList(konseling);
        } catch (error) {
            console.error("Error fetching konseling data:", error);
        }
    };

    useEffect(() => {
        fetchKonseling();
    }, []);

    const normalizeStatus = (status) => status.toLowerCase().replace(/\s+/g, "_");

    const filteredData = selectedStatus === "all"
        ? konselingList
        : konselingList.filter(k => normalizeStatus(k.status.name) === selectedStatus);

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

    const columns = [
        {
            key: "mahasiswa",
            title: "Nama Mahasiswa",
            sortable: true,
            render: (item) => (
                <a onClick={() => openDetailModal(item.mahasiswa.nrp)} className="underline hover:text-brand-500">{item.mahasiswa.nama}</a>
            ),
            exportRenderer: (item) => item.mahasiswa.nama
        },
        {
            key: "konselor",
            title: "Nama Konselor",
            sortable: true,
            render: (item) => (
                <Link to='/kemahasiswaan-dashboard/konselor'>
                    <a className="underline hover:text-brand-500">{item.konselor}</a>
                </Link>
            ),
            exportRenderer: (item) => item.konselor
        },
        {
            key: "tipe_konsultasi",
            title: "Tipe Konsultasi",
            sortable: true,
            render: (item) => {
                return item.tipe_konsultasi === "online"
                    ? "Online"
                    : item.tipe_konsultasi === "offline"
                        ? "Offline"
                        : "Tidak Diketahui";
            },
            exportRenderer: (item) => item.tipe_konsultasi
        },
        {
            key: "tanggal_konseling",
            title: "Tanggal",
            sortable: true,
            render: (item) => {
                return new Date(item.tanggal_konseling).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
            }
        },
        {
            key: "jam_konseling",
            title: "Jam Konseling",
            sortable: false,
            render: (item) => `${item.jam_mulai} - ${item.jam_selesai}`,
        },
        {
            key: "lokasi",
            title: "Lokasi",
            sortable: true,
        },
        {
            key: "status",
            title: "Status",
            sortable: true,
            render: (item) => (
                <div className="w-36">
                    <Badge
                        size="sm"
                        color={item.status.warna}
                    >
                        {item.status.name}
                    </Badge>
                </div>
            ),
            exportRenderer: (item) => item.status.name
        },
        {
            key: "status_kehadiran",
            title: "Status Kehadiran",
            sortable: true,
            render: (item) => (
                <div className="w-34">
                    <Badge
                        size="sm"
                        color={
                            item.status_kehadiran === true
                                ? "success"
                                : item.status_kehadiran === false
                                    ? "error"
                                    : "warning"
                        }
                    >
                        {item.status_kehadiran === true
                            ? "Hadir"
                            : item.status_kehadiran === false
                                ? "Tidak Hadir"
                                : "Belum Dikonfirmasi"}
                    </Badge>
                </div>
            ),
            exportRenderer: (item) =>
                item.status_kehadiran === true
                    ? "Hadir"
                    : item.status_kehadiran === false
                        ? "Tidak Hadir"
                        : "Belum Dikonfirmasi"
        },
    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Konseling"
                description="Halaman data konseling mahasiswa"
            />
            <PageBreadcrumb pageTitle="Manajemen Konseling" />
            <div className="space-y-6">
                <ComponentCard title="Data Konseling Mahasiswa">
                    <Tabs tabs={statusTabs} activeTab={selectedStatus} onChange={setSelectedStatus} />
                    <DataTable
                        data={filteredData}
                        columns={columns}
                        defaultSort={{ key: "tanggal_konseling", direction: "desc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                        exportFileName="konseling-data"
                    />
                </ComponentCard>
            </div>
            {/* Detail Mahasiswa Modal */}
            <DetailMahasiswaModal
                isOpen={isDetailModalOpen}
                closeModal={() => setIsDetailModalOpen(false)}
                mahasiswa={selectedStudent}
            />
        </>
    );
};
