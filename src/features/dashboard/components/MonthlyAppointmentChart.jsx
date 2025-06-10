import React, { useEffect, useState } from "react";
import BarChartTwo from "@/components/charts/bar/BarChartTwo";
import { getMonthlyAppointmentSummary } from "@/services/DashboardService";

const options = {
    colors: ["#465fff"],
    chart: {
        fontFamily: "Inter, sans-serif",
        type: "bar",
        height: 180,
        toolbar: { show: false },
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "39%",
            borderRadius: 5,
            borderRadiusApplication: "end",
        },
    },
    dataLabels: { enabled: false },
    stroke: {
        show: true,
        width: 4,
        colors: ["transparent"],
    },
    xaxis: {
        categories: [], // Akan diisi berdasarkan bulan dari API
        axisBorder: { show: false },
        axisTicks: { show: false },
    },
    legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
        fontFamily: "Outfit",
    },
    yaxis: { title: { text: undefined } },
    grid: {
        yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
        x: { show: false },
        y: {
            formatter: (val) => `${val}`,
        },
    },
};

export default function MonthlyAppointmentChart() {
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ambil data ringkasan janji temu bulanan
    useEffect(() => {
        const fetchMonthlySummary = async () => {
            try {
                const data = await getMonthlyAppointmentSummary(); // Ambil data dari API
                setMonthlySummary(data.data.monthlyStats); // Menyimpan data ke state
            } catch (err) {
                setError('Failed to load monthly summary');
                console.error(err);
            } finally {
                setLoading(false); // Set loading selesai
            }
        };

        fetchMonthlySummary();
    }, []);

    // Menyusun data untuk chart
    const months = [];
    const appointments = [];

    if (!loading && !error && monthlySummary.length > 0) {
        monthlySummary.forEach((item) => {
            months.push(item.month); // Menyimpan bulan (2025-01, 2025-02, dst)
            appointments.push(parseInt(item.total_appointments)); // Menyimpan total janji temu
        });
    }

    // Jika data sedang dimuat atau error
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Update kategori bulan berdasarkan data dari API
    options.xaxis.categories = months;

    // Data untuk grafik
    const series = [
        {
            name: "Total Appointments",
            data: appointments,
        },
    ];

    return (
        <div>
            <BarChartTwo
                title="Total Pengajuan Janji Temu Per Bulan"
                options={options}
                series={series}
                height={180}
            />
        </div>
    );
}
