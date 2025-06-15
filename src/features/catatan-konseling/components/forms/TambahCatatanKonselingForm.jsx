import { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Checkbox from "@/components/form/input/Checkbox";

export default function TambahCatatanKonselingForm({ onSubmit, konselingDetails, loading }) {
    const [formData, setFormData] = useState({
        deskripsi_masalah: "",
        usaha: "",
        kendala: "",
        pencapaian: "",
        diagnosis: "",
        intervensi: "",
        tindak_lanjut: "",
        konseling_lanjutan: false,
        konseling_id: null,
    });

    useEffect(() => {
        if (konselingDetails) {
            setFormData((prev) => ({
                ...prev,
                konseling_id: konselingDetails.id,
            }));
        }
    }, [konselingDetails]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {[
                { name: "deskripsi_masalah", label: "Deskripsi Masalah", rows: 4 },
                { name: "usaha", label: "Usaha", rows: 3 },
                { name: "kendala", label: "Kendala", rows: 3 },
                { name: "pencapaian", label: "Pencapaian", rows: 3 },
                { name: "diagnosis", label: "Diagnosis", rows: 3 },
                { name: "intervensi", label: "Intervensi", rows: 3 },
                { name: "tindak_lanjut", label: "Tindak Lanjut", rows: 3 },
            ].map(({ name, label, rows }) => (
                <div key={name}>
                    <Label htmlFor={name}>{label}</Label>
                    <TextArea
                        id={name}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={label}
                        rows={rows}
                        className="w-full"
                    />
                </div>
            ))}

            <div>
                <Label htmlFor="konseling_lanjutan">Konseling Lanjutan</Label>
                <div className="flex items-center space-x-2 text-gray-500">
                    <Checkbox
                        id="konseling_lanjutan"
                        name="konseling_lanjutan"
                        checked={formData.konseling_lanjutan}
                        onChange={handleChange}
                        className="w-5 h-5"
                    />
                    <span>Ya</span>
                </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700" />

            {konselingDetails && (
                <div>
                    <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                        Detail Pelaksanaan Konseling
                    </h3>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Info label="Tanggal" value={
                                new Date(konselingDetails.tanggal_konseling).toLocaleDateString("id-ID", {
                                    year: "numeric", month: "long", day: "numeric"
                                })
                            } />
                            <Info label="Jam" value={`${konselingDetails.jam_mulai} - ${konselingDetails.jam_selesai}`} />
                            <Info label="Lokasi" value={konselingDetails.lokasi} />
                            <Info label="Pertemuan Ke" value={konselingDetails.pertemuan_ke} />
                        </div>

                        <div className="space-y-8">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Surabaya, {new Date().toLocaleDateString("id-ID", {
                                    year: "numeric", month: "long", day: "numeric"
                                })}
                            </p>
                            <p className="text-sm italic text-gray-500 dark:text-gray-400">
                                *Dengan ini saya menyatakan apa yang saya isikan adalah benar.
                            </p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Konselor {konselingDetails.konselor.nama}
                            </p>
                        </div>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 my-6" />
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        *Setelah catatan disimpan, status konseling akan otomatis berubah menjadi selesai.
                    </div>
                </div>
            )}

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 bg-brand-500 text-white rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Menyimpan..." : "Simpan Catatan Konseling"}
                </button>
            </div>
        </form>
    );
}

function Info({ label, value }) {
    return (
        <div className="flex items-center space-x-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}:</p>
            <p className="text-sm leading-normal text-gray-500 dark:text-gray-400">{value}</p>
        </div>
    );
}
