import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import api from "@/api/api";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import TambahCatatanKonselingForm from "../components/forms/TambahCatatanKonselingForm";
import BackButton from "@/components/ui/button/BackButton";

export default function MasterTambahCatatanKonseling() {
    const { konselingId } = useParams();
    const [konselingDetails, setKonselingDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDetails() {
            try {
                const response = await api.get(`/konseling/${konselingId}`);
                const konseling = response.data.data.konseling;

                if (konseling.status.name.toLowerCase() !== "berlangsung") {
                    Swal.fire({
                        title: "Error",
                        text: "Akses ditolak! Anda Belum Dapat Menambahkan Catatan Konseling",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                    navigate("/konselor-dashboard/konseling");
                    return;
                }

                setKonselingDetails(konseling);
            } catch (err) {
                console.error(err);
                toast.error("Gagal mengambil data konseling.");
                navigate("/konselor-dashboard/konseling");
            }
        }

        fetchDetails();
    }, [konselingId, navigate]);

    const submitCatatanKonseling = async (data) => {
        try {
            setLoading(true);
            const response = await api.post("/catatan-konseling", data);

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    title: "Sukses",
                    text: "Catatan Konseling berhasil disimpan!",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                setTimeout(() => {
                    navigate("/konselor-dashboard/riwayat-konseling");
                }, 2000);
            } else {
                toast.error("Gagal menyimpan catatan.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan saat menyimpan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageMeta
                title="Konseling PENS Dashboard | Catatan Konseling"
                description="Halaman untuk menambahkan catatan konseling"
            />
            <PageBreadcrumb pageTitle="Form Catatan Konseling" />
            <BackButton />
            <ComponentCard title="Form Catatan Konseling">
                <div className="space-y-6">
                    {konselingDetails ? (
                        <TambahCatatanKonselingForm
                            onSubmit={submitCatatanKonseling}
                            konselingDetails={konselingDetails}
                            loading={loading}
                        />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </ComponentCard>
        </div>
    );
}
