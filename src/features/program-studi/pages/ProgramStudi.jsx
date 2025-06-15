import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DataTable from "@/components/tables/DataTables/DataTable";
import api from "@/api/api";
import AddProgramStudiModal from "../components/modals/AddProgramStudiModal";
import EditProgramStudiModal from "../components/modals/EditProgramStudiModal";

export default function ProgramStudi() {
    const [programStudies, setProgramStudies] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const openAddModal = () => setAddModalOpen(true);
    const closeAddModal = () => setAddModalOpen(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProgramStudi, setSelectedProgramStudi] = useState(null);

    // Fetch program studies data
    const fetchProgramStudies = async () => {
        try {
            const response = await api.get("/program-studi");
            const programStudies = response.data.data.programStudi;
            setProgramStudies(programStudies);
        } catch (error) {
            console.error("Error fetching program studies:", error);
        }
    };

    useEffect(() => {
        fetchProgramStudies();
    }, []);

    const openEditModal = (admin) => {
        setSelectedProgramStudi(admin);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedProgramStudi(null);
    };

    // Function to handle the removal of a program study
    const removeProgramStudy = async (programId) => {
        try {
            const response = await api.delete(`/program-studi/${programId}`);
            if (response.status === 200) {
                fetchProgramStudies()
            }
        } catch (error) {
            console.error("Error deleting program study:", error);
        }
    };

    // Columns for the DataTable
    const columns = [
        {
            key: "nama_departemen",
            title: "Departemen",
            sortable: true,
        },
        {
            key: "jenjang",
            title: "Jenjang",
            sortable: true,
        },
        {
            key: "nama_program_studi",
            title: "Program Studi",
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
                            if (confirm("Yakin ingin menghapus program studi ini?")) {
                                removeProgramStudy(item.id);
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
                title="Konseling PENS Dashboard | Program Studi Management"
                description="Manage program studies and departments for the university."
            />
            <PageBreadcrumb pageTitle="Manajemen Program Studi" />
            <div className="space-y-6">
                <ComponentCard title="Data Program Studi">
                    <DataTable
                        data={programStudies}
                        columns={columns}
                        defaultSort={{ key: "nama_program_studi", direction: "asc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                        onAddClick={openAddModal}
                    />
                </ComponentCard>
            </div>
            <AddProgramStudiModal
                isOpen={addModalOpen}
                closeModal={closeAddModal}
                onSubmitSuccess={fetchProgramStudies}
            />
            <EditProgramStudiModal
                isOpen={editModalOpen}
                closeModal={closeEditModal}
                selectedData={selectedProgramStudi}
                onSubmitSuccess={fetchProgramStudies}
            />
        </>
    );
};
