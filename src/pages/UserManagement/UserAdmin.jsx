import React, { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTable from "../../components/tables/DataTables/DataTable";
import Badge from "../../components/ui/badge/Badge";
import api from "../../api/api";
import EditAdminModal from "../../components/features/user-management/admin/EditAdminModal";
import AddAdminModal from "../../components/features/user-management/admin/AddAdminModal";
import { ToastContainer } from "react-toastify";

const Admin = () => {
    const [admins, setAdmins] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const openAddModal = () => setAddModalOpen(true);
    const closeAddModal = () => setAddModalOpen(false);

    // Fetch admin data (admins)
    const fetchAdmins = async () => {
        try {
            const response = await api.get("/admin");
            const admins = response.data.data.admins;
            setAdmins(admins);
        } catch (error) {
            console.error("Error fetching mahasiswa data:", error);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);


    const openEditModal = (admin) => {
        setSelectedAdmin(admin);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedAdmin(null);
    };

    // Function to handle the removal of a admin
    const removeAdmin = async (adminId) => {
        try {
            const response = await api.delete(`/admin/account/${adminId}`);
            if (response.status === 200) {
                setAdmins(prevData => prevData.filter(admin => admin.id !== adminId));
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
            )
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
            render: (item) => (
                <div className="flex space-x-2">
                    <button
                        className="px-4 py-1 text-blue-600 bg-transparent border border-brand-500 rounded hover:bg-brand-500 hover:text-white"
                        onClick={() => openEditModal(item)}
                    >
                        Edit
                    </button>
                    <button
                        className="px-4 py-1 text-red-600 bg-transparent border border-red-500 rounded hover:bg-red-500 hover:text-white"
                        onClick={() => removeAdmin(item.id)}
                    >
                        Remove
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Management Admin"
                description="Manage admin data"
            />
            <PageBreadcrumb pageTitle="Manajemen Admin" />
            <div className="space-y-6">
                <ComponentCard title="Data Admin">
                    <DataTable
                        data={admins}
                        columns={columns}
                        defaultSort={{ key: "nrp", direction: "asc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                        onAddClick={openAddModal}
                    />
                </ComponentCard>
            </div>
            <ToastContainer/>
            <AddAdminModal
                isOpen={addModalOpen}
                closeModal={closeAddModal}
                onSubmitSuccess={fetchAdmins}
            />
            <EditAdminModal
                isOpen={editModalOpen}
                closeModal={closeEditModal}
                selectedData={selectedAdmin}
                onSubmitSuccess={fetchAdmins}
            />
        </>
    );
};

export default Admin;
