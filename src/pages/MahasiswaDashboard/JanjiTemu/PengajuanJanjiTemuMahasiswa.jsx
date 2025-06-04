import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import PengajuanJanjiTemuMahasiswaForm from "../../../components/features/janji-temu/PengajuanJanjiTemuMahasiswaForm";

export default function PengajuanJanjiTemuMahasiswa() {

    return (
        <div>
            <PageMeta
                title="Konseling PENS Dashboard | Pengajuan Janji Temu"
                description="Halaman untuk Pengajuan Janji Temu"
            />
            <PageBreadcrumb pageTitle="Form Pengajuan Janji Temu" />
            <ComponentCard title="Form Pengajuan Janji Temu">
                <div className="space-y-6">
                    <PengajuanJanjiTemuMahasiswaForm />
                </div>
            </ComponentCard>
        </div>
    );
}
