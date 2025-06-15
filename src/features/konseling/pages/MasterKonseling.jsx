import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DataTable from "@/components/tables/DataTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import api from "@/api/api";
import SetJadwalModal from "../components/modals/SetJadwalModal";
import UpdateStatusModal from "../components/modals/UpdateStatusModal";
import { Link } from "react-router";
import Tabs from "@/components/common/Tabs";

export default function MasterKonseling() {
    const [konselingList, setKonselingList] = useState([]);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedJanjiTemu, setSelectedJanjiTemu] = useState(null);
    const [konselorOptions, setKonselorOptions] = useState([]);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatusData, setSelectedStatusData] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");

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

    const handleEdit = (item) => {
        setSelectedJanjiTemu(item);
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
                <Link to='/admin-dashboard/mahasiswa'>
                    <a className="underline hover:text-brand-500">{item.mahasiswa}</a>
                </Link>
            ),
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
            }
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
            )
        },
        {
            key: "status_kehadiran",
            title: "Status Kehadiran",
            sortable: true,
            render: (item) => (
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
            ),
        },
        {
            key: "aksi",
            title: "Aksi",
            render: (item) => (
                <div className="flex flex-col w-full space-x-2 gap-3">
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
                    {item.status.name.toLowerCase() === "berlangsung" && (
                        <a
                            href={`/master-dashboard/konseling/${item.id}/catatan`}
                            className="px-2 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white text-center"
                        >
                            + Catatan Konseling
                        </a>
                    )}
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
                    />
                </ComponentCard>
            </div>
            <SetJadwalModal
                isOpen={showRescheduleModal}
                closeModal={() => setShowRescheduleModal(false)}
                janjiTemu={selectedJanjiTemu}
                onSubmit={async (updatedData) => {
                    console.log("Data yang dikirim:", updatedData);
                    await api.put(`/konseling/${updatedData.janji_temu_id}/reschedule`, updatedData);
                    fetchKonseling();
                }}
                konselorOptions={konselorOptions}
            />
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
