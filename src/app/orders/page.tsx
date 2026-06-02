"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { fetchAPI } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface OrderItem {
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
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: string;
    paymentId?: string;
}

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const response = await fetchAPI('/api/orders/user-orders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                setOrders(response.orders || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load your orders. Please try again later.');
                toast({
                    title: "Error",
                    description: "Could not load your order history. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [toast]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <Package className="h-12 w-12 mx-auto animate-pulse text-muted-foreground" />
                <h2 className="mt-4 text-xl font-medium">Loading your orders...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-12">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="mt-6 text-center">
                    <Button asChild>
                        <Link href="/shop">Back to Shop</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-md mx-auto text-center">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h1 className="text-2xl font-bold mb-4">No Orders Found</h1>
                    <p className="text-muted-foreground mb-8">
                        You haven&apos;t placed any orders yet. Explore our projects and make your first purchase!
                    </p>
                    <Button asChild>
                        <Link href="/shop">Browse Projects</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
            <Link
                href="/shop"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
                >
                <ArrowLeft className="h-4 w-4 mr-1" /> Continue Shopping
            </Link>
            <div className="space-y-6">
                {orders.map((order) => (
                    <Card key={order._id} className="overflow-hidden">
                        <CardHeader className="bg-muted/50">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <CardTitle className="text-lg">
                                    Order #{order.orderId}
                                </CardTitle>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                                    <Badge variant="outline" className={getStatusColor(order.status)}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Badge>
                                    <span className="text-muted-foreground">
                                        {formatDate(order.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row justify-between gap-4 py-3">
                                        <div className="flex gap-4">
                                            {item.image && (
                                                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-medium">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Qty: {item.quantity} {item.customization && `• ${item.customization}`}
                                                </p>
                                                {(item.category || item.subcategory) && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {item.category}{item.subcategory && ` › ${item.subcategory}`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-medium">Rs {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}

                                <Separator />

                                <div className="flex justify-between pt-2">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-semibold">Rs {order.totalAmount.toFixed(2)}</span>
                                </div>

                                {order.paymentId && (
                                    <p className="text-xs text-muted-foreground">
                                        Payment ID: {order.paymentId}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;