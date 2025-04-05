import React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function BarChart({ data, xKey, yKey, className = "" }: { data: any[]; xKey: string; yKey: string | string[]; className?: string }) {
  const yKeys = Array.isArray(yKey) ? yKey : [yKey];

  return (
    <ResponsiveContainer width="100%" height={350} className={className}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {yKeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function LineChart({ data, xKey, yKey, className = "" }: { data: any[]; xKey: string; yKey: string | string[]; className?: string }) {
  const yKeys = Array.isArray(yKey) ? yKey : [yKey];

  return (
    <ResponsiveContainer width="100%" height={350} className={className}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {yKeys.map((key, index) => (
          <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} activeDot={{ r: 8 }} />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function AreaChart({ data, xKey, yKey, className = "" }: { data: any[]; xKey: string; yKey: string; className?: string }) {
  return (
    <ResponsiveContainer width="100%" height={350} className={className}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey={yKey} stroke="#8884d8" fill="#8884d8" />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

export function PieChart({ data, nameKey, valueKey, className = "" }: { data: any[]; nameKey: string; valueKey: string; className?: string }) {
  return (
    <ResponsiveContainer width="100%" height={350} className={className}>
      <RechartsPieChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={nameKey}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data, nameKey, valueKey, className = "" }: { data: any[]; nameKey: string; valueKey: string; className?: string }) {
  return (
    <ResponsiveContainer width="100%" height={350} className={className}>
      <RechartsPieChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey={valueKey}
          nameKey={nameKey}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}