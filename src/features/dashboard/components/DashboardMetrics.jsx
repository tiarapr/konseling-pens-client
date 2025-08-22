import { useEffect, useState } from "react";
import { getDashboardSummary } from "@/services/DashboardService";
import { UserIcon, CalenderIcon } from "@/icons";
import MetricItem from "@/components/common/MetricItem";

const DashboardMetrics = () => {
    const [dashboardSummary, setDashboardSummary] = useState({
        total_appointments: 0,
        confirmed_appointments: 0,
        total_sessions: 0,
        total_completed_sessions: 0,
        total_students: 0,
        total_counselors: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDashboardSummary();
                setDashboardSummary(data.data.summary); // Mengambil data summary
            } catch (error) {
                console.error("Error fetching dashboard summary:", error);
            }
        };

        fetchData();
    }, []);

    // Konversi nilai string ke number
    const totalAppointments = parseInt(dashboardSummary.total_appointments);
    const confirmedAppointments = parseInt(dashboardSummary.confirmed_appointments);
    const totalSessions = parseInt(dashboardSummary.total_sessions);
    const totalCompletedSessions = parseInt(dashboardSummary.total_completed_sessions);
    const totalStudents = parseInt(dashboardSummary.total_students); // Total mahasiswa
    const totalCounselors = parseInt(dashboardSummary.total_counselors); // Total konselor

    // Persentase Sesi Selesai
    const completedSessionsPercentage = (totalCompletedSessions * 100.0) / totalSessions || 0;

    // Status Positif untuk Total Konseling: Jika Sesi Selesai lebih dari 75%
    const isSessionsPositive = completedSessionsPercentage >= 75;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {/* Total Appointments Metric */}
            <MetricItem
                icon={<CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />}
                title="Total Janji Temu"
                value={totalAppointments} // Total Janji Temu
                percentage={confirmedAppointments} // Janji Temu yang Dikonfirmasi
                isPositive={confirmedAppointments >= totalAppointments} // Jika Dikonfirmasi >= Total
            />

            {/* Total Sessions Metric */}
            <MetricItem
                icon={<CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />}
                title="Total Konseling"
                value={totalSessions} // Total Sesi Konseling
                percentage={completedSessionsPercentage} // Persentase Sesi yang Selesai
                isPositive={isSessionsPositive} // Jika Sesi Selesai > 75%
            />

            {/* Total Students Metric */}
            <MetricItem
                icon={<UserIcon className="text-gray-800 size-6 dark:text-white/90" />}
                title="Total Mahasiswa"
                value={totalStudents} // Total Mahasiswa
                percentage={null} // Tidak ada persentase untuk Total Mahasiswa
                isPositive={null} // Selalu positif
            />

            {/* Total Counselors Metric */}
            <MetricItem
                icon={<UserIcon className="text-gray-800 size-6 dark:text-white/90" />}
                title="Total Konselor"
                value={totalCounselors} // Total Konselor
                percentage={null} // Tidak ada persentase untuk Total Konselor
                isPositive={null} // Selalu positif
            />
        </div>
    );
};

export default DashboardMetrics;
