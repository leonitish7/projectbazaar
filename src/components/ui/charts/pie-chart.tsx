import * as React from "react";
import {
    Cell,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Sector,
} from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
    data: {
        name: string;
        value: number;
    }[];
    colors?: string[];
    valueFormatter?: (value: number) => string;
    showAnimation?: boolean;
    showTooltip?: boolean;
    showLabels?: boolean;
    height?: number;
    innerRadius?: number;
    outerRadius?: number;
    activeIndex?: number;
    donutChart?: boolean;
}

export function PieChart({
    data,
    colors = ["#2563eb", "#f97316", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1"],
    valueFormatter = (value: number) => value.toString(),
    showAnimation = true,
    showTooltip = true,
    showLabels = false,
    height = 300,
    innerRadius = 0,
    outerRadius = 80,
    activeIndex = -1,
    donutChart = false,
    className,
    ...props
}: PieChartProps) {
    const [activeSegment, setActiveSegment] = React.useState<number | undefined>(
        activeIndex >= 0 ? activeIndex : undefined
    );

    // Create a chartConfig for each data point
    const chartConfig = data.reduce(
        (acc, item, index) => {
            return {
                ...acc,
                [item.name]: {
                    label: item.name,
                    color: colors[index % colors.length],
                },
            };
        },
        {}
    );

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 10}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={innerRadius + (donutChart ? 10 : 0)}
                    outerRadius={outerRadius}
                    fill={fill}
                />
            </g>
        );
    };

    return (
        <div className={cn("w-full", className)} {...props}>
            <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height={height}>
                    <RechartsPieChart>
                        {showTooltip && (
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        labelClassName="font-medium text-foreground"
                                    />
                                }
                            />
                        )}
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={showLabels}
                            innerRadius={donutChart ? innerRadius || 60 : innerRadius}
                            outerRadius={outerRadius}
                            dataKey="value"
                            activeIndex={activeSegment}
                            activeShape={renderActiveShape}
                            onMouseEnter={(_, index) => setActiveSegment(index)}
                            onMouseLeave={() => setActiveSegment(activeIndex >= 0 ? activeIndex : undefined)}
                            isAnimationActive={showAnimation}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                    stroke="transparent"
                                />
                            ))}
                        </Pie>
                    </RechartsPieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}