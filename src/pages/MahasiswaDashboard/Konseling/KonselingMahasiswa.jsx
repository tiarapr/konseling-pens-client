import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import DataTable from "../../../components/tables/DataTables/DataTable";
import Badge from "../../../components/ui/badge/Badge";
import api from "../../../api/api";

const KonselingMahasiswa = () => {
    const [konselingList, setKonselingList] = useState([]);

    const fetchKonseling = async () => {
        try {
            const response = await api.get("/konseling/me");
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
    }, []);

    const handleKonfirmasi = async (id) => {
        try {
            await api.patch(`/konseling/${id}/konfirmasi-kehadiran`, {
                status_kehadiran: true
            });
            await fetchKonseling(); // Refresh data
        } catch (error) {
            console.error("Gagal mengonfirmasi kehadiran:", error);
        }
    };

    const handleTolak = async (id) => {
        try {
            await api.patch(`/konseling/${id}/konfirmasi-kehadiran`, {
                status_kehadiran: false
            });
            await fetchKonseling(); // Refresh data
        } catch (error) {
            console.error("Gagal menolak kehadiran:", error);
        }
    };

    const columns = [
        {
            key: "mahasiswa",
            title: "Nama Mahasiswa",
            sortable: true,
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
            render: (item) => {
                if (item.status_kehadiran === null) {
                    return (
                        <div className="flex space-x-2">
                            <button
                                className="px-4 py-1 text-green-600 border border-green-500 rounded hover:bg-green-500 hover:text-white"
                                onClick={() => handleKonfirmasi(item.id)}
                            >
                                Hadir
                            </button>
                            <button
                                className="px-4 py-1 text-red-600 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                                onClick={() => handleTolak(item.id)}
                            >
                                Tidak
                            </button>
                        </div>
                    );
                }

                return (
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
                );
            }
        },
    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Konseling"
                description="Halaman data konseling mahasiswa"
            />
            <PageBreadcrumb pageTitle="Konseling" />
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
        </>
    );
};

export default KonselingMahasiswa;
