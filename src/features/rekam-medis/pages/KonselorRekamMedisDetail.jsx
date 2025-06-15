import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import api from "@/api/api";
import BackButton from "@/components/ui/button/BackButton";
import RekamMedisDetailHeader from "../components/RekamMedisDetailHeader";
import RekamMedisList from "../components/RekamMedisList";

export default function RekamMedisDetail() {
    const { nrp } = useParams();
    const [rekamMedis, setRekamMedis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});
    const [studentData, setStudentData] = useState(null);

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        async function fetchRekamMedis() {
            try {
                const response = await api.get(`/mahasiswa/${nrp}/rekam-medis`);
                const data = response.data.data;
                const sorted = [...data.rekam_medis].sort((a, b) => b.pertemuan_ke - a.pertemuan_ke);
                setRekamMedis(sorted);
                setStudentData(data);
                setExpandedItems(Object.fromEntries(data.rekam_medis.map(item => [item.konseling_id, false])));
            } catch {
                setError("Gagal mengambil data rekam medis.");
            } finally {
                setLoading(false);
            }
        }
        fetchRekamMedis();
    }, [nrp]);

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (error) return <div className="p-5 text-red-500 text-center">{error}</div>;

    return (
        <div>
            <PageMeta title="Konseling PENS Dashboard | Rekam Medis Konseling" description="Halaman rekam medis konseling mahasiswa" />
            <PageBreadcrumb pageTitle="Rekam Medis Mahasiswa" />
            <BackButton />
            <ComponentCard title="Rekam Medis">
                <RekamMedisDetailHeader studentData={studentData} calculateAge={calculateAge} />
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Konseling</h3>
                <RekamMedisList rekamMedis={rekamMedis} expandedItems={expandedItems} toggleExpand={toggleExpand} />
            </ComponentCard>
        </div>
    );
}
