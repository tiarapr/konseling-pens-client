import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import EditMahasiswaProfilForm from "../../../components/features/profile/EditMahasiswaProfilForm";

export default function EditMahasiswaProfil() {
  return (
    <>
      <PageMeta
        title="Konseling PENS Dashboard | Edit Mahasiswa Profil"
        description="Halaman edit profil mahasiswa"
      />
      <ComponentCard title="Edit Data Mahasiswa">
        <div className="space-y-6">
          <EditMahasiswaProfilForm />
        </div>
      </ComponentCard>
    </>
  );
}
