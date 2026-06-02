"use client";
import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/card';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    Check, CheckCircle, ChevronDown, Eye, Mail,
    Filter, FileText, Search, SortAsc, SortDesc,
    Calendar, Download, ArrowUpRight, ArrowDownRight,
    Phone, ClipboardCheck, AlarmClock, RefreshCw,
    User, FileCheck, Clock, CircleDashed, ThumbsUp,
    ThumbsDown, Tag, DollarSign, BarChart, Terminal,
    Cpu, MessageSquare, ArrowRight, Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAPI } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Custom Request interface
interface CustomRequest {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    projectType: string;
    projectCategory: string;
    description: string;
    budget?: number;
    timeline?: string;
    requirements?: string;
    status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'completed';
    createdAt: string;
}

const statusOptions = [
    { value: 'pending', label: 'Pending', icon: <Clock className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    { value: 'reviewing', label: 'Reviewing', icon: <CircleDashed className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    { value: 'accepted', label: 'Accepted', icon: <ThumbsUp className="h-4 w-4" />, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    { value: 'rejected', label: 'Rejected', icon: <ThumbsDown className="h-4 w-4" />, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    { value: 'completed', label: 'Completed', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' }
];

// Request card for grid view
const RequestCard = ({ request, onView, onToggleComplete, isCompleted, isActionLoading }: {
    request: CustomRequest;
    onView: () => void;
    onToggleComplete: () => void;
    isCompleted: boolean;
    isActionLoading: boolean;
}) => {
    const statusOption = statusOptions.find(option => option.value === request.status) || statusOptions[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="h-full hover:shadow-md transition-all border border-border/50 overflow-hidden">
                <CardHeader className="pb-2">
                    <div className="flex justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Tag className="h-4 w-4 text-primary" />
                            {request.projectType}
                        </CardTitle>
                        <Badge className={cn("h-6", statusOption.color)}>
                            <span className="flex items-center gap-1">
                                {statusOption.icon}
                                {statusOption.label}
                            </span>
                        </Badge>
                    </div>
                    <CardDescription>
                        {request.projectCategory}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{request.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">{request.name}</p>
                                <p className="text-xs text-muted-foreground">{request.email}</p>
                            </div>
                        </div>

                        <div className="max-h-12 overflow-hidden text-ellipsis">
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {request.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>{request.budget ? `₹${request.budget.toLocaleString()}` : 'Not specified'}</span>
                            </div>
                            <div className="flex items-center">
                                <AlarmClock className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span>{request.timeline || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-3 mt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={onView}
                    >
                        <Eye className="h-3.5 w-3.5 mr-1.5" /> View Details
                    </Button>

                    <Button
                        size="sm"
                        variant={isCompleted ? "outline" : "default"}
                        onClick={onToggleComplete}
                        className="h-8 px-2 text-xs"
                        disabled={isActionLoading}
                    >
                        {isActionLoading ? (
                            <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : isCompleted ? (
                            <Check className="h-3.5 w-3.5 mr-1.5" />
                        ) : (
                            <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        {isCompleted ? 'Completed' : 'Complete'}
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

// Stats component
const StatsBar = ({ requests }: { requests: CustomRequest[] }) => {
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        reviewing: requests.filter(r => r.status === 'reviewing').length,
        accepted: requests.filter(r => r.status === 'accepted').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
        completed: requests.filter(r => r.status === 'completed').length,
    };

    const totalBudget = requests
        .filter(r => r.budget !== undefined)
        .reduce((sum, r) => sum + (r.budget || 0), 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6"
        >
            <Card className="border border-border/40 bg-card/80">
                <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="text-lg font-bold">{stats.total}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-border/40 bg-card/80">
                <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-yellow-800 dark:text-yellow-300" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Pending</p>
                            <p className="text-lg font-bold">{stats.pending}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-border/40 bg-card/80">
                <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <CircleDashed className="h-4 w-4 text-blue-800 dark:text-blue-300" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Reviewing</p>
                            <p className="text-lg font-bold">{stats.reviewing}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-border/40 bg-card/80">
                <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <ThumbsUp className="h-4 w-4 text-green-800 dark:text-green-300" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Accepted</p>
                            <p className="text-lg font-bold">{stats.accepted}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-border/40 bg-card/80">
                <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                            <ThumbsDown className="h-4 w-4 text-red-800 dark:text-red-300" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Rejected</p>
                            <p className="text-lg font-bold">{stats.rejected}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-border/40 bg-card/80">
                <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-purple-800 dark:text-purple-300" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Completed</p>
                            <p className="text-lg font-bold">{stats.completed}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default function AdminCustomRequests() {
    const { user, token } = useAuth();
    const [requests, setRequests] = useState<CustomRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortField, setSortField] = useState<keyof CustomRequest>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
    const [showRequestDetails, setShowRequestDetails] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

    // Admin action states
    const [adminActions, setAdminActions] = useState<{ [key: string]: boolean }>({});
    const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
    const [updateStatus, setUpdateStatus] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomRequests = async () => {
            if (user?.isAdmin) {
                try {
                    setIsLoading(true);
                    // Fetch custom requests from MongoDB
                    const requestsData = await fetchAPI('/api/admin/custom-requests', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // If API call fails, use sample data for development
                    const fetchedRequests = requestsData || getSampleCustomRequests();
                    setRequests(fetchedRequests);

                    // Fetch admin action status for these requests
                    await fetchAdminActions(fetchedRequests);
                } catch (error) {
                    console.error('Error fetching custom requests:', error);
                    // Use sample data for development
                    setRequests(getSampleCustomRequests());
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchCustomRequests();
    }, [user, token]);

    // Function to fetch admin actions for custom requests
    const fetchAdminActions = async (requests: CustomRequest[]) => {
        try {
            // Get all request IDs
            const requestIds = requests.map(request => request._id);

            // Fetch admin actions for these requests
            const actionsResponse = await fetchAPI(`/api/admin/actions?type=custom&ids=${requestIds.join(',')}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (actionsResponse && actionsResponse.actions) {
                // Create a mapping of request ID to completion status
                const actionMap = actionsResponse.actions.reduce((acc: { [key: string]: boolean }, action: any) => {
                    acc[action.itemId] = action.isCompleted;
                    return acc;
                }, {});

                setAdminActions(actionMap);
            }
        } catch (error) {
            console.error('Error fetching admin actions:', error);
        }
    };

    // Function to toggle custom request completion
    const toggleRequestCompletion = async (requestId: string, currentStatus: boolean) => {
        if (!user?.isAdmin) return;

        // Set loading state for this specific request
        setActionLoading(prev => ({ ...prev, [requestId]: true }));

        try {
            // Call our API endpoint to update the admin action
            const response = await fetchAPI(`/api/admin/custom/${requestId}/action`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isCompleted: !currentStatus
                })
            });

            if (response && response.action) {
                // Update the admin actions state
                setAdminActions(prev => ({
                    ...prev,
                    [requestId]: response.action.isCompleted
                }));

                // If the status changed, update the request status in UI
                const newStatus = response.action.isCompleted ? 'completed' : 'pending';
                setRequests(requests.map(request =>
                    request._id === requestId
                        ? { ...request, status: newStatus }
                        : request
                ));

                console.log(`Custom request ${requestId} action updated successfully`);
            }
        } catch (error) {
            console.error('Error updating custom request action:', error);
        } finally {
            // Clear loading state
            setActionLoading(prev => ({ ...prev, [requestId]: false }));
        }
    };

    const handleUpdateStatus = async (requestId: string, newStatus: string) => {
        if (!user?.isAdmin) return;

        setUpdateStatus(requestId);

        try {
            // Call API to update request status
            const response = await fetchAPI(`/api/admin/custom/${requestId}/status`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response && response.success) {
                // Update local state
                setRequests(prev => prev.map(req =>
                    req._id === requestId ? { ...req, status: newStatus as any } : req
                ));

                // Update selected request if it's the one being viewed
                if (selectedRequest && selectedRequest._id === requestId) {
                    setSelectedRequest(prev => prev ? { ...prev, status: newStatus as any } : null);
                }
            }
        } catch (error) {
            console.error('Error updating request status:', error);
        } finally {
            setUpdateStatus(null);
        }
    };

    // Sample data for development
    const getSampleCustomRequests = (): CustomRequest[] => {
        return [
            {
                _id: '1',
                name: 'John Smith',
                email: 'john.smith@example.com',
                phone: '+91 9876543210',
                projectType: 'Mobile App',
                projectCategory: 'E-commerce',
                description: 'I need a mobile app for my online store with integrated payment system and inventory management.',
                budget: 75000,
                timeline: '3 months',
                requirements: 'Must work on both iOS and Android, include user authentication, and product search functionality.',
                status: 'pending',
                createdAt: '2025-04-10T09:15:00Z'
            },
            {
                _id: '2',
                name: 'Sarah Johnson',
                email: 'sarah.j@example.com',
                phone: '+91 8765432109',
                projectType: 'Web Application',
                projectCategory: 'Education',
                description: 'I want to create an online learning platform for my tutoring business.',
                budget: 120000,
                timeline: '4 months',
                requirements: 'Video streaming capabilities, quiz system, and student progress tracking.',
                status: 'reviewing',
                createdAt: '2025-04-08T14:30:00Z'
            },
            {
                _id: '3',
                name: 'Raj Patel',
                email: 'raj.patel@example.com',
                phone: '+91 7654321098',
                projectType: 'Hardware Project',
                projectCategory: 'IoT',
                description: 'I need an IoT solution for smart irrigation system for my farm.',
                budget: 85000,
                timeline: '2 months',
                requirements: 'Must include soil moisture sensors, weather forecasting integration, and mobile app control.',
                status: 'completed',
                createdAt: '2025-04-05T10:45:00Z'
            },
            {
                _id: '4',
                name: 'Priya Sharma',
                email: 'priya.s@example.com',
                phone: '+91 9517538642',
                projectType: 'Desktop Application',
                projectCategory: 'Business',
                description: 'I need an inventory management software for my retail business with POS integration.',
                budget: 65000,
                timeline: '2.5 months',
                requirements: 'Should work offline, have barcode scanning capability, and generate sales reports.',
                status: 'accepted',
                createdAt: '2025-04-12T11:25:00Z'
            },
            {
                _id: '5',
                name: 'Vikram Singh',
                email: 'vikram@example.com',
                phone: '+91 8529637410',
                projectType: 'AI Solution',
                projectCategory: 'Healthcare',
                description: 'I need an AI-based patient monitoring system for my clinic to analyze vitals and predict health risks.',
                budget: 195000,
                timeline: '5 months',
                requirements: 'Machine learning model for health prediction, real-time monitoring interface, and alert system.',
                status: 'rejected',
                createdAt: '2025-04-03T16:50:00Z'
            },
            {
                _id: '6',
                name: 'Ananya Desai',
                email: 'ananya.d@example.com',
                phone: '+91 7894561230',
                projectType: 'Mobile Game',
                projectCategory: 'Entertainment',
                description: 'I want to create an educational mobile game for children to learn mathematics in a fun way.',
                budget: 90000,
                timeline: '3.5 months',
                requirements: 'Colorful UI, engaging gameplay, various difficulty levels, and progress tracking for parents.',
                status: 'reviewing',
                createdAt: '2025-04-15T09:10:00Z'
            }
        ];
    };

    const handleViewRequestDetails = (request: CustomRequest) => {
        setSelectedRequest(request);
        setShowRequestDetails(true);
    };

    const handleSort = (field: keyof CustomRequest) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
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

    // Format currency
    const formatCurrency = (amount?: number) => {
        if (!amount) return 'Not specified';
        return `₹${amount.toLocaleString()}`;
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        const statusOption = statusOptions.find(option => option.value === status) || statusOptions[0];
        return (
            <Badge variant="outline" className={cn("flex items-center gap-1", statusOption.color)}>
                {statusOption.icon}
                {statusOption.label}
            </Badge>
        );
    };

    const getStatusIcon = (status: string) => {
        const option = statusOptions.find(opt => opt.value === status);
        return option ? option.icon : <Clock className="h-4 w-4" />;
    };

    // Get table row class based on request status
    const getRowClass = (status: string) => {
        switch (status) {
            case 'pending': return 'border-l-4 border-l-yellow-500';
            case 'reviewing': return 'border-l-4 border-l-blue-500';
            case 'accepted': return 'border-l-4 border-l-green-500';
            case 'rejected': return 'border-l-4 border-l-red-500';
            case 'completed': return 'border-l-4 border-l-purple-500';
            default: return 'border-l-4 border-l-transparent';
        }
    };

    // Sort and filter requests
    const filteredRequests = requests
        .filter(request => {
            // Apply search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    request.name.toLowerCase().includes(searchLower) ||
                    request.email.toLowerCase().includes(searchLower) ||
                    request.projectType.toLowerCase().includes(searchLower) ||
                    request.projectCategory.toLowerCase().includes(searchLower) ||
                    request.description.toLowerCase().includes(searchLower)
                );
            }
            return true;
        })
        .filter(request => {
            // Apply status filter
            if (filterStatus) {
                return request.status === filterStatus;
            }
            return true;
        })
        .sort((a, b) => {
            // Apply sorting
            const fieldA = a[sortField];
            const fieldB = b[sortField];

            if (typeof fieldA === 'string' && typeof fieldB === 'string') {
                return sortDirection === 'asc'
                    ? fieldA.localeCompare(fieldB)
                    : fieldB.localeCompare(fieldA);
            }

            if (typeof fieldA === 'number' && typeof fieldB === 'number') {
                return sortDirection === 'asc'
                    ? fieldA - fieldB
                    : fieldB - fieldA;
            }

            return 0;
        });

    // If loading
    if (isLoading) {
        return (
            <div className="h-[80vh] w-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative h-20 w-20">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        <div className="absolute inset-[6px] rounded-full border-2 border-t-primary/60 border-r-transparent border-b-transparent border-l-transparent animate-spin animation-delay-200"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-primary">
                            <Terminal className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-muted-foreground cyber-gradient animate-pulse">LOADING CUSTOM REQUESTS...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center"
                    >
                        <FileText className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div>
                        <h1 className="text-3xl font-bold cyber-gradient">CUSTOM REQUESTS</h1>
                        <p className="text-muted-foreground text-sm">Manage client project requests</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" className="cyber-button">
                        <Download className="h-4 w-4 mr-1" /> Export
                    </Button>
                    <Button variant="outline" size="sm" className="cyber-button">
                        <BarChart className="h-4 w-4 mr-1" /> Analytics
                    </Button>
                </div>
            </div>

            {/* Stats bar */}
            <StatsBar requests={requests} />

            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="w-full md:w-1/3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name, email, or project type..."
                            className="pl-9 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* View mode toggle */}
                    <Tabs
                        defaultValue={viewMode}
                        value={viewMode}
                        onValueChange={(value) => setViewMode(value as 'table' | 'grid')}
                        className="w-[190px] h-9"
                    >
                        <TabsList className="h-9">
                            <TabsTrigger value="table" className="h-8 px-3">
                                <span className="flex items-center gap-1">
                                    <FileCheck className="h-3.5 w-3.5" />
                                    Table View
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="grid" className="h-8 px-3">
                                <span className="flex items-center gap-1">
                                    <Cpu className="h-3.5 w-3.5" />
                                    Grid View
                                </span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Filter dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                                <Filter className="h-4 w-4 mr-2" />
                                {filterStatus ? `Status: ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}` : 'All Statuses'}
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setFilterStatus(null)} className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                All Statuses
                            </DropdownMenuItem>
                            {statusOptions.map(status => (
                                <DropdownMenuItem
                                    key={status.value}
                                    onClick={() => setFilterStatus(status.value)}
                                    className="flex items-center gap-2"
                                >
                                    {status.icon}
                                    {status.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Card className="border border-border/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                All Custom Requests
                            </CardTitle>
                            <CardDescription>
                                {filteredRequests.length} {filteredRequests.length === 1 ? 'request' : 'requests'} found
                                {filterStatus && ` with status: ${filterStatus}`}
                                {searchTerm && ` matching: "${searchTerm}"`}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredRequests.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="inline-flex h-10 w-10 rounded-full bg-muted-foreground/20 p-2 mb-4">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="font-medium">No custom requests found</p>
                            <p className="text-muted-foreground text-sm mt-1">
                                {searchTerm || filterStatus ?
                                    "Try adjusting your filters to find what you're looking for." :
                                    "There are no custom requests in the system yet."}
                            </p>
                            {(searchTerm || filterStatus) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4 cyber-button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterStatus(null);
                                    }}
                                >
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    ) : viewMode === 'table' ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center">
                                                Client
                                                {sortField === 'name' && (
                                                    sortDirection === 'asc' ?
                                                        <SortAsc className="ml-1 h-4 w-4" /> :
                                                        <SortDesc className="ml-1 h-4 w-4" />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('projectType')}
                                        >
                                            <div className="flex items-center">
                                                Project Type
                                                {sortField === 'projectType' && (
                                                    sortDirection === 'asc' ?
                                                        <SortAsc className="ml-1 h-4 w-4" /> :
                                                        <SortDesc className="ml-1 h-4 w-4" />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead>Budget</TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('status')}
                                        >
                                            <div className="flex items-center">
                                                Status
                                                {sortField === 'status' && (
                                                    sortDirection === 'asc' ?
                                                        <SortAsc className="ml-1 h-4 w-4" /> :
                                                        <SortDesc className="ml-1 h-4 w-4" />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            <div className="flex items-center">
                                                Date
                                                {sortField === 'createdAt' && (
                                                    sortDirection === 'asc' ?
                                                        <SortAsc className="ml-1 h-4 w-4" /> :
                                                        <SortDesc className="ml-1 h-4 w-4" />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {filteredRequests.map((request) => (
                                            <motion.tr
                                                key={request._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={cn("hover:bg-muted/40 cursor-pointer group", getRowClass(request.status))}
                                                onClick={() => handleViewRequestDetails(request)}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="bg-secondary text-secondary-foreground">
                                                                {request.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium group-hover:text-primary transition-colors">{request.name}</div>
                                                            <div className="text-xs text-muted-foreground">{request.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{request.projectType}</div>
                                                    <div className="text-xs text-muted-foreground">{request.projectCategory}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                        <span>{formatCurrency(request.budget)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        {getStatusBadge(request.status)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>{formatDate(request.createdAt)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <Button
                                                            size="sm"
                                                            variant={adminActions[request._id] ? "outline" : "default"}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleRequestCompletion(request._id, !!adminActions[request._id]);
                                                            }}
                                                            className="h-8 px-2"
                                                            disabled={actionLoading[request._id]}
                                                        >
                                                            {actionLoading[request._id] ? (
                                                                <span className="flex items-center">
                                                                    <RefreshCw className="animate-spin h-4 w-4 mr-1" />
                                                                    Processing
                                                                </span>
                                                            ) : adminActions[request._id] ? (
                                                                <span className="flex items-center">
                                                                    <Check className="h-4 w-4 mr-1" />
                                                                    Completed
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center">
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Mark Complete
                                                                </span>
                                                            )}
                                                        </Button>

                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewRequestDetails(request);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredRequests.map((request) => (
                                <RequestCard
                                    key={request._id}
                                    request={request}
                                    onView={() => handleViewRequestDetails(request)}
                                    onToggleComplete={() => toggleRequestCompletion(request._id, !!adminActions[request._id])}
                                    isCompleted={!!adminActions[request._id]}
                                    isActionLoading={!!actionLoading[request._id]}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4 text-sm">
                    <div className="text-muted-foreground">
                        Showing {filteredRequests.length} of {requests.length} requests
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={true}
                        >
                            <ArrowUpRight className="h-4 w-4" />
                        </Button>
                        <span className="text-muted-foreground">Page 1 of 1</span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={true}
                        >
                            <ArrowDownRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            {/* Request Details Dialog */}
            {selectedRequest && (
                <Dialog open={showRequestDetails} onOpenChange={setShowRequestDetails}>
                    <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
                        <DialogHeader className="p-6 pb-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <DialogTitle className="text-xl flex items-center gap-2">
                                        <Tag className="h-5 w-5 text-primary" />
                                        {selectedRequest.projectType}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {selectedRequest.projectCategory} • Submitted {formatDate(selectedRequest.createdAt)}
                                    </DialogDescription>
                                </div>
                                {getStatusBadge(selectedRequest.status)}
                            </div>
                        </DialogHeader>

                        <ScrollArea className="max-h-[70vh]">
                            <div className="p-6 pt-3 space-y-6">
                                {/* Client information */}
                                <Card className="border border-border/50 overflow-hidden">
                                    <CardHeader className="bg-muted/30 py-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            Client Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-16 w-16">
                                                <AvatarFallback className="text-xl bg-primary/20 text-primary">
                                                    {selectedRequest.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1">
                                                <h3 className="font-medium text-lg">{selectedRequest.name}</h3>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <a href={`mailto:${selectedRequest.email}`} className="text-primary hover:underline">
                                                        {selectedRequest.email}
                                                    </a>
                                                </div>
                                                {selectedRequest.phone && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <a href={`tel:${selectedRequest.phone}`} className="hover:text-primary">
                                                            {selectedRequest.phone}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Project details */}
                                <Card className="border border-border/50 overflow-hidden">
                                    <CardHeader className="bg-muted/30 py-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            Project Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        <div>
                                            <h3 className="font-medium mb-2">Project Description</h3>
                                            <p className="text-sm bg-muted/20 p-3 rounded border border-border/50">
                                                {selectedRequest.description}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-primary" />
                                                    <h4 className="font-medium">Budget</h4>
                                                </div>
                                                <p className="text-lg font-mono ml-6">{formatCurrency(selectedRequest.budget)}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <AlarmClock className="h-4 w-4 text-primary" />
                                                    <h4 className="font-medium">Timeline</h4>
                                                </div>
                                                <p className="text-lg ml-6">{selectedRequest.timeline || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        {selectedRequest.requirements && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ClipboardCheck className="h-4 w-4 text-primary" />
                                                    <h3 className="font-medium">Requirements</h3>
                                                </div>
                                                <p className="text-sm bg-muted/20 p-3 rounded border border-border/50">
                                                    {selectedRequest.requirements}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Status update section */}
                                <div className="space-y-4 mb-6 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        <h3 className="font-medium">Update Request Status</h3>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {statusOptions.map(option => (
                                            <Button
                                                key={option.value}
                                                size="sm"
                                                variant={selectedRequest.status === option.value ? "default" : "outline"}
                                                className={`flex items-center gap-1 ${selectedRequest.status === option.value ? "border-primary" : ""}`}
                                                onClick={() => handleUpdateStatus(selectedRequest._id, option.value)}
                                                disabled={updateStatus === selectedRequest._id}
                                            >
                                                {option.icon}
                                                <span>{option.label}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Communications log - placeholder */}
                                <Card className="border border-border/50 overflow-hidden">
                                    <CardHeader className="bg-muted/30 py-3">
                                        <CardTitle className="text-base flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4 text-primary" />
                                                Communication Log
                                            </span>
                                            <Badge variant="outline" className="h-5 px-2 bg-primary/10">New Feature Coming Soon</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 text-center py-10 text-muted-foreground">
                                        <p>Client communication tracking will be available soon.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>

                        <DialogFooter className="p-6 pt-0">
                            <div className="w-full flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        className="cyber-button w-full sm:w-auto"
                                        onClick={() => setShowRequestDetails(false)}
                                    >
                                        Close
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="cyber-button flex items-center gap-2 w-full sm:w-auto"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Contact Client
                                    </Button>
                                </div>

                                <Button
                                    variant={adminActions[selectedRequest._id] ? "outline" : "default"}
                                    onClick={() => {
                                        toggleRequestCompletion(selectedRequest._id, !!adminActions[selectedRequest._id]);
                                    }}
                                    disabled={actionLoading[selectedRequest._id]}
                                    className="cyber-button w-full sm:w-auto"
                                >
                                    {actionLoading[selectedRequest._id] ? (
                                        <span className="flex items-center">
                                            <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                                            Processing
                                        </span>
                                    ) : adminActions[selectedRequest._id] ? (
                                        <span className="flex items-center">
                                            <Check className="h-4 w-4 mr-2" />
                                            Mark as Incomplete
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Mark as Complete
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}