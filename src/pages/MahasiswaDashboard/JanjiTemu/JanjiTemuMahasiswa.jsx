import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import DataTable from "../../../components/tables/DataTables/DataTable";
import Badge from "../../../components/ui/badge/Badge";
import api from "../../../api/api";

const JanjiTemuMahasiswa = () => {
    const [janjiTemuList, setJanjiTemuList] = useState([]);

    const fetchJanjiTemu = async () => {
        try {
            const response = await api.get("/janji-temu/me");
            const janjiTemu = response.data.data.janjiTemu;
            setJanjiTemuList(janjiTemu);
        } catch (error) {
            console.error("Error fetching janji temu data:", error);
        }
    };

    useEffect(() => {
        fetchJanjiTemu();
    }, []);

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
            )
        }
    ];

    return (
        <>
            <PageMeta
                title="Manajemen Janji Temu | Dashboard"
                description="Kelola data janji temu mahasiswa"
            />
            <PageBreadcrumb pageTitle="Janji Temu" />
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
                        addButtonText="+ Pengajuan Janji Temu"
                        addButtonLink="/dashboard/janji-temu/new"
                    />
                </ComponentCard>
            </div>
        </>
    );
};

export default JanjiTemuMahasiswa;
