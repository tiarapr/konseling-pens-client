import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "@/api/api";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import EditCatatanKonselingForm from "@/features/catatan-konseling/components/forms/EditCatatanKonselingForm";
import BackButton from "@/components/ui/button/BackButton";

export default function MasterEditCatatanKonseling() {
    const { id: catatanKonselingId } = useParams();
    const navigate = useNavigate();

    const [konselingDetails, setKonselingDetails] = useState(null);
    const [catatanKonselingDetails, setCatatanKonselingDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCatatan = async () => {
            try {
                const res = await api.get(`/catatan-konseling/${catatanKonselingId}`);
                const data = res.data.data.catatan_konseling;
                setCatatanKonselingDetails(data);
            } catch (err) {
                console.error("Gagal memuat catatan:", err);
                toast.error("Gagal memuat catatan konseling.");
            }
        };

        if (catatanKonselingId) fetchCatatan();
    }, [catatanKonselingId]);

    useEffect(() => {
        const fetchKonselingDetails = async () => {
            try {
                const res = await api.get(`/konseling/${catatanKonselingDetails.konseling_id}`);
                const konseling = res.data.data.konseling;

                if (konseling.status.name.toLowerCase() !== "selesai") {
                    Swal.fire({
                        title: "Akses Ditolak",
                        text: "Anda hanya bisa mengedit catatan konseling yang sudah selesai.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                    navigate("/konselor-dashboard/konseling");
                    return;
                }

                setKonselingDetails(konseling);
            } catch (error) {
                console.error("Error fetching konseling:", error);
                toast.error("Gagal memuat detail konseling.");
            }
        };

        if (catatanKonselingDetails && catatanKonselingDetails.konseling_id) {
            fetchKonselingDetails();
        }
    }, [catatanKonselingDetails, catatanKonselingDetails?.konseling_id, navigate]);

    const handleFormSubmit = async (formData) => {
        setLoading(true);
        try {
            await api.put(`/catatan-konseling/${catatanKonselingId}`, formData);
            toast.success("Catatan konseling berhasil diperbarui.");
            navigate("/konselor-dashboard/riwayat-konseling");
        } catch (err) {
            console.error(err);
            toast.error("Gagal memperbarui catatan konseling.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageMeta
                title="Konseling PENS Dashboard | Catatan Konseling"
                description="Halaman untuk edit catatan konseling"
            />
            <PageBreadcrumb pageTitle="Form Catatan Konseling" />
            <BackButton />
            <ComponentCard title="Form Catatan Konseling">
                <div className="space-y-6">
                    <EditCatatanKonselingForm
                        konselingDetails={konselingDetails}
                        catatanKonselingDetails={catatanKonselingDetails}
                        onSubmit={handleFormSubmit}
                        loading={loading}
                    />
                </div>
            </ComponentCard>
        </div>
    );
}
