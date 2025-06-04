import { useState, useEffect } from 'react';
import LineChartTwo from "../../charts/line/LineChartTwo";
import { getMonthlyCounselingSummary } from '../../../services/DashboardService';

const processApiData = (apiData) => {
  // Inisialisasi struktur data untuk semua bulan
  const allMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  // Temukan semua status unik dari data
  const statusTypes = [...new Set(apiData.map(item => item.kode_status))];

  // Buat series untuk setiap status
  const series = statusTypes.map(status => {
    const statusData = apiData.filter(item => item.kode_status === status);
    const statusLabel = statusData[0]?.status_label || status;

    // Mapping data per bulan
    const monthlyData = allMonths.map((_, monthIndex) => {
      const found = statusData.find(item => {
        const date = new Date(item.bulan);
        return date.getMonth() === monthIndex;
      });
      return found ? found.total : 0;
    });

    return {
      name: statusLabel,
      data: monthlyData
    };
  });

  return series;
};

const chartOptions = {
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "center",
  },
  colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
  chart: {
    fontFamily: "Inter, sans-serif",
    height: 350,
    type: "line",
    toolbar: { show: false },
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  markers: {
    size: 5,
    strokeColors: "#fff",
    strokeWidth: 2,
    hover: { size: 7 },
  },
  grid: {
    borderColor: "#F3F4F6",
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  dataLabels: { enabled: false },
  tooltip: {
    enabled: true,
    intersect: false,
    shared: true,
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: "#6B7280", fontSize: "12px" }
    },
    tooltip: { enabled: false },
  },
  yaxis: {
    labels: {
      style: {
        colors: ["#6B7280"],
        fontSize: "12px",
      },
      formatter: (value) => Math.floor(value) === value ? value : "",
    },
    min: 0,
    forceNiceScale: true,
  },
};

const StatisticsChart = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('monthly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ganti dengan API call sebenarnya
        const response = await getMonthlyCounselingSummary();

        if (response.status === "success") {
          const processedData = processApiData(response.data.totalKonseling);
          setSeries(processedData);
        } else {
          console.error("Gagal memuat data");
          setSeries([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    // Di sini bisa menambahkan logika untuk mengubah periode data
  };

  return (
    <LineChartTwo
      title="Statistik Konseling"
      description="Perkembangan konseling per bulan"
      options={chartOptions}
      series={series}
      onTabChange={handleTabChange}
      chartType="line"
      height={350}
      loading={loading}
    />
  );
};

export default StatisticsChart;