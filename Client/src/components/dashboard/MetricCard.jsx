import { cn } from "../../lib/utils";

const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  delay = 0,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-5 border border-gray-200 shadow-sm",
        "hover:shadow-md transition-all duration-300",
        "animate-fade-in",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-gray-100 border border-gray-200">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>

        {trend && (
          <div
            className={cn(
              "px-2 py-1 rounded-md text-xs font-medium",
              trend.isPositive
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>

        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
