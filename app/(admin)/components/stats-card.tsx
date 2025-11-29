import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
}: StatsCardProps) {
  return (
    <Card className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>

          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mt-2">
            {value}
          </p>

          {trend && (
            <p
              className={`text-sm mt-2 ${
                trendUp
                  ? "text-neutral-700 dark:text-neutral-300"
                  : "text-neutral-500 dark:text-neutral-500"
              }`}
            >
              {trend} from last month
            </p>
          )}
        </div>

        <div className="rounded-full bg-neutral-200 dark:bg-neutral-800 p-3">
          <Icon className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
        </div>
      </div>
    </Card>
  );
}
