import { cn } from '../../lib/utils';

export default function StatsCard({ title, value, icon: Icon, trend, trendUp, description, color = "blue" }) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={cn("p-3 rounded-lg", colorStyles[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {(trend || description) && (
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span className={cn(
              "font-medium mr-2",
              trendUp ? "text-green-600" : "text-red-600"
            )}>
              {trendUp ? "+" : ""}{trend}
            </span>
          )}
          {description && (
            <span className="text-slate-400">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
