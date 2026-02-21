import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
}

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue,
  color = "primary" 
}: StatCardProps) => {
  const colorClasses = {
    primary: "from-cyan-400 to-blue-500",
    success: "from-green-400 to-emerald-500",
    warning: "from-yellow-400 to-orange-500",
    info: "from-blue-400 to-indigo-500",
  };

  const gradientClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="stat-card group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradientClass} bg-opacity-10`}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && trendValue && (
          <span className={`text-sm font-medium ${
            trend === "up" ? "text-success" : 
            trend === "down" ? "text-destructive" : 
            "text-muted-foreground"
          }`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {trendValue}
          </span>
        )}
      </div>
      
      <h3 className="text-3xl font-bold text-foreground mb-1 group-hover:text-glow transition-all">
        {value}
      </h3>
      
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      
      {subtitle && (
        <p className="text-xs text-muted-foreground/70 mt-2">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default StatCard;
