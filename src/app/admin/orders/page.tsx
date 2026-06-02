"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, MoreHorizontal, Download, Calendar, Eye, CheckCircle, CircleX, Clock, Download as DownloadIcon } from 'lucide-react';

// Mock order data
const mockOrders = [
    {
        id: 'ORD-3894',
        customer: 'Rahul Sharma',
        email: 'rahulsharma@gmail.com',
        date: '2025-04-18',
        status: 'completed',
        items: ['AI Project Kit (Advanced)', 'Arduino Starter Kit'],
        total: '₹5,499',
    },
    {
        id: 'ORD-3893',
        customer: 'Priya Patel',
        email: 'priyapatel@outlook.com',
        date: '2025-04-18',
        status: 'processing',
        items: ['Web Development Bundle'],
        total: '₹3,299',
    },
    {
        id: 'ORD-3892',
        customer: 'Amit Kumar',
        email: 'amitkumar@yahoo.com',
        date: '2025-04-17',
        status: 'cancelled',
        items: ['Game Development Kit'],
        total: '₹2,499',
    },
    {
        id: 'ORD-3891',
        customer: 'Sneha Gupta',
        email: 'snehagupta@hotmail.com',
        date: '2025-04-17',
        status: 'completed',
        items: ['Robotics Advanced Bundle'],
        total: '₹7,999',
    },
    {
        id: 'ORD-3890',
        customer: 'Vikram Singh',
        email: 'vikram.singh@gmail.com',
        date: '2025-04-16',
        status: 'shipped',
        items: ['AI Project Kit (Basic)', 'Entrepreneurship Toolkit'],
        total: '₹4,798',
    },
    {
        id: 'ORD-3889',
        customer: 'Neha Verma',
        email: 'nehav@gmail.com',
        date: '2025-04-16',
        status: 'completed',
        items: ['Marketing Analytics Tools'],
        total: '₹2,999',
    },
    {
        id: 'ORD-3888',
        customer: 'Rajesh Khanna',
        email: 'rajeshk@outlook.com',
        date: '2025-04-15',
        status: 'processing',
        items: ['Finance Project Bundle'],
        total: '₹3,499',
    },
    {
        id: 'ORD-3887',
        customer: 'Kavita Sharma',
        email: 'kavitas@yahoo.in',
        date: '2025-04-15',
        status: 'shipped',
        items: ['Drone Building Kit'],
        total: '₹6,999',
    }
];

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Filter orders based on search term and status
    const filteredOrders = mockOrders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Helper function to render status badge
    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
            case 'processing':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
            case 'shipped':
                return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shipped</Badge>;
            case 'cancelled':
                return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Orders Management</h1>
                    <p className="text-muted-foreground">View and manage customer orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button>
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Export Orders
                    </Button>
                </div>
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle>Order Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col">
                            <div className="text-sm text-muted-foreground mb-1">Total Orders</div>
                            <div className="text-2xl font-bold">438</div>
                            <div className="text-xs text-green-600 mt-1">+23% from last month</div>
                        </div>

                        <div className="flex flex-col">
                            <div className="text-sm text-muted-foreground mb-1">Completed Orders</div>
                            <div className="text-2xl font-bold">342</div>
                            <div className="text-xs text-green-600 mt-1">+18% from last month</div>
                        </div>

                        <div className="flex flex-col">
                            <div className="text-sm text-muted-foreground mb-1">Pending Orders</div>
                            <div className="text-2xl font-bold">47</div>
                            <div className="text-xs text-yellow-600 mt-1">+5% from last month</div>
                        </div>

                        <div className="flex flex-col">
                            <div className="text-sm text-muted-foreground mb-1">Cancelled Orders</div>
                            <div className="text-2xl font-bold">12</div>
                            <div className="text-xs text-red-600 mt-1">-3% from last month</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Order List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Select
                                value={filterStatus}
                                onValueChange={setFilterStatus}
                            >
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="flex gap-2">
                                <Calendar className="h-4 w-4" />
                                Date Range
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden md:table-cell">Items</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>
                                            <div>{order.customer}</div>
                                            <div className="text-sm text-muted-foreground">{order.email}</div>
                                        </TableCell>
                                        <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{renderStatusBadge(order.status)}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="max-w-[250px] truncate">
                                                {order.items.join(', ')}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{order.total}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        Update status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download invoice
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                            No orders found matching your criteria
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-muted-foreground">
                            Showing <strong>{filteredOrders.length}</strong> of <strong>{mockOrders.length}</strong> orders
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                1
                            </Button>
                            <Button variant="outline" size="sm">
                                2
                            </Button>
                            <Button variant="outline" size="sm">
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}