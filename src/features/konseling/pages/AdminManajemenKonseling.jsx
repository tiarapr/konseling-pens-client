import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DataTable from "@/components/tables/DataTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import api from "@/api/api";
import UpdateStatusModal from "../components/modals/UpdateStatusModal";
import { Link } from "react-router";
import Tabs from "@/components/common/Tabs";
import RescheduleModal from "../components/modals/RescheduleModal";

export default function AdminManajemenKonseling() {
    const [konselingList, setKonselingList] = useState([]);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedKonseling, setSelectedKonseling] = useState(null);
    const [konselorOptions, setKonselorOptions] = useState([]);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatusData, setSelectedStatusData] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const statusTabs = [
        { label: "Semua", value: "all" },
        { label: "Dijadwalkan", value: "dijadwalkan" },
        { label: "Dijadwalkan Ulang", value: "dijadwalkan_ulang" },
        { label: "Berlangsung", value: "berlangsung" },
    ];

    const fetchKonselors = async () => {
        const res = await api.get("/konselor");
        setKonselorOptions(res.data.data.konselors);
        console.log("Konselor List:", res.data.data.konselors);
    };

    const fetchKonseling = async () => {
        try {
            const response = await api.get("/konseling");
            const konseling = response.data.data.konseling;

            // Filter untuk hanya menampilkan status dijadwalkan, dijadwalkan ulang, atau berlangsung
            const filteredKonseling = konseling.filter((item) => {
                const validStatuses = ["dijadwalkan", "dijadwalkan ulang", "berlangsung"];
                return validStatuses.includes(item.status.name.toLowerCase());
            });

            setKonselingList(filteredKonseling);
        } catch (error) {
            console.error("Error fetching konseling data:", error);
        }
    };

    useEffect(() => {
        fetchKonseling();
        fetchKonselors();
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

    const handleEdit = (item) => {
        setSelectedKonseling(item);
        setShowRescheduleModal(true);
    };

    const handleUpdateStatus = async (item) => {
        try {
            const res = await api.get("/status");
            setStatusOptions(res.data.data.status);
            setSelectedStatusData(item);
            setShowStatusModal(true);
        } catch (error) {
            console.error("Gagal memuat status:", error);
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
                <Link to='/admin-dashboard/konselor'>
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
                <Badge
                    size="sm"
                    color={item.status.warna}
                >
                    {item.status.name}
                </Badge>
            ),
            exportRenderer: (item) => item.status.name
        },
        {
            key: "status_kehadiran",
            title: "Status Kehadiran",
            sortable: true,
            render: (item) => (
                <Badge
                    size="sm"
                    color={item.status_kehadiran === true
                        ? "success"
                        : item.status_kehadiran === false
                            ? "error"
                            : "warning"}
                >
                    {item.status_kehadiran === true
                        ? "Hadir"
                        : item.status_kehadiran === false
                            ? "Tidak Hadir"
                            : "Belum Dikonfirmasi"}
                </Badge>
            ),
            exportRenderer: (item) =>
                item.status_kehadiran === true
                    ? "Hadir"
                    : item.status_kehadiran === false
                        ? "Tidak Hadir"
                        : "Belum Dikonfirmasi"
        },
        {
            key: "aksi",
            title: "Aksi",
            excludeFromExport: true,
            render: (item) => (
                <div className="flex flex-col w-42 space-x-2 gap-3">
                    <button
                        onClick={() => handleEdit(item)}
                        className="px-4 py-1 text-warning-700 border border-warning-700 rounded hover:bg-warning-700 hover:text-white"
                    >
                        Reschedule
                    </button>
                    <button
                        onClick={() => handleUpdateStatus(item)}
                        className="px-2 py-1 text-brand-500 border border-brand-500 rounded hover:bg-brand-600 hover:text-white"
                    >
                        Update Status
                    </button>
                    <button
                        className="px-2 py-1 text-green-700 border border-green-700 rounded hover:bg-green-700 hover:text-white"
                    >
                        <a
                            href={`https://wa.me/${item.no_telp}`}
                        >
                            WhatsApp
                        </a>
                    </button>
                </div>
            ),
        }
    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Konseling"
                description="Halaman kelola data konseling mahasiswa dengan konselor"
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

            {/* Reschedule Modal */}
            <RescheduleModal
                isOpen={showRescheduleModal}
                closeModal={() => setShowRescheduleModal(false)}
                konseling={selectedKonseling}
                konselorOptions={konselorOptions}
                onSubmit={async (data) => {
                    try {
                        await api.put(`/konseling/${selectedKonseling.id}/reschedule`, data);
                        fetchKonseling(); // Refresh the data after rescheduling
                    } catch (error) {
                        console.error("Failed to reschedule:", error);
                    }
                }}
            />

            {/* Update Status Modal */}
            <UpdateStatusModal
                isOpen={showStatusModal}
                closeModal={() => setShowStatusModal(false)}
                selectedData={selectedStatusData}
                statusOptions={statusOptions}
                onSubmit={async (data) => {
                    try {
                        await api.patch(`/konseling/${data.id}/status`, { status_id: data.status_id });
                        fetchKonseling(); // Refresh tabel
                    } catch (error) {
                        console.error("Gagal update status:", error);
                    }
                }}
            />
        </>
    );
};
