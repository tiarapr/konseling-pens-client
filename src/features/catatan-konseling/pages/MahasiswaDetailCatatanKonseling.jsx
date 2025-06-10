import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { ToastContainer, toast } from "react-toastify";
import api from "@/api/api";
import Detail from "../components/detail";

export default function MahasiswaDetailCatatanKonseling() {
    const { id: catatanKonselingId } = useParams();
    const [catatanKonseling, setCatatanKonseling] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCatatanKonseling() {
            try {
                const response = await api.get(`/catatan-konseling/own/${catatanKonselingId}`);
                const data = response?.data?.data?.catatan_konseling;

                if (data) {
                    setCatatanKonseling(data);
                } else {
                    toast.error("Data catatan konseling tidak ditemukan.");
                }
            } catch (error) {
                console.error("Error fetching catatan konseling:", error);
                toast.error("Terjadi kesalahan saat mengambil data.");
            } finally {
                setLoading(false);
            }
        }

        if (catatanKonselingId) {
            fetchCatatanKonseling();
        }
    }, [catatanKonselingId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <PageMeta
                title="Konseling PENS Dashboard | Catatan Konseling"
                description="Halaman untuk detail catatan konseling"
            />
            <PageBreadcrumb pageTitle="Detail Catatan Konseling" />
            <ComponentCard title="Detail Catatan Konseling">
                <div className="space-y-6">
                    {catatanKonseling ? (
                        <Detail
                            catatanKonseling={catatanKonseling}
                            canEdit={false}
                        />
                    ) : (
                        <p className="text-red-500">Data tidak tersedia.</p>
                    )}
                </div>
            </ComponentCard>
            <ToastContainer />
        </div>
    );
}
