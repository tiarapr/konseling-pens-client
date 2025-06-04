import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import DataTable from "../../../components/tables/DataTables/DataTable";
import Badge from "../../../components/ui/badge/Badge";
import api from "../../../api/api";
import { Link } from "react-router-dom";
import RatingModal from "../../../components/features/rating/RatingModal";
import { FaStar } from "react-icons/fa";

const RiwayatKonselingMahasiswa = () => {
    const [konselingList, setKonselingList] = useState([]);
    const [catatanList, setCatatanList] = useState([]);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedKonselingId, setSelectedKonselingId] = useState(null);

    // Fetch konseling data
    const fetchKonseling = async () => {
        try {
            const response = await api.get("/konseling/me");
            const konseling = response.data.data.konseling;

            // Filter untuk hanya menampilkan status dijadwalkan, dijadwalkan ulang, atau berlangsung
            const filteredKonseling = konseling.filter((item) => {
                const validStatuses = ["selesai", "dibatalkan", "dibatalkan otomatis"];
                return validStatuses.includes(item.status.name.toLowerCase());
            });

            setKonselingList(filteredKonseling);

            // Fetch data catatan konseling berdasarkan konseling_id dengan API /catatan-konseling/konseling/:id
            const catatanPromises = filteredKonseling.map((item) =>
                api.get(`/catatan-konseling/own/konseling/${item.id}`).then((res) => {
                    // Ambil catatan konseling pertama jika ada
                    const catatan = res.data.data.catatan_konseling[0]; // Mengakses objek pertama langsung
                    return catatan || null; // Kembalikan null jika tidak ada catatan
                })
            );

            // Tunggu sampai semua request selesai dan simpan data catatan konseling
            const catatanResponses = await Promise.all(catatanPromises);
            setCatatanList(catatanResponses);
        } catch (error) {
            console.error("Error fetching konseling data:", error);
        }
    };

    useEffect(() => {
        fetchKonseling();
    }, []);

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
                <div className="w-36">
                    <Badge size="sm" color={item.status.warna}>
                        {item.status.name}
                    </Badge>
                </div>
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
            key: "catatan_konseling",
            title: "Catatan Konseling",
            render: (item) => {
                const catatan = catatanList.find((cat) => cat && cat.konseling_id === item.id); // Dapatkan catatan konseling yang cocok
                return catatan ? (
                    <Link to={`/dashboard/catatan-konseling/${catatan.id}`}>
                        Detail
                    </Link>
                ) : (
                    <span className="text-gray-400">Catatan tidak tersedia</span>
                );
            },
        },
        {
            key: "rating",
            title: "Rating",
            sortable: false,
            render: (item) => {
                if (item.rating) {
                    return (
                        <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        className={`h-5 w-5 ${index < item.rating.nilai ? "text-yellow-400" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">({item.rating.nilai}/5)</span>
                        </div>
                    );
                } else if (item.status.name.toLowerCase() === "selesai") {
                    return (
                        <button
                            className="text-blue-600 underline"
                            onClick={() => {
                                setSelectedKonselingId(item.id);
                                setShowRatingModal(true);
                            }}
                        >
                            Beri Rating
                        </button>
                    );
                } else {
                    return <span className="text-gray-400">Tidak Tersedia</span>;
                }
            },
        },

    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Riwayat Konseling"
                description="Halaman riwayat konseling mahasiswa"
            />
            <PageBreadcrumb pageTitle="Riwayat Konseling" />
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
                    />
                </ComponentCard>
            </div>
            <RatingModal
                isOpen={showRatingModal}
                closeModal={() => setShowRatingModal(false)}
                konselingId={selectedKonselingId}
                onSuccess={fetchKonseling}
            />
        </>
    );
};

export default RiwayatKonselingMahasiswa;
