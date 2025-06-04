import { useState, useEffect } from "react";
import Label from "../../form/Label.jsx";
import Input from "../../form/input/InputField.jsx";
import Checkbox from "../../form/input/Checkbox.jsx";
import api from "../../../api/api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function AddCatatanKonselingForm({ konselingId }) {
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [validAccess, setValidAccess] = useState(false);
    const [konselingDetails, setKonselingDetails] = useState(null);

    const [formData, setFormData] = useState({
        deskripsi_masalah: "",
        usaha: "",
        kendala: "",
        pencapaian: "",
        diagnosis: "",
        intervensi: "",
        tindak_lanjut: "",
        konseling_lanjutan: false,
    });

    // Mengambil detail konseling berdasarkan konselingId
    useEffect(() => {
        const fetchKonselingDetails = async () => {
            try {
                const response = await api.get(`/konseling/${konselingId}`);
                const konseling = response.data.data.konseling;

                if (konseling.status.name.toLowerCase() !== "berlangsung") {
                    Swal.fire({
                        title: "Error",
                        text: "Akses ditolak! Anda Belum Dapat Menambahkan Catatan Konseling",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                    navigate("/konselor-dashboard/konseling");
                    return;
                }

                setKonselingDetails(konseling);
                setValidAccess(true);
            } catch (error) {
                console.error("Error fetching konseling details:", error);
                toast.error("Terjadi kesalahan dalam mengambil detail konseling.");
            }
        };

        fetchKonselingDetails();
    }, [konselingId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            konseling_id: konselingId,
            deskripsi_masalah: formData.deskripsi_masalah,
            usaha: formData.usaha,
            kendala: formData.kendala,
            pencapaian: formData.pencapaian,
            diagnosis: formData.diagnosis,
            intervensi: formData.intervensi,
            tindak_lanjut: formData.tindak_lanjut,
            konseling_lanjutan: formData.konseling_lanjutan,
        };

        try {
            let response;

            response = await api.post("/catatan-konseling", payload);

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    title: "Success",
                    text: "Catatan Konseling Berhasil Disimoan!",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                setTimeout(() => {
                    navigate("/riwayat-konseling");
                }, 2000);
            } else {
                toast.error("Terjadi kesalahan saat menyimpan data.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Terjadi kesalahan saat menyimpan.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Deskripsi Masalah */}
            <div>
                <Label htmlFor="deskripsi_masalah">Deskripsi Masalah</Label>
                <Input
                    type="text"
                    id="deskripsi_masalah"
                    name="deskripsi_masalah"
                    value={formData.deskripsi_masalah}
                    onChange={handleChange}
                    placeholder="Deskripsi masalah konseling"
                />
            </div>

            {/* Usaha */}
            <div>
                <Label htmlFor="usaha">Usaha</Label>
                <Input
                    type="text"
                    id="usaha"
                    name="usaha"
                    value={formData.usaha}
                    onChange={handleChange}
                    placeholder="Usaha yang dilakukan"
                />
            </div>

            {/* Kendala */}
            <div>
                <Label htmlFor="kendala">Kendala</Label>
                <Input
                    type="text"
                    id="kendala"
                    name="kendala"
                    value={formData.kendala}
                    onChange={handleChange}
                    placeholder="Kendala yang dihadapi"
                />
            </div>

            {/* Pencapaian */}
            <div>
                <Label htmlFor="pencapaian">Pencapaian</Label>
                <Input
                    type="text"
                    id="pencapaian"
                    name="pencapaian"
                    value={formData.pencapaian}
                    onChange={handleChange}
                    placeholder="Pencapaian yang diperoleh"
                />
            </div>

            {/* Diagnosis */}
            <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                    type="text"
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    placeholder="Diagnosis masalah"
                />
            </div>

            {/* Intervensi */}
            <div>
                <Label htmlFor="intervensi">Intervensi</Label>
                <Input
                    type="text"
                    id="intervensi"
                    name="intervensi"
                    value={formData.intervensi}
                    onChange={handleChange}
                    placeholder="Rencana intervensi"
                />
            </div>

            {/* Tindak Lanjut */}
            <div>
                <Label htmlFor="tindak_lanjut">Tindak Lanjut</Label>
                <Input
                    type="text"
                    id="tindak_lanjut"
                    name="tindak_lanjut"
                    value={formData.tindak_lanjut}
                    onChange={handleChange}
                    placeholder="Tindak lanjut yang diperlukan"
                />
            </div>

            {/* Konseling Lanjutan */}
            <div>
                <Label htmlFor="konseling_lanjutan">Konseling Lanjutan</Label>
                <div className="flex items-center space-x-2 text-gray-500">
                    <Checkbox
                        className="w-5 h-5"
                        checked={formData.konseling_lanjutan}  // Bind to formData state
                        onChange={handleChange}  // Pass handleChange directly
                        id="konseling_lanjutan"
                        name="konseling_lanjutan"  // Make sure name matches formData key
                    />
                    <span>Ya</span>
                </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700" />

            {/* Detail Pelaksanaan Konseling */}
            {konselingDetails && (
                <div>
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Detail Pelaksanaan Konseling</h3>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Informasi Konseling */}
                        <div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Tanggal:
                                    </p>
                                    <p className="text-sm leading-normal text-gray-500 dark:text-gray-400">
                                        {new Date(konselingDetails.tanggal_konseling).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Jam:
                                    </p>
                                    <p className="text-sm leading-normal text-gray-500 dark:text-gray-400">
                                        {konselingDetails.jam_mulai} - {konselingDetails.jam_selesai}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Lokasi:
                                    </p>
                                    <p className="text-sm leading-normal text-gray-500 dark:text-gray-400">
                                        {konselingDetails.lokasi}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Pertemuan Ke:
                                    </p>
                                    <p className="text-sm leading-normal text-gray-500 dark:text-gray-400">
                                        {konselingDetails.pertemuan_ke}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pernyataan Konselor */}
                        <div className="space-y-8">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Surabaya, {new Date().toLocaleDateString()}</p>
                            <p className="text-sm italic text-gray-500 dark:text-gray-400">
                                *Dengan ini saya menyatakan apa yang saya isikan adalah benar.
                            </p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Konselor {konselingDetails.konselor.nama}</p>
                        </div>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 my-6" />
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        *Setelah catatan disimpan, status konseling akan otomatis berubah menjadi selesai.
                    </div>
                </div>
            )}


            {/* Submit Button */}
            <div>
                <button type="submit" className="w-full py-2 px-4 bg-brand-500 text-white rounded">
                    Simpan Catatan Konseling
                </button>
            </div>
        </form>
    );
}
