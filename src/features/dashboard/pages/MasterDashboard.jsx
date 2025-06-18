import PageMeta from "@/components/common/PageMeta";
import DashboardMetrics from "../components/DashboardMetrics";
import MonthlyAppointmentChart from "../components/MonthlyAppointmentChart";
import Rating from "../components/Rating";
import DemographicCard from "../components/DemographicCard";
import ProdiAppointmentRequestCard from "../components/ProdiAppointmentRequestCard";
import StatisticsChart from "../components/StatisticsChart";
import CounselorPerformance from "../components/CounselorPerformance";

export default function MasterDashboard() {
  return (
    <>
      <PageMeta
        title="Konseling PENS Dashboard"
        description="Halaman Statistik Dashboard"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <DashboardMetrics />
        </div>

        <div className="col-span-12 xl:col-span-5 space-y-4">
          <Rating />
        </div>

        <div className="col-span-12">
          <MonthlyAppointmentChart />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <ProdiAppointmentRequestCard />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12">
          <CounselorPerformance />
        </div>
      </div>
    </>
  );
}
