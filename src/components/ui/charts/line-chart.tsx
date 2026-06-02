import * as React from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart as RechartsLineChart,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
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
    showDots?: boolean;
    curveType?: "linear" | "natural" | "monotone" | "step";
    height?: number;
    strokeWidth?: number;
}

export function LineChart({
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
    showDots = true,
    curveType = "monotone",
    height = 300,
    strokeWidth = 2,
    className,
    ...props
}: LineChartProps) {
    // Create a config object for the chart
    const chartConfig = categories.reduce((acc, category, index) => {
        return {
            ...acc,
            [category]: {
                label: category,
                color: colors[index % colors.length]
            }
        };
    }, {});

    return (
        <div className={cn("w-full", className)} {...props}>
            <ChartContainer
                config={chartConfig}
                className="h-full w-full"
            >
                <ResponsiveContainer width="100%" height={height}>
                    <RechartsLineChart
                        data={data}
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
                                horizontal
                                vertical={false}
                                stroke="#e5e7eb"
                            />
                        )}
                        {showXAxis && (
                            <XAxis
                                dataKey={index}
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
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={valueFormatter}
                                tick={{ fontSize: 12 }}
                            />
                        )}
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelClassName="font-medium text-foreground"
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
                        {categories.map((category, index) => (
                            <Line
                                key={category}
                                type={curveType}
                                dataKey={category}
                                stroke={colors[index % colors.length]}
                                strokeWidth={strokeWidth}
                                dot={showDots ? { r: 3 } : false}
                                activeDot={showDots ? { r: 4, strokeWidth: 1 } : false}
                                isAnimationActive={showAnimation}
                            />
                        ))}
                    </RechartsLineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}