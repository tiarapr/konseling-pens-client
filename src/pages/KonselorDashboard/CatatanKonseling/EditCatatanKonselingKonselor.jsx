import { useParams } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import EditCatatanKonselingForm from "../../../components/features/catatan-konseling/EditCatatanKonselingForm";

export default function EditCatatanKonselingKonselor() {
    const { konselingId, catatanKonselingId } = useParams();

    return (
        <div>
            <PageMeta
                title="Konseling PENS Dashboard | Catatan Konseling"
                description="Halaman untuk edit catatan konseling"
            />
            <PageBreadcrumb pageTitle="Form Catatan Konseling" />
            <ComponentCard title="Form Catatan Konseling">
                <div className="space-y-6">
                    <EditCatatanKonselingForm konselingId={konselingId} catatanKonselingId={catatanKonselingId} />
                </div>
            </ComponentCard>
        </div>
    );
}
