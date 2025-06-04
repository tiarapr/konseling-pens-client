import { useState, useEffect } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import api from "../../../api/api";
import CatatanKonselingDokumen from "./CatatanKonselingDokumen";

export default function InfoCatatanKonselingMahasiswa({ catatanKonselingId }) {
    const [catatanKonseling, setCatatanKonseling] = useState(null);

    useEffect(() => {
        async function fetchCatatanKonseling() {
            try {
                const response = await api.get(`/catatan-konseling/own/${catatanKonselingId}`);
                if (response.data?.data?.catatan_konseling) {
                    setCatatanKonseling(response.data.data.catatan_konseling);
                } else {
                    setCatatanKonseling(null);
                }
            } catch (error) {
                console.error("Error fetching catatan konseling:", error);
                setCatatanKonseling(null);
            }
        }

        if (catatanKonselingId) {
            fetchCatatanKonseling();
        }
    }, [catatanKonselingId]);

    if (!catatanKonseling) return <div className="p-5">Memuat data...</div>;

    return (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Catatan Konseling
                        </h4>
                        
                        <PDFDownloadLink
                            document={<CatatanKonselingDokumen catatan={catatanKonseling} />}
                            fileName={`catatan-konseling-${catatanKonseling.id || catatanKonselingId}.pdf`}
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
                        >
                            {({ loading }) => (
                                loading ? 'Menyiapkan PDF...' : 'Unduh PDF'
                            )}
                        </PDFDownloadLink>
                    </div>

                    {/* Tampilan untuk web tetap sama */}
                    <div className="grid grid-cols-1 gap-4 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Deskripsi Masalah
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {catatanKonseling.deskripsi_masalah}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Usaha
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {catatanKonseling.usaha}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Kendala
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {catatanKonseling.kendala}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Pencapaian
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {catatanKonseling.pencapaian}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Diagnosis
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {catatanKonseling.diagnosis}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Intervensi
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {catatanKonseling.intervensi}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Tindak Lanjut
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {catatanKonseling.tindak_lanjut}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Konseling Lanjutan
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {catatanKonseling.konseling_lanjutan ? "Yes" : "No"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}