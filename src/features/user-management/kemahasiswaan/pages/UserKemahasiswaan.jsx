import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DataTable from "@/components/tables/DataTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import api from "@/api/api";
import AddKemahasiswaanModal from "../components/modals/AddKemahasiswaanModal";
import EditKemahasiswaanModal from "../components/modals/EditKemahasiswaanModal";

const Kemahasiswaan = () => {
    const [kemahasiswaans, setKemahasiswaans] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedKemahasiswaan, setSelectedKemahasiswaan] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const openAddModal = () => setAddModalOpen(true);
    const closeAddModal = () => setAddModalOpen(false);

    // Fetch mahasiswa data (kemahasiswaans)
    const fetchKemahasiswaans = async () => {
        try {
            const response = await api.get("/kemahasiswaan");
            const kemahasiswaans = response.data.data.kemahasiswaans;
            setKemahasiswaans(kemahasiswaans);
        } catch (error) {
            console.error("Error fetching mahasiswa data:", error);
        }
    };

    useEffect(() => {
        fetchKemahasiswaans();
    }, []);

    const openEditModal = (kemahasiswaan) => {
        setSelectedKemahasiswaan(kemahasiswaan);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedKemahasiswaan(null);
    }

    // Function to handle the removal of a kemahasiswaan
    const removeKemahasiswaan = async (kemahasiswaanId) => {
        try {
            const response = await api.delete(`/kemahasiswaan/account/${kemahasiswaanId}`);
            if (response.status === 200) {
                setKemahasiswaans(prevData => prevData.filter(kemahasiswaan => kemahasiswaan.id !== kemahasiswaanId));
            }
        } catch (error) {
            console.error("Error deleting mahasiswa:", error);
        }
    };

    // Columns for DataTable
    const columns = [
        {
            key: "nama_lengkap",
            title: "Full Name",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {item.nama_lengkap}
                        </span>
                        <span className="block py-2 text-gray-500 text-theme-xs dark:text-gray-400">
                            {item.jabatan}
                        </span>
                    </div>
                </div>
            ),
            exportRenderer: (item) =>
                `${item.nama_lengkap}${item.jabatan ? ` - ${item.jabatan}` : ""}`,
        },
        {
            key: "nip",
            title: "NIP",
            sortable: true,
        },
        {
            key: "email",
            title: "Email",
            sortable: true,
        },
        {
            key: "phone_number",
            title: "Phone Number",
            sortable: true,
        },
        {
            key: "is_verified",
            title: "Email Verification Status",
            sortable: true,
            render: (item) => (
                <Badge
                    size="sm"
                    color={item.is_verified ? "success" : "error"}
                >
                    {item.is_verified ? "Sudah Verifikasi" : "Belum Verifikasi"}
                </Badge>
            ),
            exportRenderer: (item) =>
                item.is_verified ? "Sudah Verifikasi" : "Belum Verifikasi"
        },
        {
            key: "created_at",
            title: "Created At",
            sortable: true,
            render: (item) => {
                const date = new Date(item.created_at);
                return date.toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
            }
        },
        {
            key: "action",
            title: "Action",
            excludeFromExport: true,
            render: (item) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => openEditModal(item)}
                        className="px-4 py-1 text-blue-600 bg-transparent border border-brand-500 rounded hover:bg-brand-500 hover:text-white dark:bg-brand-500 dark:text-white"
                    >
                        Edit
                    </button>
                    <button
                        className="px-4 py-1 text-red-600 bg-transparent border border-red-500 rounded hover:bg-red-500 hover:text-white dark:bg-red-500 dark:text-white"
                        onClick={() => removeKemahasiswaan(item.id)}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Management Kemahasiswaan"
                description="Manage kemahasiswaan data"
            />
            <PageBreadcrumb pageTitle="Manajemen Kemahasiswaan" />
            <div className="space-y-6">
                <ComponentCard title="Data Kemahasiswaan">
                    <DataTable
                        data={kemahasiswaans}
                        columns={columns}
                        defaultSort={{ key: "nrp", direction: "asc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                        onAddClick={openAddModal}
                        exportFileName="kemahasiswaan-data"
                    />
                </ComponentCard>
            </div>
            <AddKemahasiswaanModal
                isOpen={addModalOpen}
                closeModal={closeAddModal}
                onSubmitSuccess={fetchKemahasiswaans}
            />
            <EditKemahasiswaanModal
                isOpen={editModalOpen}
                closeModal={closeEditModal}
                selectedData={selectedKemahasiswaan}
                onSubmitSuccess={fetchKemahasiswaans}
            />
        </>
    );
};

export default Kemahasiswaan;
