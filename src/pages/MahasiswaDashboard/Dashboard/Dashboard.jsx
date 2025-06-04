import PageMeta from "../../../components/common/PageMeta";
import MahasiswaProfilCard from "../../../components/features/profile/MahasiswaProfilCard";
import ComponentCard from "../../../components/common/ComponentCard";

export default function DashboardMahasiswa() {
  return (
    <>
      <PageMeta
        title="Konseling PENS Dashboard"
        description="Halaman Dashboard Mahasiswa"
      />
      <ComponentCard title="Data Mahasiswa">
        <div className="space-y-6">
          <MahasiswaProfilCard />
        </div>
      </ComponentCard>
    </>
  );
}
