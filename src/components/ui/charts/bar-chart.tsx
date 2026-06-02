import * as React from "react";
import {
    Bar,
    BarChart as RechartsBarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data: any[];
    categories: string[];
    index: string;
    colors?: string[];
    valueFormatter?: (value: number) => string;
    yAxisWidth?: number;
    showAnimation?: boolean;
    showLegend?: boolean;
    showGrid?: boolean;
    showYAxis?: boolean;
    showXAxis?: boolean;
    layout?: "vertical" | "horizontal";
    height?: number;
    stack?: boolean;
    barSize?: number;
}

export function BarChart({
    data,
    index,
    categories,
    colors = ["#2563eb", "#f97316", "#10b981", "#ef4444", "#8b5cf6"],
    valueFormatter = (value: number) => value.toString(),
    yAxisWidth = 56,
    showAnimation = true,
    showLegend = true,
    showGrid = true,
    showYAxis = true,
    showXAxis = true,
    layout = "horizontal",
    height = 300,
    stack = false,
    barSize = 24,
    className,
    ...props
}: BarChartProps) {
    // Create a config object for the chart
    const chartConfig: Record<string, { label: string; color: string }> = categories.reduce((acc, category, index) => {
        return {
            ...acc,
            [category]: {
                label: category,
                color: colors[index % colors.length],
            },
        };
    }, {});

    return (
        <div className={cn("w-full", className)} {...props}>
            <ChartContainer
                config={chartConfig}
                className="h-full w-full"
            >
                <ResponsiveContainer width="100%" height={height}>
                    <RechartsBarChart
                        data={data}
                        layout={layout}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 10,
                        }}
                    >
                        {showGrid && (
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={layout === "horizontal"}
                                vertical={layout === "vertical"}
                                stroke="#e5e7eb"
                            />
                        )}
                        {showXAxis && (
                            <XAxis
                                dataKey={layout === "horizontal" ? index : undefined}
                                type={layout === "horizontal" ? "category" : "number"}
                                tick={{ fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                padding={{ left: 10, right: 10 }}
                                minTickGap={5}
                            />
                        )}
                        {showYAxis && (
                            <YAxis
                                width={yAxisWidth}
                                dataKey={layout === "vertical" ? index : undefined}
                                type={layout === "vertical" ? "category" : "number"}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={layout === "horizontal" ? valueFormatter : undefined}
                                tick={{ fontSize: 12 }}
                            />
                        )}
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelClassName="font-medium text-foreground"
                                    // valueFormatter={valueFormatter}
                                />
                            }
                        />
                        {showLegend && (
                            <Legend
                                content={<ChartLegendContent />}
                                verticalAlign="bottom"
                                height={40}
                            />
                        )}
                        {categories.map((category) => (
                            <Bar
                                key={category}
                                dataKey={category}
                                fill={chartConfig[category].color}
                                stackId={stack ? "stack" : undefined}
                                isAnimationActive={showAnimation}
                                barSize={barSize}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </RechartsBarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}