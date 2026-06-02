"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart3,
    LineChart,
    PieChart,
    TrendingUp,
    TrendingDown,
    Users,
    Globe,
    ShoppingCart,
    Laptop,
    Smartphone,
    Tablet,
    CircleDollarSign
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for revenue over time
const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            name: '2024',
            data: [35000, 42000, 31000, 45000, 55000, 60000, 52000, 59000, 70000, 91000, 82000, 95000]
        },
        {
            name: '2025',
            data: [45000, 52000, 49000, 60000, 72000, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};

// Mock data for traffic sources
const trafficSources = [
    { source: 'Direct', percentage: 35, value: 12348 },
    { source: 'Organic Search', percentage: 28, value: 9879 },
    { source: 'Social Media', percentage: 22, value: 7759 },
    { source: 'Referral', percentage: 10, value: 3525 },
    { source: 'Email', percentage: 5, value: 1763 }
];

// Device breakdown
const deviceBreakdown = [
    { device: 'Desktop', percentage: 52, icon: Laptop },
    { device: 'Mobile', percentage: 38, icon: Smartphone },
    { device: 'Tablet', percentage: 10, icon: Tablet }
];

// Performance metrics
const performanceMetrics = [
    {
        title: "Conversion Rate",
        value: "3.2%",
        change: "+0.4%",
        trend: "up",
        description: "vs. last month"
    },
    {
        title: "Avg. Order Value",
        value: "₹2,577",
        change: "+5.1%",
        trend: "up",
        description: "vs. last month"
    },
    {
        title: "Cart Abandonment",
        value: "24.8%",
        change: "-2.3%",
        trend: "up", // up is good here (down is good for abandonment)
        description: "vs. last month"
    },
    {
        title: "Customer Retention",
        value: "68.5%",
        change: "+1.2%",
        trend: "up",
        description: "vs. last month"
    }
];

export default function AnalyticsOverview() {
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Analytics Overview</h1>
                    <p className="text-muted-foreground">Monitor key metrics and performance indicators</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select defaultValue="30d">
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Time Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="3m">Last 3 months</SelectItem>
                            <SelectItem value="6m">Last 6 months</SelectItem>
                            <SelectItem value="1y">Last year</SelectItem>
                            <SelectItem value="all">All time</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {performanceMetrics.map((metric, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {metric.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${metric.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                {metric.trend === 'up' ?
                                    <TrendingUp className="h-4 w-4 text-green-600" /> :
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                }
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <div className="flex items-center text-xs mt-1">
                                <span className={`flex items-center ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {metric.trend === 'up' ?
                                        <TrendingUp className="h-3 w-3 mr-1" /> :
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                    }
                                    {metric.change}
                                </span>
                                <span className="text-muted-foreground ml-1">{metric.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Analytics Section */}
            <div className="grid gap-6 md:grid-cols-3 mb-6">
                {/* Revenue Chart */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Revenue Growth</CardTitle>
                                <CardDescription>Monthly revenue comparison</CardDescription>
                            </div>
                            <Select defaultValue="monthly">
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="View" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t pt-4">
                        <div className="w-full h-full">
                            {/* Placeholder for actual chart */}
                            <div className="text-center h-full flex flex-col items-center justify-center">
                                <LineChart className="h-10 w-10 text-muted-foreground/60 mb-2" />
                                <p className="text-sm text-muted-foreground">Revenue chart visualization</p>
                                <p className="text-xs text-muted-foreground mt-1">Monthly revenue growth 2024-2025</p>
                                <div className="flex items-center mt-4 gap-4">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                        <span className="text-xs">2024</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                        <span className="text-xs">2025</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Traffic Sources */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Traffic Sources</CardTitle>
                        <CardDescription>Where your visitors come from</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {trafficSources.map((source, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{source.source}</span>
                                        <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                                        <div
                                            className="bg-primary h-2.5 rounded-full"
                                            style={{ width: `${source.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{source.value.toLocaleString()} visitors</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Device & Regional Breakdown */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
                {/* Device Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Device Breakdown</CardTitle>
                        <CardDescription>Sessions by device type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center h-[220px]">
                            {/* Pie chart placeholder */}
                            <div className="w-[140px] h-[140px] relative rounded-full border-8 border-blue-500 flex items-center justify-center">
                                <div className="w-[110px] h-[110px] relative rounded-full border-8 border-green-500 flex items-center justify-center">
                                    <div className="w-[80px] h-[80px] relative rounded-full border-8 border-yellow-500"></div>
                                </div>
                                <PieChart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/80" />
                            </div>

                            {/* Legend */}
                            <div className="space-y-4">
                                {deviceBreakdown.map((device, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${index === 0 ? 'bg-blue-500' :
                                                index === 1 ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}></div>
                                        <div className="flex items-center gap-2">
                                            <device.icon className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm font-medium">{device.device}</div>
                                                <div className="text-xs text-muted-foreground">{device.percentage}%</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Regional Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Regional Performance</CardTitle>
                        <CardDescription>Sales by region</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[220px] flex items-center justify-center">
                            <div className="text-center">
                                <Globe className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
                                <div className="space-y-3 max-w-xs mx-auto">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">North India</span>
                                        <span className="text-sm font-medium">42%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">South India</span>
                                        <span className="text-sm font-medium">28%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Other Regions</span>
                                        <span className="text-sm font-medium">30%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sales Analytics */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Sales Analytics</CardTitle>
                            <CardDescription>Product category performance</CardDescription>
                        </div>
                        <Tabs defaultValue="units">
                            <TabsList>
                                <TabsTrigger value="units">Units</TabsTrigger>
                                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                            <p className="text-sm text-muted-foreground mb-4">Sales by product category</p>

                            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">254</div>
                                    <div className="text-xs text-muted-foreground">AI & ML Kits</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">198</div>
                                    <div className="text-xs text-muted-foreground">Arduino Kits</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">156</div>
                                    <div className="text-xs text-muted-foreground">Web Dev</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">145</div>
                                    <div className="text-xs text-muted-foreground">Robotics</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">132</div>
                                    <div className="text-xs text-muted-foreground">Game Dev</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">112</div>
                                    <div className="text-xs text-muted-foreground">Other</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}