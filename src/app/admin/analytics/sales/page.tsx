"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, LineChart, BarChart2, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SalesAnalyticsPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Date Range
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardDescription>Total Revenue</CardDescription>
                            <span className="text-green-500 text-sm flex items-center">
                                <ArrowUpDown className="h-3 w-3 mr-1" />
                                12.5%
                            </span>
                        </div>
                        <CardTitle className="text-2xl">$24,835.00</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-10 w-full bg-muted/40 rounded-md overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-primary/80"
                                style={{ width: '65%' }}
                            ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            65% of monthly target ($38,000)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardDescription>Average Order Value</CardDescription>
                            <span className="text-green-500 text-sm flex items-center">
                                <ArrowUpDown className="h-3 w-3 mr-1" />
                                3.2%
                            </span>
                        </div>
                        <CardTitle className="text-2xl">$45.78</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-1 h-10">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-primary/80 rounded-sm"
                                    style={{ height: `${60 + Math.random() * 40}%` }}
                                ></div>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Last 7 days trend
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardDescription>Conversion Rate</CardDescription>
                            <span className="text-red-500 text-sm flex items-center">
                                <ArrowUpDown className="h-3 w-3 mr-1" />
                                -1.1%
                            </span>
                        </div>
                        <CardTitle className="text-2xl">3.42%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end h-10 space-x-1">
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-[20%]"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-[40%]"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-[60%]"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-[80%]"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-[70%]"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-[60%]"></div>
                            <div className="flex-1 bg-primary/30 rounded-t-sm h-[50%]"></div>
                            <div className="flex-1 bg-primary/40 rounded-t-sm h-[60%]"></div>
                            <div className="flex-1 bg-primary/50 rounded-t-sm h-[70%]"></div>
                            <div className="flex-1 bg-primary/60 rounded-t-sm h-[65%]"></div>
                            <div className="flex-1 bg-primary/70 rounded-t-sm h-[75%]"></div>
                            <div className="flex-1 bg-primary/80 rounded-t-sm h-[90%]"></div>
                            <div className="flex-1 bg-primary rounded-t-sm h-[100%]"></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Trending up this month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Sales Trends Chart */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Sales Trends</CardTitle>
                            <CardDescription>Detailed view of sales performance over time</CardDescription>
                        </div>
                        <Select defaultValue="90days">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">Last 7 days</SelectItem>
                                <SelectItem value="30days">Last 30 days</SelectItem>
                                <SelectItem value="90days">Last 90 days</SelectItem>
                                <SelectItem value="year">This year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-80 w-full border-2 border-dashed border-muted rounded-md flex items-center justify-center bg-muted/20">
                        <div className="text-center">
                            <LineChart className="h-10 w-10 mx-auto text-muted-foreground" />
                            <p className="text-muted-foreground">Sales Trend Chart - Connect your chart library here</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Integrate a chart library like Chart.js, Recharts, or ApexCharts
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Sales Analysis Tabs */}
            <Tabs defaultValue="products">
                <TabsList>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="regions">Regions</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                            <CardDescription>Performance data for most popular products</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            <th className="px-4 py-3">Product Name</th>
                                            <th className="px-4 py-3">Sales</th>
                                            <th className="px-4 py-3">Revenue</th>
                                            <th className="px-4 py-3">Conversion</th>
                                            <th className="px-4 py-3">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { name: "AI Development Kit", sales: 122, revenue: "$4,327", conversion: "4.2%", trend: "up" },
                                            { name: "Robotics Starter Kit", sales: 98, revenue: "$3,890", conversion: "3.8%", trend: "up" },
                                            { name: "Web Development Course", sales: 87, revenue: "$2,654", conversion: "3.5%", trend: "down" },
                                            { name: "Game Development Kit", sales: 76, revenue: "$2,310", conversion: "3.1%", trend: "up" },
                                            { name: "Arduino Advanced Set", sales: 63, revenue: "$1,985", conversion: "2.8%", trend: "down" }
                                        ].map((item, i) => (
                                            <tr key={i} className="border-b hover:bg-muted/20">
                                                <td className="px-4 py-3">{item.name}</td>
                                                <td className="px-4 py-3">{item.sales}</td>
                                                <td className="px-4 py-3">{item.revenue}</td>
                                                <td className="px-4 py-3">{item.conversion}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block w-6 h-3 rounded-full ${item.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                                                        }`}></span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full border-2 border-dashed border-muted rounded-md flex items-center justify-center bg-muted/20">
                                <p className="text-muted-foreground">Categories Chart - Connect your chart library here</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="regions" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Regional Sales Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full border-2 border-dashed border-muted rounded-md flex items-center justify-center bg-muted/20">
                                <p className="text-muted-foreground">Regional Sales Map - Connect your mapping library here</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="customers" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Segments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full border-2 border-dashed border-muted rounded-md flex items-center justify-center bg-muted/20">
                                <p className="text-muted-foreground">Customer Segments Chart - Connect your chart library here</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Sales Forecasting */}
            <Card className="bg-muted/10 border-dashed">
                <CardHeader>
                    <CardTitle>Sales Forecast</CardTitle>
                    <CardDescription>Projected revenue for the next 30 days based on historical data</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-card p-4 rounded-md shadow-sm">
                            <h3 className="text-sm font-medium text-muted-foreground">Projected Revenue</h3>
                            <p className="text-2xl font-bold mt-1">$28,750</p>
                            <span className="text-green-500 text-sm">+15.7% vs current</span>
                        </div>

                        <div className="bg-card p-4 rounded-md shadow-sm">
                            <h3 className="text-sm font-medium text-muted-foreground">Projected Orders</h3>
                            <p className="text-2xl font-bold mt-1">648</p>
                            <span className="text-green-500 text-sm">+19.3% vs current</span>
                        </div>

                        <div className="bg-card p-4 rounded-md shadow-sm">
                            <h3 className="text-sm font-medium text-muted-foreground">Growth Confidence</h3>
                            <p className="text-2xl font-bold mt-1">87%</p>
                            <span className="text-muted-foreground text-sm">Based on 12-month data</span>
                        </div>
                    </div>

                    <div className="mt-6 h-40 w-full border-2 border-dashed border-muted rounded-md flex items-center justify-center bg-muted/20">
                        <p className="text-muted-foreground">Forecast Projection Chart - Connect your chart library here</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SalesAnalyticsPage;