import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import DataTable from "../../../components/tables/DataTables/DataTable";
import api from "../../../api/api";
import { FaTimes } from "react-icons/fa";
import AddRolePermissionModal from "../../../components/features/role-permission/AddRolePermissionModal";

const RolePermission = () => {
    const [rolePermissionData, setRolePermissionData] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);

    const openAddModal = () => setAddModalOpen(true);
    const closeAddModal = () => setAddModalOpen(false);

    const fetchRolePermissions = async () => {
        try {
            const response = await api.get("/roles-with-permissions");
            const data = response.data.data.rolesWithPermissions;
            setRolePermissionData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchRolePermissions();
    }, []);

    const removePermission = async (rolePermissionId) => {
        try {
            const response = await api.delete(`/role-permissions/${rolePermissionId}`);
            if (response.status === 200) {
                setRolePermissionData((prevData) =>
                    prevData.map((role) => ({
                        ...role,
                        permissions: role.permissions.filter((p) => p.id !== rolePermissionId),
                    }))
                );
            }
        } catch (error) {
            console.error("Error removing permission:", error);
        }
    };

    const columns = [
        {
            key: "role_name",
            title: "Role",
            sortable: true,
        },
        {
            key: "permissions",
            title: "Permission",
            sortable: true,
            render: (item) => (
                <ul className="list-disc space-y-1">
                    {item.permissions && item.permissions.length > 0 ? (
                        item.permissions.map(({ id, permission_name }) => (
                            <li
                                key={id}
                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md my-2 border border-gray-300 dark:border-gray-600"
                            >
                                <span>{permission_name}</span>
                                <button
                                    onClick={() => removePermission(id)}
                                    className="ml-2 text-gray-300 dark:text-gray-100 hover:text-red-500"
                                >
                                    <FaTimes />
                                </button>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-300">
                            No permissions assigned to this role
                        </p>
                    )}
                </ul>
            ),
        },
    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Role Permissions Management"
                description="Manage roles and permissions for users."
            />
            <PageBreadcrumb pageTitle="Manajemen Role dan Permissions" />
            <div className="space-y-6">
                <ComponentCard title="Data Role dan Permissions">
                    <DataTable
                        data={rolePermissionData}
                        columns={columns}
                        defaultSort={{ key: "role", direction: "asc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                        addButtonText="+ Assign Permission to Role"
                        onAddClick={openAddModal}
                    />
                </ComponentCard>
            </div>
            <AddRolePermissionModal
                isOpen={addModalOpen}
                closeModal={closeAddModal}
                onSubmitSuccess={fetchRolePermissions}
            />
        </>
    );
};

export default RolePermission;
