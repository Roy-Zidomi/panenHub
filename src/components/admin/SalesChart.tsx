"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartColumn } from "lucide-react";

interface SalesChartProps {
    data: Array<{
        date: string;
        revenue: number;
    }>;
}

export function SalesChart({ data }: SalesChartProps) {
    const hasData = data.some((item) => item.revenue > 0);
    const currency = new Intl.NumberFormat("id-ID");

    if (!hasData) {
        return (
            <div className="flex h-[350px] items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 text-center">
                <div className="space-y-2">
                    <ChartColumn className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="font-medium">Belum ada penjualan di periode ini</p>
                    <p className="text-sm text-muted-foreground">
                        Grafik akan otomatis tampil setelah ada transaksi baru.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0.65} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" />
                <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={64}
                    tickFormatter={(value: number) => `Rp ${currency.format(value)}`}
                />
                <Tooltip
                    cursor={{ fill: "rgba(148, 163, 184, 0.12)" }}
                    formatter={(value: number) => [`Rp ${currency.format(value)}`, "Pendapatan"]}
                    labelFormatter={(label) => `Tanggal: ${label}`}
                    contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        borderRadius: "12px",
                        border: "1px solid rgba(148, 163, 184, 0.35)",
                        color: "#f8fafc",
                    }}
                />
                <Bar
                    dataKey="revenue"
                    fill="url(#salesGradient)"
                    radius={[10, 10, 0, 0]}
                    barSize={34}
                    animationDuration={280}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`${entry.date}-${index}`}
                            fill={entry.revenue > 0 ? "url(#salesGradient)" : "rgba(148,163,184,0.3)"}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
