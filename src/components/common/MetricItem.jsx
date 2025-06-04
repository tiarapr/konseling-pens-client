import {
  ArrowDownIcon,
  ArrowUpIcon
} from "../../icons";
import Badge from "../ui/badge/Badge";

const MetricItem = ({ icon, title, value, percentage, isPositive }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800 md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{value}</h4>
        </div>

        {/* Menampilkan Badge hanya jika percentage dan isPositive ada */}
        {percentage !== null && isPositive !== null && (
          <Badge color={isPositive ? "success" : "error"}>
            {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {percentage}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default MetricItem;
