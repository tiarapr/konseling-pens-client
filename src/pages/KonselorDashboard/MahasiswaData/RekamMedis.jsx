import { useParams } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { ToastContainer } from "react-toastify";
import InfoRekamMedis from "../../../components/features/rekam-medis/InfoRekamMedis";

export default function RekamMedis() {
    const { nrp } = useParams();

    return (
        <div>
            <PageMeta
                title="Konseling PENS Dashboard | Rekam Medis Konseling"
                description="Halaman rekam medis konseling mahasiswa"
            />
            <PageBreadcrumb pageTitle="Rekam Medis Mahasiswa" />
            <ComponentCard title="Rekam Medis">
                <div className="space-y-6">
                    <InfoRekamMedis nrp={nrp} />
                </div>
            </ComponentCard>
            <ToastContainer />
        </div>
    );
}
