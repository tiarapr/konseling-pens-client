import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import DataTable from "../../../components/tables/DataTables/DataTable";
import Badge from "../../../components/ui/badge/Badge";
import api from "../../../api/api";
import UpdateStatusModal from "../../../components/features/konseling/UpdateStatusModal";
import { Link } from "react-router";

const KonselingKonselor = () => {
    const [konselingList, setKonselingList] = useState([]);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatusData, setSelectedStatusData] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);

    // Fetch Konseling data
    const fetchKonseling = async () => {
        try {
            const response = await api.get("/konseling/my");
            const konseling = response.data.data.konseling;

            // Filter for scheduled or ongoing sessions
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
    }, []);

    const handleUpdateStatus = async (item) => {
        try {
            const res = await api.get("/status");
            setStatusOptions(res.data.data.status);  // Save available status options
            setSelectedStatusData(item); // Save the selected item for status update
            setShowStatusModal(true); // Show modal for status update
        } catch (error) {
            console.error("Failed to load status options:", error);
        }
    };

    const handleSubmitStatusUpdate = async (data) => {
        try {
            // Send patch request to update the status
            await api.patch(`/konseling/${data.id}/status`, { status_id: data.status_id });
            fetchKonseling(); // Refresh the table data
            setShowStatusModal(false); // Close modal after successful update
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const columns = [
        {
            key: "mahasiswa",
            title: "Nama Mahasiswa",
            sortable: true,
            render: (item) => {
                return (
                    <Link to={`/konselor-dashboard/mahasiswa/${item.mahasiswa.nrp}/rekam-medis`}>
                        <span className="text-brand-500 underline">{item.mahasiswa.nama}</span>
                    </Link>
                );
            },
        },
        {
            key: "konselor",
            title: "Nama Konselor",
            sortable: true,
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
            },
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
                <Badge size="sm" color={item?.status?.warna}>
                    {item?.status?.name || "Status Tidak Diketahui"}
                </Badge>
            ),
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
                        onClick={() => handleUpdateStatus(item)}
                        className="px-2 py-1 text-green-700 border border-green-700 rounded hover:bg-green-700 hover:text-white"
                    >
                        Update Status
                    </button>
                    {item.status.name.toLowerCase() === "berlangsung" && (
                        <a
                            href={`/konseling/${item.id}/catatan`}
                            className="px-2 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white text-center"
                        >
                            + Catatan Konseling
                        </a>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Manajemen Konseling"
                description="Kelola data konseling mahasiswa"
            />
            <PageBreadcrumb pageTitle="Manajemen Konseling" />
            <div className="space-y-6">
                <ComponentCard title="Data Konseling Mahasiswa">
                    <DataTable
                        data={konselingList}
                        columns={columns}
                        defaultSort={{ key: "tanggal_konseling", direction: "desc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                    />
                </ComponentCard>
            </div>
            <UpdateStatusModal
                isOpen={showStatusModal}
                closeModal={() => setShowStatusModal(false)}
                selectedData={selectedStatusData}
                statusOptions={statusOptions}
                onSubmit={handleSubmitStatusUpdate}
            />
        </>
    );
};

export default KonselingKonselor;
