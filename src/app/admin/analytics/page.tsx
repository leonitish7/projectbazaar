"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown, Download, Filter, Globe, InfoIcon, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { LineChart } from '@/components/ui/charts/line-chart';
import { BarChart } from '@/components/ui/charts/bar-chart';
import { PieChart } from '@/components/ui/charts/pie-chart';
import { useTheme } from 'next-themes';

export default function AnalyticsPage() {
    const { user, token } = useAuth();
    const { toast } = useToast();
    const [timeRange, setTimeRange] = useState('30d');
    const [isLoading, setIsLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState<any>({
        revenue: {},
        orders: {},
        users: {},
        projectTypes: {},
        conversion: {},
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (user?.isAdmin) {
                try {
                    setIsLoading(true);
                    // In a real app, you would fetch from your API
                    // const response = await fetchAPI(`/api/admin/analytics?timeRange=${timeRange}`, {
                    //   headers: { Authorization: `Bearer ${token}` }
                    // });
                    // setAnalyticsData(response?.data || getMockAnalyticsData());

                    // Using mock data for now
                    setTimeout(() => {
                        setAnalyticsData(getMockAnalyticsData());
                        setIsLoading(false);
                    }, 1000);
                } catch (error) {
                    console.error('Error fetching analytics:', error);
                    toast({
                        variant: "destructive",
                        title: "Error fetching analytics",
                        description: "Could not load analytics data. Please try again later.",
                    });
                    setIsLoading(false);
                }
            }
        };

        fetchAnalytics();
    }, [user, token, timeRange, toast]);

    const getMockAnalyticsData = () => {
        // Mock data for demonstration
        return {
            summary: {
                totalRevenue: 125750,
                revenueChange: 12.5,
                averageOrderValue: 5500,
                aovChange: 8.2,
                totalOrders: 24,
                ordersChange: 15.3,
                conversionRate: 3.2,
                conversionChange: 0.5,
                visitsToday: 325,
                visitsChange: 7.8,
                newUsers: 45,
                usersChange: 10.2
            },
            revenue: {
                daily: {
                    labels: ['Apr 13', 'Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19', 'Apr 20'],
                    datasets: [
                        {
                            label: 'Revenue',
                            data: [9500, 12000, 7500, 8000, 15000, 10750, 18000, 9500],
                        }
                    ]
                },
                monthly: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Revenue 2025',
                            data: [55000, 62000, 75000, 125750, 0, 0, 0, 0, 0, 0, 0, 0],
                        },
                        {
                            label: 'Revenue 2024',
                            data: [45000, 52000, 58000, 108000, 132000, 98000, 85000, 92000, 105000, 115000, 125000, 142000],
                        }
                    ]
                }
            },
            orders: {
                daily: {
                    labels: ['Apr 13', 'Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19', 'Apr 20'],
                    datasets: [
                        {
                            label: 'Orders',
                            data: [2, 3, 1, 2, 3, 2, 4, 2],
                        }
                    ]
                }
            },
            users: {
                daily: {
                    labels: ['Apr 13', 'Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19', 'Apr 20'],
                    datasets: [
                        {
                            label: 'New Users',
                            data: [5, 7, 4, 6, 8, 5, 10, 8],
                        },
                        {
                            label: 'Active Users',
                            data: [18, 22, 15, 20, 25, 19, 28, 23],
                        }
                    ]
                }
            },
            projectTypes: {
                labels: ['Web Dev', 'AI Projects', 'Mobile Apps', 'Game Dev', 'Robotics', 'Arduino', 'Marketing', 'Management'],
                datasets: [
                    {
                        data: [35, 20, 15, 10, 7, 5, 5, 3],
                    }
                ]
            },
            topProjects: [
                { name: 'E-commerce Website', revenue: 25000, orders: 5, conversion: 4.8 },
                { name: 'AI Chatbot', revenue: 18500, orders: 4, conversion: 4.2 },
                { name: 'Mobile App Template', revenue: 15000, orders: 3, conversion: 3.9 },
                { name: 'Portfolio Website', revenue: 12500, orders: 3, conversion: 3.5 },
                { name: 'Game Asset Pack', revenue: 10000, orders: 2, conversion: 3.0 }
            ],
            conversion: {
                labels: ['Apr 13', 'Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19', 'Apr 20'],
                datasets: [
                    {
                        label: 'Conversion Rate (%)',
                        data: [2.8, 3.1, 2.5, 2.9, 3.4, 3.0, 3.5, 3.2],
                    }
                ]
            },
            geographicData: {
                labels: ['India', 'United States', 'United Kingdom', 'Australia', 'Canada', 'Germany', 'UAE', 'Others'],
                datasets: [
                    {
                        data: [45, 18, 12, 8, 6, 5, 4, 2],
                    }
                ]
            }
        };
    };

    const exportAnalytics = () => {
        // In a real app, this would generate a CSV or PDF export
        toast({
            title: "Analytics Export",
            description: "Your export is being prepared and will download shortly.",
        });
    };

    const StatCard = ({ title, value, change, prefix = '', suffix = '', icon }: any) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{prefix}{value}{suffix}</div>
                <div className="flex items-center pt-1">
                    {change > 0 ? (
                        <>
                            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">+{change}%</span>
                        </>
                    ) : (
                        <>
                            <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                            <span className="text-xs text-red-600">{change}%</span>
                        </>
                    )}
                    <span className="text-xs text-muted-foreground ml-1">from previous period</span>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Analytics & Reports</h1>
                    <p className="text-muted-foreground text-sm">Track key metrics and business performance</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={exportAnalytics}>
                        <Download className="h-4 w-4 mr-1" />
                        Export Analytics
                    </Button>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last 3 Months</SelectItem>
                            <SelectItem value="6m">Last 6 Months</SelectItem>
                            <SelectItem value="1y">Last Year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent h-12 w-12 rounded-full animate-spin"></div>
                        <p className="text-muted-foreground">Loading analytics data...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Revenue"
                            value={analyticsData.summary.totalRevenue.toLocaleString('en-IN')}
                            prefix="₹"
                            change={analyticsData.summary.revenueChange}
                            icon={<DollarSign className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Orders"
                            value={analyticsData.summary.totalOrders}
                            change={analyticsData.summary.ordersChange}
                            icon={<ShoppingCart className="h-4 w-4" />}
                        />
                        <StatCard
                            title="Conversion Rate"
                            value={analyticsData.summary.conversionRate}
                            suffix="%"
                            change={analyticsData.summary.conversionChange}
                            icon={<TrendingUp className="h-4 w-4" />}
                        />
                        <StatCard
                            title="New Users"
                            value={analyticsData.summary.newUsers}
                            change={analyticsData.summary.usersChange}
                            icon={<Users className="h-4 w-4" />}
                        />
                    </div>

                    <Tabs defaultValue="revenue" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
                            <TabsTrigger value="revenue">Revenue</TabsTrigger>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="users">Users</TabsTrigger>
                            <TabsTrigger value="conversion">Conversion</TabsTrigger>
                        </TabsList>

                        <TabsContent value="revenue" className="mt-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Revenue Overview</CardTitle>
                                    <CardDescription>
                                        Total revenue generated across all products
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px]">
                                        <LineChart
                                            data={analyticsData.revenue.monthly}
                                            categories={analyticsData.revenue.monthly.labels}
                                            index="Revenue"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <InfoIcon className="h-4 w-4 mr-2" />
                                        YoY Growth: +16.4%
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="orders" className="mt-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Order Trends</CardTitle>
                                    <CardDescription>
                                        Number of orders received over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px]">
                                        <BarChart
                                            data={analyticsData.orders.daily}
                                            categories={analyticsData.orders.daily.labels}
                                            index="Orders"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <InfoIcon className="h-4 w-4 mr-2" />
                                        Average Order Value: ₹{analyticsData.summary.averageOrderValue.toLocaleString('en-IN')}
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="users" className="mt-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">User Activity</CardTitle>
                                    <CardDescription>
                                        New and active users over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px]">
                                        <LineChart
                                            data={analyticsData.users.daily}
                                            categories={analyticsData.users.daily.labels}
                                            index="New Users"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <InfoIcon className="h-4 w-4 mr-2" />
                                        Return User Rate: 42.5%
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="conversion" className="mt-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Conversion Rate</CardTitle>
                                    <CardDescription>
                                        Percentage of visitors who complete a purchase
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px]">
                                        <LineChart
                                            data={analyticsData.conversion}
                                            categories={analyticsData.conversion.labels}
                                            index="Conversion Rate (%)"
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <InfoIcon className="h-4 w-4 mr-2" />
                                        Cart Abandonment Rate: 68.2%
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Popular Project Categories</CardTitle>
                                <CardDescription>
                                    Distribution of sales by project category
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <PieChart
                                        data={analyticsData.projectTypes}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Geographic Distribution</CardTitle>
                                <CardDescription>
                                    Customer distribution by country
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center">
                                    <div className="relative h-[280px] w-[280px]">
                                        <PieChart
                                            data={analyticsData.geographicData}
                                        />
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <Globe className="h-12 w-12 text-muted-foreground/30" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Top Performing Projects</CardTitle>
                            <CardDescription>
                                Projects generating the most revenue
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 font-medium">Project</th>
                                        <th className="text-right py-3 font-medium">Revenue</th>
                                        <th className="text-right py-3 font-medium">Orders</th>
                                        <th className="text-right py-3 font-medium">Conversion Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analyticsData.topProjects.map((project: any, index: number) => (
                                        <tr key={index} className="border-b last:border-0">
                                            <td className="py-3">{project.name}</td>
                                            <td className="py-3 text-right">₹{project.revenue.toLocaleString('en-IN')}</td>
                                            <td className="py-3 text-right">{project.orders}</td>
                                            <td className="py-3 text-right">{project.conversion}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}