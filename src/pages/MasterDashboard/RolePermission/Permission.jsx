import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import DataTable from "../../../components/tables/DataTables/DataTable";
import api from "../../../api/api";
import AddPermissionModal from "../../../components/features/permissions/AddPermissionModal";
import EditPermissionModal from "../../../components/features/permissions/EditPermissionModal";

const Permission = () => {
    const [permissionData, setPermissionData] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const openAddModal = () => setAddModalOpen(true);
    const closeAddModal = () => setAddModalOpen(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);

    const fetchPermissions = async () => {
        try {
            const response = await api.get("/permissions");
            const permissions = response.data.data.permissions;
            setPermissionData(permissions);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const openEditModal = (permission) => {
        setSelectedPermission(permission);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedPermission(null);
    };

    // Function to handle the removal of a permission
    const removePermission = async (permissionId) => {
        try {
            const response = await api.delete(`/permissions/${permissionId}`);
            if (response.status === 200) {
                fetchPermissions()
            }
        } catch (error) {
            console.error("Error deleting permission:", error);
        }
    };

    const columns = [
        {
            key: "name",
            title: "Permission",
            sortable: true,
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
                        className="px-4 py-1 text-blue-600 bg-transparent border border-brand-500 rounded hover:bg-brand-500 hover:text-white dark:bg-brand-500 dark:text-white"
                        onClick={() => openEditModal(item)}
                    >
                        Edit
                    </button>
                    <button
                        className="px-4 py-1 text-red-600 bg-transparent border border-red-500 rounded hover:bg-red-500 hover:text-white dark:bg-red-500 dark:text-white"
                        onClick={() => {
                            if (confirm("Yakin ingin menghapus permission ini?")) {
                                removePermission(item.id);
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
                title="Konseling PENS Dashboard | Permission Management"
                description="Manage user permissions for various actions."
            />
            <PageBreadcrumb pageTitle="Manajemen Permission" />
            <div className="space-y-6">
                <ComponentCard title="Data Permission">
                    <DataTable
                        data={permissionData}
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
            <AddPermissionModal
                isOpen={addModalOpen}
                closeModal={closeAddModal}
                onSubmitSuccess={fetchPermissions}
            />
            <EditPermissionModal
                isOpen={editModalOpen}
                selectedData={selectedPermission}
                closeModal={closeEditModal}
                onSubmitSuccess={fetchPermissions}
            />
        </>
    );
};

export default Permission;
