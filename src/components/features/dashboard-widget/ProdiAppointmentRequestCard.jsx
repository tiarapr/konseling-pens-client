import { useState, useEffect } from "react";
import { getTotalPengajuanPerProdiJenjang } from "../../../services/DashboardService";

export default function ProdiAppointmentRequestCard() {
    const [prodiRequestsData, setProdiRequestsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTotalPengajuanPerProdiJenjang();
                setProdiRequestsData(response.data.totalPengajuan); // Perbaiki untuk menggunakan 'totalPengajuan'
            } catch (error) {
                console.error("Error fetching pengajuan janji temu per prodi:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 sm:p-6">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Jumlah Pengajuan Janji Temu per Prodi
                    </h3>
                    <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                        Jumlah pengajuan janji temu berdasarkan program studi
                    </p>
                </div>
            </div>

            <div className="space-y-5 mt-6">
                {/* Tampilkan data pengajuan janji temu per prodi */}
                {prodiRequestsData.length > 0 ? (
                    prodiRequestsData.map((prodi, index) => {
                        const totalPengajuan = parseInt(prodi.total_pengajuan); // Pastikan jadi angka
                        const totalSemuaPengajuan = prodiRequestsData.reduce(
                            (sum, p) => sum + parseInt(p.total_pengajuan),
                            0
                        );

                        const progressWidth = totalSemuaPengajuan > 0
                            ? (totalPengajuan / totalSemuaPengajuan) * 100
                            : 0; // Menghindari pembagian dengan 0

                        return (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                                            ({prodi.jenjang}) {prodi.nama_program_studi} 
                                        </p>
                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                            {totalPengajuan} Pengajuan
                                        </span>
                                    </div>
                                </div>

                                {/* Menampilkan progress bar berdasarkan jumlah pengajuan */}
                                <div className="flex w-full max-w-[140px] items-center gap-3">
                                    <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                                        <div
                                            className="absolute left-0 top-0 flex h-full rounded-sm bg-brand-500 text-xs font-medium text-white"
                                            style={{
                                                width: `${progressWidth}%`, // Persentase pengajuan
                                            }}
                                        ></div>
                                    </div>
                                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {Math.round(progressWidth)}%
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">Data tidak tersedia.</p>
                )}
            </div>
        </div>
    );
}
