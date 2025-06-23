import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DataTable from "@/components/tables/DataTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import api from "@/api/api";
import { FaStar } from "react-icons/fa";

export default function AdminRiwayatKonseling() {
    const [konselingList, setKonselingList] = useState([]);

    // Fetch konseling data
    const fetchKonseling = async () => {
        try {
            const response = await api.get("/konseling");
            const konseling = response.data.data.konseling;

            // Filter untuk hanya menampilkan status dijadwalkan, dijadwalkan ulang, atau berlangsung
            const filteredKonseling = konseling.filter((item) => {
                const validStatuses = ["selesai", "dibatalkan", "dibatalkan otomatis"];
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

    const columns = [
        {
            key: "mahasiswa.nama",
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
                <Badge size="sm" color={item.status.warna}>
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
            exportRenderer: (item) =>
                item.status_kehadiran === true
                    ? "Hadir"
                    : item.status_kehadiran === false
                        ? "Tidak Hadir"
                        : "Belum Dikonfirmasi"
        },
        {
            key: "rating",
            title: "Rating",
            sortable: false,
            render: (item) =>
                item.rating ? (
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={`h-5 w-5 ${index < item.rating.nilai ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">({item.rating.nilai}/5)</span>
                    </div>
                ) : (
                    <span className="text-gray-400">Belum ada rating</span>
                ),
            exportRenderer: (item) =>
                item.rating && typeof item.rating.nilai === "number"
                    ? `${item.rating.nilai} / 5`
                    : "Belum ada rating"
        },

    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Riwayat Konseling"
                description="Halaman riwayat konseling mahasiswa"
            />
            <PageBreadcrumb pageTitle="Manajemen Konseling" />
            <div className="space-y-6">
                <ComponentCard title="Data Riwayat Konseling Mahasiswa">
                    <DataTable
                        data={konselingList}
                        columns={columns}
                        defaultSort={{ key: "tanggal_konseling", direction: "desc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                        exportFileName="riwayat-konseling-data"
                    />
                </ComponentCard>
            </div>
        </>
    );
};
