import Chart from "react-apexcharts";

export default function BarChartOne({
  id = "bar-chart",
  options = {},
  series = [],
  height = 180,
  minWidth = "1000px",
}) {
  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id={id} className={`min-w-[${minWidth}]`}>
        <Chart options={options} series={series} type="bar" height={height} />
      </div>
    </div>
  );
}
