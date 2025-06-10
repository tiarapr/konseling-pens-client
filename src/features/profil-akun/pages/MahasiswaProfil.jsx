import PageMeta from "@/components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import MahasiswaProfilCard from "../components/cards/MahasiswaProfilCard";

export default function MahasiswaProfil() {
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
