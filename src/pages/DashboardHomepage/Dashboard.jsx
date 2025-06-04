import StatisticsChart from "../../components/features/dashboard-widget/StatisticsChart";
import DemographicCard from "../../components/features/dashboard-widget/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import DashboardMetrics from "../../components/features/dashboard-widget/DashboardMetrics";
import Rating from "../../components/features/dashboard-widget/Rating";
import MonthlyAppointmentChart from "../../components/features/dashboard-widget/MonthlyAppointmentChart";
import ProdiAppointmentRequestCard from "../../components/features/dashboard-widget/ProdiAppointmentRequestCard";
import CounselorPerformance from "../../components/features/dashboard-widget/CounselorPerformance";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Konseling PENS Dashboard"
        description="Halaman Statistik Dashboard"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <DashboardMetrics />
          <MonthlyAppointmentChart />
        </div>

        <div className="col-span-12 xl:col-span-5 space-y-4">
          <Rating />
          <DemographicCard />
          <ProdiAppointmentRequestCard/>
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
