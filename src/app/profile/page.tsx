"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Package, Settings, LogOut } from "lucide-react";
import Link from "next/link";

// Order interface
interface Order {
    _id: string;
    projectId: string;
    projectName: string;
    price: number;
    status: string;
    createdAt: string;
}

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        // Fetch user orders
        const fetchOrders = async () => {
            try {
                const response = await fetch("/api/orders/user-orders");
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data.orders || []);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Don't render anything while redirecting
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl fade-in">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Info Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <UserCircle className="h-24 w-24 text-primary" />
                        </div>
                        <CardTitle className="text-center">{user?.name}</CardTitle>
                        <CardDescription className="text-center">{user?.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-3">
                            <Button variant="outline" asChild>
                                <Link href="/cart" legacyBehavior>
                                    <Package className="mr-2 h-4 w-4" />
                                    My Cart
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/profile/settings" legacyBehavior>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Account Settings
                                </Link>
                            </Button>
                            <Button variant="destructive" onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders and Details Tabs */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>My Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="orders">
                            <TabsList className="mb-4">
                                <TabsTrigger value="orders">My Orders</TabsTrigger>
                                <TabsTrigger value="details">Account Details</TabsTrigger>
                            </TabsList>

                            <TabsContent value="orders">
                                {isLoading ? (
                                    <div className="text-center py-8">Loading orders...</div>
                                ) : orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <Card key={order._id}>
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h3 className="font-medium">{order.projectName}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Order ID: {order._id.substring(0, 8)}...
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold">₹{order.price.toFixed(2)}</p>
                                                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${order.status === "completed"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="mb-4">You haven&apos;t placed any orders yet.</p>
                                        <Button asChild>
                                            <Link href="/shop">Browse Projects</Link>
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="details">
                                <Card>
                                    <CardContent className="p-4 space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                                            <p>{user?.name}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                            <p>{user?.email}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Account ID</h3>
                                            <p>{user?.id}</p>
                                        </div>
                                        <Button variant="outline" asChild className="mt-4">
                                            <Link href="/profile/settings">Edit Profile</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}