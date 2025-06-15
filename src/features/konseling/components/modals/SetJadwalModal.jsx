import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { useState, useEffect } from "react";

export default function SetJadwalModal({ isOpen, closeModal, janjiTemu, onSubmit, konselorOptions = [] }) {
  const [formData, setFormData] = useState({
    janji_temu_id: "",
    konselor_profil_id: "",
    tanggal_konseling: "",
    jam_mulai: "",
    jam_selesai: "",
    lokasi: "",
  });

  useEffect(() => {
    if (janjiTemu) {
      setFormData((prev) => ({
        ...prev,
        janji_temu_id: janjiTemu.id,
        konselor_profil_id: janjiTemu.preferensi_konselor_id || "",
      }));
    }
  }, [janjiTemu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    closeModal();
  };

  const konselorSelectOptions = konselorOptions.map(k => ({
    label: k.nama_lengkap,
    value: k.id
  }));

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Jadwal Konseling
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Atur jadwal konseling untuk janji temu mahasiswa.
        </p>
        <form className="flex flex-col">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <Label>Konselor</Label>
              <Select
                name="konselor_profil_id"
                value={formData.konselor_profil_id}
                options={konselorSelectOptions}
                placeholder="Pilih Konselor"
                onChange={(value) => handleSelectChange("konselor_profil_id", value)}
                className="w-full"
              />
            </div>

            <div>
              <Label>Tanggal Konseling</Label>
              <Input type="date" name="tanggal_konseling" value={formData.tanggal_konseling} onChange={handleChange} />
            </div>
            <div>
              <Label>Jam Mulai</Label>
              <Input type="time" name="jam_mulai" value={formData.jam_mulai} onChange={handleChange} />
            </div>
            <div>
              <Label>Jam Selesai</Label>
              <Input type="time" name="jam_selesai" value={formData.jam_selesai} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <Label>Lokasi</Label>
              <Input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" size="sm" onClick={closeModal}>
              Batal
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              Simpan Jadwal
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
