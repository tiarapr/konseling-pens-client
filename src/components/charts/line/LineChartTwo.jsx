import Chart from "react-apexcharts";
import TabSwitcher from "@/components/common/TabSwitcher";
import { useState } from "react";

const LineChartTwo = ({
  title,
  description,
  options,
  series,
  tabs = [],
  onTabChange,
  chartType = "area",
  height = 310,
  loading = false,
  error = null
}) => {
  // Handle default tab selection
  const [activeTab, setActiveTab] = useState(tabs[0]?.value);

  const handleTabSwitch = (value) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-gray-800 sm:px-6 sm:pt-6">
      {/* Header section */}
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          {title && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Conditional render tabs only if provided */}
        {tabs?.length > 0 && (
          <div className="flex items-start w-full gap-3 sm:justify-end">
            <TabSwitcher
              options={tabs}
              defaultValue={activeTab}
              onChange={handleTabSwitch}
            />
          </div>
        )}
      </div>

      {/* Chart content */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {loading ? (
            <div className="flex items-center justify-center" style={{ height }}>
              <div className="animate-pulse text-gray-500">Memuat data...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center" style={{ height }}>
              <div className="text-red-500">Gagal memuat data: {error.message}</div>
            </div>
          ) : (
            <Chart 
              options={options} 
              series={series} 
              type={chartType} 
              height={height} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LineChartTwo;