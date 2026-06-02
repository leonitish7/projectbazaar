"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowUpRight,
  Users,
  ShoppingCart,
  CreditCard,
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart4,
  PieChart,
  CircleDollarSign,
  Clock,
  AlertTriangle,
  FileText,
  Star,
  Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Mock data for dashboard stats
const stats = [
  {
    title: "Total Users",
    value: "12,348",
    change: "+14%",
    trend: "up",
    description: "vs. last month",
    icon: Users
  },
  {
    title: "Total Orders",
    value: "3,592",
    change: "+7.3%",
    trend: "up",
    description: "vs. last month",
    icon: ShoppingCart
  },
  {
    title: "Revenue",
    value: "₹9.25L",
    change: "+12.5%",
    trend: "up",
    description: "vs. last month",
    icon: CircleDollarSign
  },
  {
    title: "Projects",
    value: "286",
    change: "+4.2%",
    trend: "up",
    description: "vs. last month",
    icon: Package
  }
];

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    action: "New User Registration",
    details: "Rahul Sharma signed up",
    time: "5 min ago",
    status: "success"
  },
  {
    id: 2,
    action: "Custom Project Request",
    details: "New request for AI project",
    time: "23 min ago",
    status: "warning"
  },
  {
    id: 3,
    action: "Payment Failed",
    details: "Order #38942 payment failed",
    time: "1 hour ago",
    status: "error"
  },
  {
    id: 4,
    action: "Order Completed",
    details: "Order #38941 has been delivered",
    time: "2 hours ago",
    status: "success"
  },
  {
    id: 5,
    action: "New Review",
    details: "5-star review for Web Development",
    time: "3 hours ago",
    status: "success"
  }
];

// Mock data for recent orders
const recentOrders = [
  {
    id: "#ORD-38945",
    date: "2 May 2025",
    product: "Web Development Project",
    customer: "Neha Gupta",
    status: "processing",
    amount: "₹15,999"
  },
  {
    id: "#ORD-38944",
    date: "1 May 2025",
    product: "AI Project Bundle",
    customer: "Vikram Singh",
    status: "completed",
    amount: "₹24,499"
  },
  {
    id: "#ORD-38943",
    date: "1 May 2025",
    product: "App Development",
    customer: "Anjali Patel",
    status: "completed",
    amount: "₹19,999"
  },
  {
    id: "#ORD-38942",
    date: "30 Apr 2025",
    product: "Game Development",
    customer: "Rajiv Kumar",
    status: "failed",
    amount: "₹34,999"
  },
  {
    id: "#ORD-38941",
    date: "29 Apr 2025",
    product: "Robotics Kit Premium",
    customer: "Sunita Sharma",
    status: "completed",
    amount: "₹12,499"
  }
];

// Mock data for top selling products
const topSellingProducts = [
  {
    id: 1,
    name: "Web Development Project",
    category: "Web Development",
    sales: "142 units",
    trend: "+12%",
    revenue: "₹22,71,858"
  },
  {
    id: 2,
    name: "AI Project Bundle",
    category: "Artificial Intelligence",
    sales: "98 units",
    trend: "+23%",
    revenue: "₹24,00,502"
  },
  {
    id: 3,
    name: "Mobile App Development",
    category: "App Development",
    sales: "87 units",
    trend: "+8%",
    revenue: "₹17,39,913"
  },
  {
    id: 4,
    name: "Robotics Starter Kit",
    category: "Robotics",
    sales: "65 units",
    trend: "-3%",
    revenue: "₹8,12,175"
  },
  {
    id: 5,
    name: "Game Development Project",
    category: "Game Development",
    sales: "54 units",
    trend: "+15%",
    revenue: "₹18,89,946"
  }
];

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "New Product Launch",
    date: "May 10, 2025",
    time: "10:00 AM"
  },
  {
    id: 2,
    title: "Team Meeting",
    date: "May 6, 2025",
    time: "2:00 PM"
  },
  {
    id: 3,
    title: "Project Deadline",
    date: "May 15, 2025",
    time: "11:59 PM"
  }
];

export default function AdminDashboard() {
  // Function to display status badges with appropriate colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Processing</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">Success</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-xs">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 text-xs">Error</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the Project Bazaar admin dashboard - May 4, 2025</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                <stat.icon className={`h-4 w-4 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                <span className={`flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Charts and Analytics Tab Section */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Analytics Overview</CardTitle>
            <CardDescription>Visualize your platform performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>
              <TabsContent value="revenue" className="space-y-4">
                <div className="h-[250px] border rounded-lg bg-muted/20 p-4">
                  {/* Revenue chart visualization - would be a real chart in production */}
                  <div className="space-y-6 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">April</div>
                        <div className="text-sm font-medium">₹7,85,450</div>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">May (Current)</div>
                        <div className="text-sm font-medium">₹2,56,780</div>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Projected</div>
                        <div className="text-sm font-medium">₹9,25,780</div>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Total Revenue</div>
                      <div className="text-lg font-bold mt-1">₹9,25,780</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Avg. Order Value</div>
                      <div className="text-lg font-bold mt-1">₹2,577</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Conversion Rate</div>
                      <div className="text-lg font-bold mt-1">3.2%</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="users" className="space-y-4">
                <div className="h-[250px] border rounded-lg bg-muted/20 p-4">
                  {/* User growth visualization */}
                  <div className="space-y-6 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">New Users</div>
                        <div className="text-sm font-medium">1,245</div>
                      </div>
                      <Progress value={62} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Active Users</div>
                        <div className="text-sm font-medium">8,932</div>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Retention Rate</div>
                        <div className="text-sm font-medium">68%</div>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Total Users</div>
                      <div className="text-lg font-bold mt-1">12,348</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">New This Month</div>
                      <div className="text-lg font-bold mt-1">1,245</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Growth Rate</div>
                      <div className="text-lg font-bold mt-1">14%</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="orders" className="space-y-4">
                <div className="h-[250px] border rounded-lg bg-muted/20 p-4">
                  {/* Orders visualization */}
                  <div className="space-y-6 h-full flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Completed</div>
                        <div className="text-sm font-medium">2,485</div>
                      </div>
                      <Progress value={68} className="h-2 bg-green-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Processing</div>
                        <div className="text-sm font-medium">854</div>
                      </div>
                      <Progress value={23} className="h-2 bg-blue-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Failed/Cancelled</div>
                        <div className="text-sm font-medium">253</div>
                      </div>
                      <Progress value={9} className="h-2 bg-red-100" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Total Orders</div>
                      <div className="text-lg font-bold mt-1">3,592</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">This Month</div>
                      <div className="text-lg font-bold mt-1">768</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Avg. Processing</div>
                      <div className="text-lg font-bold mt-1">1.3 days</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="products" className="space-y-4">
                <div className="h-[250px] border rounded-lg bg-muted/20 p-4">
                  {/* Product category distribution visualization */}
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Category Distribution</div>
                      <div className="space-y-3 mt-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Web Development</span>
                            <span>32%</span>
                          </div>
                          <Progress value={32} className="h-1.5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>AI Projects</span>
                            <span>26%</span>
                          </div>
                          <Progress value={26} className="h-1.5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>App Development</span>
                            <span>18%</span>
                          </div>
                          <Progress value={18} className="h-1.5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Game Development</span>
                            <span>14%</span>
                          </div>
                          <Progress value={14} className="h-1.5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Others</span>
                            <span>10%</span>
                          </div>
                          <Progress value={10} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                    <div className="border-l pl-4 flex flex-col justify-center">
                      <div className="text-sm font-medium mb-3">Product Stats</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span>Total Products</span>
                          <span className="font-medium">286</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>New This Month</span>
                          <span className="font-medium">24</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span>Avg. Rating</span>
                          <span className="font-medium flex items-center">
                            4.7 <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Best Seller</div>
                      <div className="text-sm font-medium mt-1">Web Development</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Highest Growth</div>
                      <div className="text-sm font-medium mt-1">AI Projects</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground">Best ROI</div>
                      <div className="text-sm font-medium mt-1">Game Development</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <CardDescription>Latest activities on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`p-1.5 rounded-full mt-0.5 ${activity.status === 'success' ? 'bg-green-100' :
                      activity.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                    {activity.status === 'success' ?
                      <Users className="h-3.5 w-3.5 text-green-600" /> :
                      activity.status === 'warning' ?
                        <Clock className="h-3.5 w-3.5 text-yellow-600" /> :
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                    }
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.details}</p>
                    <div className="flex items-center pt-1">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      <div className="ml-2">
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full text-xs">
              Load More Activities
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Recent Orders */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="text-left pb-3 pl-4">Order ID</th>
                    <th className="text-left pb-3">Product</th>
                    <th className="text-left pb-3">Status</th>
                    <th className="text-right pb-3 pr-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 pl-4">
                        <div className="font-medium">{order.id}</div>
                        <div className="text-xs text-muted-foreground">{order.date}</div>
                      </td>
                      <td className="py-3">
                        <div>{order.product}</div>
                        <div className="text-xs text-muted-foreground">{order.customer}</div>
                      </td>
                      <td className="py-3">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3 text-right pr-4 font-medium">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full text-xs">
              View All Orders
            </Button>
          </CardFooter>
        </Card>

        {/* Top Selling Products */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top Selling Products</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <CardDescription>Best performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="text-left pb-3 pl-4">Product</th>
                    <th className="text-left pb-3">Sales</th>
                    <th className="text-left pb-3">Trend</th>
                    <th className="text-right pb-3 pr-4">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.map((product) => (
                    <tr key={product.id} className="border-b last:border-0">
                      <td className="py-3 pl-4">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.category}</div>
                      </td>
                      <td className="py-3">{product.sales}</td>
                      <td className="py-3">
                        <div className={`flex items-center ${product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {product.trend.startsWith('+') ?
                            <TrendingUp className="h-3.5 w-3.5 mr-1" /> :
                            <TrendingDown className="h-3.5 w-3.5 mr-1" />
                          }
                          {product.trend}
                        </div>
                      </td>
                      <td className="py-3 text-right pr-4 font-medium">{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full text-xs">
              View Product Analytics
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Calendar - Upcoming events */}
        <Card className="shadow-sm md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events & Deadlines</CardTitle>
            <CardDescription>View your calendar and schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                  <div className="p-2 bg-primary/10 rounded-md mr-4">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {upcomingEvents.length === 0 && (
              <div className="text-center py-6">
                <Calendar className="h-10 w-10 mx-auto text-muted-foreground/60" />
                <p className="text-sm font-medium mt-2">No upcoming events</p>
                <p className="text-xs text-muted-foreground mt-1">Schedule events, deadlines, and important dates</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              View Full Calendar
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Links */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                <Package className="h-4 w-4 mr-2" />
                Add New Project
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                <Users className="h-4 w-4 mr-2" />
                View User Accounts
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Process Pending Orders
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Review Payment Issues
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" size="sm">
                <BarChart4 className="h-4 w-4 mr-2" />
                Generate Sales Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}