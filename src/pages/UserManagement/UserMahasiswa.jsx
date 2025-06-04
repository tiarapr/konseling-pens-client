import React, { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTable from "../../components/tables/DataTables/DataTable";
import Badge from "../../components/ui/badge/Badge";
import api from "../../api/api";
import DetailMahasiswaModal from "../../components/features/user-management/mahasiswa/DetailMahasiswaModal";
import UpdateStatusVerifikasiModal from "../../components/features/user-management/mahasiswa/UpdateStatusVerifikasiModal";

const Mahasiswa = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatusData, setSelectedStatusData] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);

    // Fetch mahasiswa data (students)
    const fetchMahasiswa = async () => {
        try {
            const response = await api.get("/mahasiswa");
            const students = response.data.data.mahasiswa;
            setStudents(students);
        } catch (error) {
            console.error("Error fetching mahasiswa data:", error);
        }
    };

    useEffect(() => {
        fetchMahasiswa();
    }, []);

    const openDetailModal = async (id) => {
        try {
            const res = await api.get(`/mahasiswa/${id}`);
            const detail = res.data.data.mahasiswa;
            setSelectedStudent(detail);
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error("Gagal mengambil detail mahasiswa:", error);
        }
    };

    const handleUpdateStatus = async (id) => {
        try {
            const res = await api.get("/status-verifikasi");
            setStatusOptions(res.data.data.statusVerifikasi);

            // Dapatkan data mahasiswa berdasarkan ID yang diklik
            const student = students.find((s) => s.id === id);
            setSelectedStatusData(student);

            setShowStatusModal(true);
        } catch (error) {
            console.error("Gagal memuat status:", error);
        }
    };

    const handleSubmitStatusVerifikasi = async (data) => {
        try {
            const payload = {
                status_verifikasi_id: data.status_verifikasi_id,
            };

            if (data.catatan_verifikasi) {
                payload.catatan_verifikasi = data.catatan_verifikasi;
            }

            await api.patch(`/mahasiswa/${data.id}/verifikasi`, payload);
            fetchMahasiswa(); // Refresh data
        } catch (error) {
            console.error("Gagal update status verifikasi:", error);
        }
    };

    // Function to handle the removal of a student
    const removeStudent = async (studentId) => {
        try {
            const response = await api.delete(`/mahasiswa/${studentId}`);
            if (response.status === 200) {
                setStudents(prevData => prevData.filter(student => student.id !== studentId));
            }
        } catch (error) {
            console.error("Error deleting mahasiswa:", error);
        }
    };

    // Columns for DataTable
    const columns = [
        {
            key: "nrp",
            title: "NRP",
            sortable: true,
        },
        {
            key: "nama_lengkap",
            title: "Nama Lengkap",
            sortable: true,
        },
        {
            key: "jenis_kelamin",
            title: "Jenis Kelamin",
            sortable: true,
            render: (item) => item.jenis_kelamin === "P" ? "Perempuan" : "Laki-Laki",
        },
        {
            key: "program_studi",
            title: "Program Studi",
            sortable: true,
            render: (item) => {
                return `${item.program_studi.jenjang} ${item.program_studi.nama_program_studi}`;
            },
        },
        {
            key: "status_verifikasi",
            title: "Status Verifikasi",
            sortable: true,
            render: (item) => (
                <Badge
                    size="sm"
                    color={item.status_verifikasi ? item.status_verifikasi.warna : "gray"}
                >
                    {item.status_verifikasi ? item.status_verifikasi.label : "Unknown Status"}
                </Badge>
            )
        },
        {
            key: "action",
            title: "Action",
            render: (item) => (
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => openDetailModal(item.id)}
                        className="px-4 py-1 text-blue-600 bg-transparent border border-brand-500 rounded hover:bg-brand-500 hover:text-white dark:bg-brand-500 dark:text-white"
                    >
                        Detail
                    </button>
                    <button
                        onClick={() => handleUpdateStatus(item.id)}
                        className="px-2 py-1 text-green-700 border border-green-700 rounded hover:bg-green-700 hover:text-white"
                    >
                        Update Status Verifikasi
                    </button>
                    <button
                        className="px-4 py-1 text-red-600 bg-transparent border border-red-500 rounded hover:bg-red-500 hover:text-white dark:bg-red-500 dark:text-white"
                        onClick={() => removeStudent(item.id)}
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
                title="Konseling PENS Dashboard | Management Mahasiswa"
                description="Manage student data for the university."
            />
            <PageBreadcrumb pageTitle="Manajemen Mahasiswa" />
            <div className="space-y-6">
                <ComponentCard title="Data Mahasiswa">
                    <DataTable
                        data={students}
                        columns={columns}
                        defaultSort={{ key: "nrp", direction: "asc" }}
                        searchable={true}
                        pagination={true}
                        itemsPerPageOptions={[5, 10, 20, 50]}
                        defaultItemsPerPage={5}
                    />
                </ComponentCard>
            </div>
            <DetailMahasiswaModal
                isOpen={isDetailModalOpen}
                closeModal={() => setIsDetailModalOpen(false)}
                mahasiswa={selectedStudent}
            />
            <UpdateStatusVerifikasiModal
                isOpen={showStatusModal}
                closeModal={() => setShowStatusModal(false)}
                selectedData={selectedStatusData}
                statusOptions={statusOptions}
                onSubmit={handleSubmitStatusVerifikasi}
            />
        </>
    );
};

export default Mahasiswa;
