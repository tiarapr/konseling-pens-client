import React, { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageMeta from "@/components/common/PageMeta";
import { toast } from "react-toastify";
import DataTable from "@/components/tables/DataTables/DataTable";
import { getCounselorPerformance } from "@/services/DashboardService";

const CounselorPerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCounselorPerformance = async () => {
    try {
      setLoading(true);
      const response = await getCounselorPerformance();
      setPerformanceData(response.data.performance);
    } catch (error) {
      console.error('Error fetching counselor performance:', error);
      toast.error('Gagal memuat data kinerja konselor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounselorPerformance();
  }, []);

  const columns = [
    {
      key: "counselor_name",
      title: "Nama Konselor",
      sortable: true,
    },
    {
      key: "total_appointments",
      title: "Total Permintaan",
      sortable: true,
      render: (item) => item.total_appointments || '0', // Default 0 if null
    },
    {
      key: "total_sessions",
      title: "Total Sesi",
      sortable: true,
      render: (item) => item.total_sessions || '0', // Default 0 if null
    },
    {
      key: "scheduled_sessions",
      title: "Sesi Dijadwalkan",
      sortable: true,
      render: (item) => item.scheduled_sessions || '0', // Default 0 if null
    },
    {
      key: "completed_sessions",
      title: "Sesi Selesai",
      sortable: true,
      render: (item) => item.completed_sessions || '0', // Default 0 if null
    },
    {
      key: "canceled_sessions",
      title: "Sesi Dibatalkan",
      sortable: true,
      render: (item) => item.canceled_sessions || '0', // Default 0 if null
    },
    {
      key: "total_duration_completed_sessions",
      title: "Total Durasi (menit)",
      sortable: true,
      render: (item) => {
        const durasi = parseFloat(item.total_duration_completed_sessions);
        return !isNaN(durasi) ? `${Math.round(durasi)} menit` : '0 menit';
      },
    },
    {
      key: "average_rating",
      title: "Rata-rata Rating",
      sortable: true,
      render: (item) => {
        const rating = parseFloat(item.average_rating); // Konversi ke number
        return !isNaN(rating) ? rating.toFixed(1) : '-';
      },
    },
    {
      key: "completion_rate",
      title: "Tingkat Penyelesaian Sesi",
      sortable: true,
      render: (item) => {
        const rating = parseFloat(item.completion_rate); // Konversi ke number
        return !isNaN(rating) ? rating.toFixed(1) : '-';
      },
    },
  ];

  return (
    <>
      <PageMeta
        title="Kinerja Konselor | Dashboard"
        description="Monitor kinerja dan statistik konselor"
      />
      <div className="space-y-6">
        <ComponentCard title="Data Kinerja Konselor">
          <DataTable
            data={performanceData}
            columns={columns}
            defaultSort={{ key: "average_rating", direction: "desc" }}
            searchable={true}
            searchPlaceholder="Cari konselor..."
            pagination={true}
            itemsPerPageOptions={[5, 10, 20, 50]}
            defaultItemsPerPage={5}
            loading={loading}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default CounselorPerformance;
