import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DataTable from "@/components/tables/DataTables/DataTable";
import api from "@/api/api";
import AddDepartmentModal from "../components/modals/AddDepartementModal";
import EditDepartementModal from "../components/modals/EditDepartementModal";

export default function Department() {
    const [departementData, setDepartementData] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const openAddModal = () => setAddModalOpen(true);
    const closeAddModal = () => setAddModalOpen(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedDepartement, setSelectedDepartement] = useState(null);

    const fetchDepartements = async () => {
        try {
            const response = await api.get("/departement");
            const departements = response.data.data.departements;
            setDepartementData(departements);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchDepartements();
    }, []);


    const openEditModal = (admin) => {
        setSelectedDepartement(admin);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedDepartement(null);
    };

    // Function to handle the removal of a department
    const removeDepartment = async (departmentId) => {
        try {
            const response = await api.delete(`/departement/${departmentId}`);
            if (response.status === 200) {
                fetchDepartements()
            }
        } catch (error) {
            console.error("Error deleting department:", error);
        }
    };

    const columns = [
        {
            key: "name",
            title: "Department",
            sortable: true,
        },
        {
            key: "created_at",
            title: "Created At",
            sortable: true,
            render: (item) => (
                new Date(item.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
            ),
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
                            if (confirm("Yakin ingin menghapus departemen ini?")) {
                                removeDepartment(item.id);
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
                title="Konseling PENS Dashboard | Department Management"
                description="Manage departments for the university."
            />
            <PageBreadcrumb pageTitle="Manajemen Departemen" />
            <div className="space-y-6">
                <ComponentCard title="Data Departemen">
                    <DataTable
                        data={departementData}
                        columns={columns}
                        defaultSort={{ key: "department", direction: "asc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                        onAddClick={openAddModal}
                    />
                </ComponentCard>
            </div>
            <AddDepartmentModal
                isOpen={addModalOpen}
                closeModal={closeAddModal}
                onSubmitSuccess={fetchDepartements}
            />
            <EditDepartementModal
                isOpen={editModalOpen}
                closeModal={closeEditModal}
                selectedData={selectedDepartement}
                onSubmitSuccess={fetchDepartements}
            />
        </>
    );
};
