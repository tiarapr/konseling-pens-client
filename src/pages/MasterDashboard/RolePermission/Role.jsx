import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import DataTable from "../../../components/tables/DataTables/DataTable";
import api from "../../../api/api";
import AddRoleModal from "../../../components/features/role/AddRoleModal";
import EditRoleModal from "../../../components/features/role/EditRoleModal";
import { toast } from "react-toastify";

const Role = () => {
    const [roleData, setRoleData] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const openAddModal = () => setAddModalOpen(true);
    const closeAddModal = () => setAddModalOpen(false);

    const fetchRoles = async () => {
        try {
            const response = await api.get("/role");
            const admins = response.data.data.role;
            setRoleData(admins);
        } catch (error) {
            console.error("Error fetching mahasiswa data:", error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const openEditModal = (admin) => {
        setSelectedRole(admin);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedRole(null);
    };

    // Function to handle the removal of a role
    const removeRole = async (roleId) => {
        try {
            const response = await api.delete(`/role/${roleId}`);
            if (response.status === 200) {
                toast.success("Role berhasil dihapus.");
                fetchRoles();
            }
        } catch (error) {
            console.error("Error deleting role:", error);
            toast.error("Gagal menghapus role.");
        }
    };

    const columns = [
        {
            key: "name",
            title: "Role",
            sortable: true,
        },
        {
            key: "action",
            title: "Action",
            render: (item) => (
                <div className="flex space-x-2">
                    <button
                        className="px-4 py-1 text-blue-600 bg-transparent border border-brand-500 rounded hover:bg-brand-500 hover:text-white dark:bg-brand-500 dark:text-white"
                        onClick={() => openEditModal(item)}
                    >
                        Edit
                    </button>
                    <button
                        className="px-4 py-1 text-red-600 bg-transparent border border-red-500 rounded hover:bg-red-500 hover:text-white dark:bg-red-500 dark:text-white"
                        onClick={() => {
                            if (confirm("Yakin ingin menghapus role ini?")) {
                                removeRole(item.id);
                            }
                        }}
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
                title="Konseling PENS Dashboard | Role Management"
                description="Manage roles."
            />
            <PageBreadcrumb pageTitle="Manajemen Role dan Permissions" />
            <div className="space-y-6">
                <ComponentCard title="Data Role">
                    <DataTable
                        data={roleData}
                        columns={columns}
                        defaultSort={{ key: "name", direction: "asc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                        onAddClick={openAddModal}
                    />
                </ComponentCard>
            </div>
            <AddRoleModal
                isOpen={addModalOpen}
                closeModal={closeAddModal}
                onSubmitSuccess={fetchRoles}
            />
            <EditRoleModal
                isOpen={editModalOpen}
                closeModal={closeEditModal}
                selectedData={selectedRole}
                onSubmitSuccess={fetchRoles}
            />
        </>
    );
};

export default Role;
