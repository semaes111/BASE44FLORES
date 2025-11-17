import React from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

const colorClasses = {
  green: "from-green-500 to-emerald-600",
  blue: "from-blue-500 to-cyan-600",
  emerald: "from-emerald-500 to-teal-600",
  teal: "from-teal-500 to-green-600",
};

export default function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden border-green-200/50 shadow-sm hover:shadow-md transition-shadow">
        <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-br ${colorClasses[color]} rounded-full opacity-10`} />
        <CardHeader className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} bg-opacity-20`}>
              <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}