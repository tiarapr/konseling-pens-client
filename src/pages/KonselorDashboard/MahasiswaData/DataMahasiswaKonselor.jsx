import React, { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import DataTable from "../../../components/tables/DataTables/DataTable";
import Badge from "../../../components/ui/badge/Badge";
import api from "../../../api/api";
import { Link } from "react-router";

const DataMahasiswaKonselor = () => {
    const [students, setStudents] = useState([]);

    // Fetch mahasiswa data (students)
    const fetchMahasiswa = async () => {
        try {
            const response = await api.get("/mahasiswa/my");
            const students = response.data.data;
            setStudents(students);
        } catch (error) {
            console.error("Error fetching mahasiswa data:", error);
        }
    };

    useEffect(() => {
        fetchMahasiswa();
    }, []);

    // Columns for DataTable
    const columns = [
        {
            key: "nrp",
            title: "NRP",
            sortable: true,
        },
        {
            key: "nama_mahasiswa",
            title: "Nama Mahasiswa",
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
                return `${item.jenjang} ${item.nama_program_studi}`;
            },
        },
        {
            key: "total_sesi_keseluruhan",
            title: "Total Sesi",
            sortable: true,
        },
        {
            key: "action",
            title: "Action",
            render: (item) => (
                <div className="flex flex-col space-y-2">
                    <Link to={`/konselor-dashboard/mahasiswa/${item.nrp}/rekam-medis`}>
                        <button
                            className="px-4 py-1 text-blue-600 bg-transparent border border-brand-500 rounded hover:bg-brand-500 hover:text-white dark:bg-brand-500 dark:text-white"
                        >
                            Lihat Rekam Medis
                        </button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <>
            <PageMeta
                title="Konseling PENS Dashboard | Data Mahasiswa"
                description="Halaman Data Mahasiswa yang mempunyai jadwal konseling dengan konselor"
            />
            <PageBreadcrumb pageTitle="Data Mahasiswa" />
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
        </>
    );
};

export default DataMahasiswaKonselor;
