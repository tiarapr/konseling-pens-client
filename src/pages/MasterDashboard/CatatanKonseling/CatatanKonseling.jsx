import { useParams } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import CatatanKonselingForm from "../../../components/features/catatan-konseling/AddCatatanKonselingForm";
import { ToastContainer } from "react-toastify";

export default function CatatanKonseling() {
    const { konselingId, catatanKonselingId } = useParams();

    return (
        <div>
            <PageMeta
                title="Konseling PENS Dashboard | Catatan Konseling"
                description="Halaman untuk menambahkan catatan konseling"
            />
            <PageBreadcrumb pageTitle="Form Catatan Konseling" />
            <ComponentCard title="Form Catatan Konseling">
                <div className="space-y-6">
                    <CatatanKonselingForm konselingId={konselingId} catatanKonselingId={catatanKonselingId} />
                </div>
            </ComponentCard>
            <ToastContainer/>
        </div>
    );
}
