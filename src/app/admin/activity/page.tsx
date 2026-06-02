"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Package, Users, FileText, Bell, Clock,
    CheckCircle, CreditCard, Star, Filter,
    Download, Calendar, Search, ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

// Activity item component
const ActivityItem = ({ activity }: { activity: any }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex gap-4 p-3 hover:bg-muted/30 rounded-lg transition-colors group border-b border-border/30 last:border-0"
        >
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white 
        ${activity.type === 'order' ? 'bg-primary' :
                    activity.type === 'payment' ? 'bg-green-500' :
                        activity.type === 'custom' ? 'bg-purple-500' :
                            activity.type === 'review' ? 'bg-yellow-500' : 'bg-blue-500'}
        group-hover:shadow-md group-hover:shadow-primary/20 transition-all`}>
                {activity.type === 'order' ? <Package className="h-4 w-4" /> :
                    activity.type === 'payment' ? <CreditCard className="h-4 w-4" /> :
                        activity.type === 'custom' ? <FileText className="h-4 w-4" /> :
                            activity.type === 'review' ? <Star className="h-4 w-4" /> :
                                <Users className="h-4 w-4" />}
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{activity.description}</p>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    {activity.user && (
                        <span className="text-muted-foreground">By: {activity.user}</span>
                    )}
                    {activity.userId && (
                        <span className="text-muted-foreground">User ID: {activity.userId}</span>
                    )}
                    {activity.email && (
                        <span className="text-muted-foreground">{activity.email}</span>
                    )}
                    {activity.ip && (
                        <span className="text-muted-foreground">IP: {activity.ip}</span>
                    )}
                    {activity.orderId && (
                        <Badge variant="outline" className="h-5 bg-muted/50 group-hover:bg-primary/10 transition-colors">
                            {activity.orderId}
                        </Badge>
                    )}
                    {activity.amount && (
                        <Badge className="h-5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            ₹{activity.amount.toLocaleString()}
                        </Badge>
                    )}
                    {activity.status && (
                        <Badge
                            variant="outline"
                            className={`h-5 
                ${activity.status === 'completed' ?
                                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                    activity.status === 'pending' ?
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}
                        >
                            {activity.status}
                        </Badge>
                    )}
                    {activity.project && (
                        <Badge variant="outline" className="h-5">
                            Project: {activity.project}
                        </Badge>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default function AdminActivityPage() {
    const { user, token } = useAuth();
    const [activityType, setActivityType] = useState<string>("all");
    const [timeRange, setTimeRange] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchActivityLogs = async () => {
            if (user?.isAdmin) {
                try {
                    setIsLoading(true);
                    // In a real app, you would fetch from your API
                    const response = await fetchAPI(`/api/admin/activity?type=${activityType}&timeRange=${timeRange}&search=${searchTerm}&page=${page}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // Fallback to mock data if API doesn't exist yet
                    setActivities(response?.activities || getMockActivityLogs());
                    setTotalPages(response?.totalPages || 10);
                } catch (error) {
                    console.error('Error fetching activity logs:', error);
                    setActivities(getMockActivityLogs());
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchActivityLogs();
    }, [user, token, activityType, timeRange, searchTerm, page]);

    const getMockActivityLogs = () => {
        // Mock data until real API is implemented
        return [
            {
                id: 'a1',
                type: 'order',
                description: 'New order received for Web Development Portfolio',
                time: '25 minutes ago',
                date: '2025-04-20T09:35:00',
                orderId: 'ORD-2025042',
                amount: 4999,
                user: 'Akshay Kumar',
                userId: 'usr_123456',
                email: 'akshay@example.com',
                ip: '103.25.45.122',
                status: 'pending'
            },
            {
                id: 'a2',
                type: 'custom',
                description: 'Custom request submitted for E-commerce Platform',
                time: '2 hours ago',
                date: '2025-04-20T08:12:00',
                status: 'pending',
                user: 'Priya Sharma',
                userId: 'usr_123457',
                email: 'priya.s@gmail.com',
                ip: '122.163.75.88'
            },
            {
                id: 'a3',
                type: 'payment',
                description: 'Payment received for AI Project',
                time: '3 hours ago',
                date: '2025-04-20T06:48:00',
                amount: 7500,
                orderId: 'ORD-2025041',
                user: 'Rahul Patel',
                userId: 'usr_123458',
                email: 'rahul.p@outlook.com',
                status: 'completed',
                ip: '152.57.142.90'
            },
            {
                id: 'a4',
                type: 'user',
                description: 'New user registered',
                time: '5 hours ago',
                date: '2025-04-20T04:30:00',
                user: 'Sneha Gupta',
                userId: 'usr_123459',
                email: 'sneha.g@yahoo.com',
                ip: '103.255.21.56'
            },
            {
                id: 'a5',
                type: 'review',
                description: '5-star review received for Mobile App Template',
                time: 'Yesterday',
                date: '2025-04-19T18:22:00',
                user: 'Vikram Singh',
                userId: 'usr_123460',
                email: 'vikram@company.com',
                project: 'Mobile E-commerce App',
                ip: '45.122.123.45'
            },
            {
                id: 'a6',
                type: 'order',
                description: 'Order completed and delivered',
                time: 'Yesterday',
                date: '2025-04-19T15:15:00',
                orderId: 'ORD-2025040',
                status: 'completed',
                user: 'Ananya Desai',
                userId: 'usr_123461',
                email: 'ananya.d@gmail.com',
                ip: '110.54.178.226',
                amount: 6500
            },
            {
                id: 'a7',
                type: 'payment',
                description: 'Refund processed for cancelled order',
                time: '2 days ago',
                date: '2025-04-18T11:05:00',
                orderId: 'ORD-2025038',
                status: 'refunded',
                user: 'Karan Mehta',
                userId: 'usr_123462',
                email: 'karan.m@company.net',
                amount: 3500,
                ip: '182.68.195.45'
            },
            {
                id: 'a8',
                type: 'user',
                description: 'User profile updated',
                time: '2 days ago',
                date: '2025-04-18T09:40:00',
                user: 'Ritu Kapoor',
                userId: 'usr_123463',
                email: 'ritu.k@outlook.com',
                ip: '103.169.82.54'
            },
            {
                id: 'a9',
                type: 'custom',
                description: 'Custom project requirements updated',
                time: '3 days ago',
                date: '2025-04-17T16:20:00',
                user: 'Amit Verma',
                userId: 'usr_123464',
                email: 'amit.v@gmail.com',
                status: 'in-progress',
                ip: '117.213.54.78'
            },
            {
                id: 'a10',
                type: 'order',
                description: 'Project delivery deadline extended',
                time: '3 days ago',
                date: '2025-04-17T13:10:00',
                orderId: 'ORD-2025035',
                status: 'in-progress',
                user: 'Neha Singh',
                userId: 'usr_123465',
                email: 'neha.s@company.org',
                project: 'Restaurant Management System',
                ip: '45.112.235.67'
            }
        ];
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
    };

    const exportToCSV = () => {
        // In a real app, this would generate a CSV of the activity logs
        alert('Exporting activity logs to CSV...');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Activity Logs</h1>
                    <p className="text-muted-foreground text-sm">Monitor all user and system activities</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                    </Button>
                    <Button variant="default" size="sm">
                        <Bell className="h-4 w-4 mr-1" />
                        Configure Alerts
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <form onSubmit={handleSearch} className="flex w-full space-x-2 md:col-span-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by user, order ID, or IP..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button type="submit">Search</Button>
                </form>

                <div className="flex gap-2">
                    <Select value={activityType} onValueChange={setActivityType}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Activity Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Activities</SelectItem>
                            <SelectItem value="order">Orders</SelectItem>
                            <SelectItem value="payment">Payments</SelectItem>
                            <SelectItem value="user">Users</SelectItem>
                            <SelectItem value="custom">Custom Requests</SelectItem>
                            <SelectItem value="review">Reviews</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="yesterday">Yesterday</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all" onClick={() => setActivityType("all")}>
                        All
                    </TabsTrigger>
                    <TabsTrigger value="order" onClick={() => setActivityType("order")}>
                        <Package className="h-4 w-4 mr-1" /> Orders
                    </TabsTrigger>
                    <TabsTrigger value="payment" onClick={() => setActivityType("payment")}>
                        <CreditCard className="h-4 w-4 mr-1" /> Payments
                    </TabsTrigger>
                    <TabsTrigger value="user" onClick={() => setActivityType("user")}>
                        <Users className="h-4 w-4 mr-1" /> Users
                    </TabsTrigger>
                    <TabsTrigger value="custom" onClick={() => setActivityType("custom")}>
                        <FileText className="h-4 w-4 mr-1" /> Custom
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Activity Log
                        </CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                    <CardDescription>
                        {activities.length} results found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent h-12 w-12 rounded-full animate-spin"></div>
                                <p className="text-muted-foreground">Loading activity logs...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {activities.map((activity) => (
                                <ActivityItem key={activity.id} activity={activity} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}