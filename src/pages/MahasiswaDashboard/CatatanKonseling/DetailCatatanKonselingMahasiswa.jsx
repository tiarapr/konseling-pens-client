import { useParams } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { ToastContainer } from "react-toastify";
import InfoCatatanKonselingMahasiswa from "../../../components/features/catatan-konseling/InfoCatatanKonselingMahasiswa";

export default function DetailCatatanKonselingMahasiswa() {
    const { id: catatanKonselingId } = useParams();

    return (
        <div>
            <PageMeta
                title="Konseling PENS Dashboard | Catatan Konseling"
                description="Halaman untuk detail catatan konseling"
            />
            <PageBreadcrumb pageTitle="Detail Catatan Konseling" />
            <ComponentCard title="Detail Catatan Konseling">
                <div className="space-y-6">
                    <InfoCatatanKonselingMahasiswa catatanKonselingId={catatanKonselingId} />
                </div>
            </ComponentCard>
            <ToastContainer />
        </div>
    );
}
