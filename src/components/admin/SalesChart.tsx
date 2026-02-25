"use client";

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

interface SalesChartProps {
    data: any[];
}

export function SalesChart({ data }: SalesChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rp${value.toLocaleString()}`}
                />
                <Tooltip
                    formatter={(value: any) => [`Rp ${value.toLocaleString()}`, "Pendapatan"]}
                    contentStyle={{ backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
