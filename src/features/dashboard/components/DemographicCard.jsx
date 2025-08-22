import { useState, useEffect } from "react";
import { getDemografiMahasiswaPerProdi } from "@/services/DashboardService";

export default function DemographicCard() {
  const [prodiData, setProdiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDemografiMahasiswaPerProdi();
        setProdiData(response.data.demografiMahasiswa);
      } catch (error) {
        console.error("Error fetching mahasiswa demography:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Demografi Mahasiswa per Prodi
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Jumlah mahasiswa berdasarkan program studi
          </p>
        </div>
      </div>

      <div className="space-y-5 mt-6">
        {/* Tampilkan data mahasiswa per prodi */}
        {prodiData.length > 0 ? (
          prodiData.map((prodi, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                    ({prodi.jenjang}) {prodi.nama_program_studi} 
                  </p>
                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {prodi.total_mahasiswa} Mahasiswa
                  </span>
                </div>
              </div>

            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Data tidak tersedia.</p>
        )}
      </div>
    </div>
  );
}
