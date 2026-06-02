"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft, CheckCircle, User, Package, Calendar, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI } from '@/lib/api';

interface OrderItem {
    _id: string;
    projectId: string;
    title: string;
    price: number;
    quantity: number;
    customization?: string;
    category?: string;
    subcategory?: string;
    image?: string;
}

interface Order {
    _id: string;
    orderId: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: string;
    paymentId?: string;
}

interface Customer {
    _id: string;
    name: string;
    email: string;
}

export default function OrderDetailsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const { user, token } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [updateStatus, setUpdateStatus] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            router.push('/admin/orders');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                setIsLoading(true);
                // Fetch order details
                const orderData = await fetchAPI(`/api/admin/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (orderData) {
                    setOrder(orderData);

                    // Fetch customer details
                    const customerData = await fetchAPI(`/api/admin/users/${orderData.userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    setCustomer(customerData);
                } else {
                    console.error('Order not found');
                    setTimeout(() => router.push('/admin/orders'), 2000);
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, router, token]);

    const handleUpdateStatus = async (status: string) => {
        if (!order) return;

        try {
            setUpdateStatus(status);
            const response = await fetchAPI(`/api/admin/orders/${order._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (response) {
                setOrder({ ...order, status });
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        } finally {
            setUpdateStatus(null);
        }
    };

    // Format date to readable string
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'processing':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
            case 'failed':
                return <Badge variant="outline" className="bg-red-100 text-red-800">Failed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-5xl">
                <div className="text-center py-12">
                    <div className="animate-pulse">Loading order details...</div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto p-6 max-w-5xl">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
                    <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
                    <Button onClick={() => router.push('/admin/orders')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Orders
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => router.push('/admin/orders')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Orders
                    </Button>
                    <h1 className="text-2xl font-bold">Order Details</h1>
                </div>

                {/* Status update buttons */}
                {order.status !== 'completed' && (
                    <div className="flex gap-2">
                        {order.status === 'pending' && (
                            <Button
                                variant="outline"
                                disabled={updateStatus === 'processing'}
                                onClick={() => handleUpdateStatus('processing')}
                            >
                                Mark as Processing
                            </Button>
                        )}
                        <Button
                            variant="default"
                            disabled={updateStatus === 'completed'}
                            onClick={() => handleUpdateStatus('completed')}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Completed
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Summary */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Order #{order.orderId}</CardTitle>
                        <CardDescription className="flex items-center justify-between">
                            <span>Placed on {formatDate(order.createdAt)}</span>
                            <span>{getStatusBadge(order.status)}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Order Items */}
                            <div>
                                <h3 className="font-medium mb-3 flex items-center">
                                    <Package className="h-4 w-4 mr-2" /> Order Items
                                </h3>
                                <div className="border rounded-md divide-y">
                                    {order.items && order.items.map((item) => (
                                        <div key={item._id} className="p-4 flex justify-between items-start">
                                            <div className="flex gap-4">
                                                {item.image && (
                                                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-base">{item.title}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {item.category} • {item.subcategory}
                                                    </p>
                                                    {item.customization && (
                                                        <p className="text-sm mt-1">
                                                            <span className="font-medium">Customization:</span> {item.customization}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">₹{item.price.toLocaleString()}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Payment */}
                            <div>
                                <h3 className="font-medium mb-3 flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2" /> Payment Information
                                </h3>
                                <div className="bg-slate-50 rounded-md p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Payment Method</p>
                                            <p className="font-medium">Online Payment</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Payment Status</p>
                                            <p className="font-medium">Paid</p>
                                        </div>
                                        {order.paymentId && (
                                            <div className="col-span-2">
                                                <p className="text-sm text-muted-foreground">Transaction ID</p>
                                                <p className="font-mono text-sm">{order.paymentId}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Timeline */}
                            <div>
                                <h3 className="font-medium mb-3 flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" /> Order Timeline
                                </h3>
                                <div className="border-l-2 border-slate-200 pl-4 space-y-4">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-green-500"></div>
                                        <p className="font-medium">Order Placed</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                                    </div>

                                    {order.status === 'processing' || order.status === 'completed' ? (
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-blue-500"></div>
                                            <p className="font-medium">Processing</p>
                                            <p className="text-sm text-muted-foreground">Order is being processed</p>
                                        </div>
                                    ) : null}

                                    {order.status === 'completed' ? (
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-green-500"></div>
                                            <p className="font-medium">Completed</p>
                                            <p className="text-sm text-muted-foreground">Order has been completed</p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Customer and Order Summary */}
                <div className="space-y-6">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{customer?.name || 'Customer'}</p>
                                        <p className="text-sm text-muted-foreground">{customer?.email || 'No email available'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Customer ID</p>
                                    <p className="font-mono text-sm">{order.userId}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>₹0.00</span>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}