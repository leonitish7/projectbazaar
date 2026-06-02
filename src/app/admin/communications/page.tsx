"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCaption, TableCell, TableHead,
    TableHeader, TableRow
} from '@/components/ui/table';
import {
    MessageSquare, Mail, Bell, Send, Filter, Search,
    Download, Upload, RefreshCw, Trash2, ExternalLink,
    PlusCircle, CheckCircle, XCircle, AlertCircle, Clock
} from 'lucide-react';
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectGroup, SelectItem,
    SelectLabel, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function CommunicationsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('messages');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [composeData, setComposeData] = useState({
        subject: '',
        message: '',
        recipientType: 'all',
        selectedRecipients: [] as string[]
    });

    // Mock data for messages
    const mockMessages = [
        {
            id: 'm1',
            from: {
                name: 'Ankit Sharma',
                email: 'ankit@example.com',
                avatar: '/placeholder.svg'
            },
            subject: 'Question about my AI Project order',
            snippet: 'I had a question about the delivery timeline for my custom AI project...',
            date: '2025-04-19T14:32:00',
            read: false,
            priority: 'high',
            category: 'support'
        },
        {
            id: 'm2',
            from: {
                name: 'Priya Patel',
                email: 'priya@example.com',
                avatar: '/placeholder.svg'
            },
            subject: 'Feedback on my website project',
            snippet: 'I wanted to share some feedback on the project I received last week...',
            date: '2025-04-18T09:15:00',
            read: true,
            priority: 'medium',
            category: 'feedback'
        },
        {
            id: 'm3',
            from: {
                name: 'Rahul Singh',
                email: 'rahul@example.com',
                avatar: '/placeholder.svg'
            },
            subject: 'Custom order inquiry',
            snippet: 'I\'m interested in placing a custom order for a robotics project...',
      date: '2025-04-17T16:45:00',
            read: true,
            priority: 'normal',
            category: 'inquiry'
        },
        {
            id: 'm4',
            from: {
                name: 'Deepa Kumar',
                email: 'deepa@example.com',
                avatar: '/placeholder.svg'
            },
            subject: 'Issue with my order #10432',
            snippet: 'I haven\'t received any updates on my order and it\'s been 5 days...',
            date: '2025-04-16T11:22:00',
            read: false,
            priority: 'high',
            category: 'support'
        },
        {
            id: 'm5',
            from: {
                name: 'Vikram Malhotra',
                email: 'vikram@example.com',
                avatar: '/placeholder.svg'
            },
            subject: 'Thank you for the great service',
            snippet: 'I just wanted to thank you for the excellent project delivery...',
            date: '2025-04-15T15:10:00',
            read: true,
            priority: 'normal',
            category: 'feedback'
        }
    ];

    // Mock data for email campaigns
    const mockEmailCampaigns = [
        {
            id: 'c1',
            name: 'April New Arrivals',
            subject: 'Check out our latest projects',
            status: 'sent',
            sentDate: '2025-04-15T10:00:00',
            recipients: 1245,
            opened: 782,
            clicked: 345,
            converted: 58
        },
        {
            id: 'c2',
            name: 'Customer Feedback Survey',
            subject: 'We value your feedback',
            status: 'scheduled',
            sendDate: '2025-04-25T09:30:00',
            recipients: 5000,
            opened: null,
            clicked: null,
            converted: null
        },
        {
            id: 'c3',
            name: 'Special Discount - Tech Projects',
            subject: '25% off on all tech projects this week',
            status: 'draft',
            lastEdited: '2025-04-18T14:20:00',
            recipients: null,
            opened: null,
            clicked: null,
            converted: null
        },
        {
            id: 'c4',
            name: 'March Newsletter',
            subject: 'Monthly updates and highlights',
            status: 'sent',
            sentDate: '2025-03-01T08:00:00',
            recipients: 4872,
            opened: 2341,
            clicked: 1056,
            converted: 127
        }
    ];

    // Mock data for notifications
    const mockNotifications = [
        {
            id: 'n1',
            title: 'Order Updates',
            message: 'Your order #10432 has been shipped',
            type: 'transactional',
            channels: ['app', 'email'],
            status: 'active',
            lastSent: '2025-04-19T16:30:00',
            sentCount: 1245
        },
        {
            id: 'n2',
            title: 'New Project Alert',
            message: 'New {category} projects are now available',
            type: 'marketing',
            channels: ['app', 'push'],
            status: 'active',
            lastSent: '2025-04-18T10:15:00',
            sentCount: 3567
        },
        {
            id: 'n3',
            title: 'Account Security Alert',
            message: 'A new device logged into your account',
            type: 'security',
            channels: ['email', 'sms'],
            status: 'active',
            lastSent: '2025-04-17T08:45:00',
            sentCount: 78
        },
        {
            id: 'n4',
            title: 'Feedback Request',
            message: 'Please rate your recent project purchase',
            type: 'engagement',
            channels: ['app', 'email'],
            status: 'inactive',
            lastSent: '2025-04-15T14:20:00',
            sentCount: 892
        }
    ];

    // Mock user list for recipient selection
    const mockUsers = [
        { id: 'u1', name: 'Ankit Sharma', email: 'ankit@example.com', type: 'customer' },
        { id: 'u2', name: 'Priya Patel', email: 'priya@example.com', type: 'customer' },
        { id: 'u3', name: 'Rahul Singh', email: 'rahul@example.com', type: 'customer' },
        { id: 'u4', name: 'Deepa Kumar', email: 'deepa@example.com', type: 'customer' },
        { id: 'u5', name: 'Vikram Malhotra', email: 'vikram@example.com', type: 'customer' },
        { id: 'u6', name: 'Admin User', email: 'admin@projectbazaar.com', type: 'admin' }
    ];

    // Format date helper
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

    const toggleSelectUser = (userId: string) => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const selectAllUsers = () => {
        if (selectedUsers.length === mockMessages.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(mockMessages.map(msg => msg.id));
        }
    };

    const filterMessages = () => {
        return mockMessages.filter(msg =>
            msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.snippet.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const handleComposeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Sending message:', composeData);
        // Here you would typically send the message
        setIsComposeOpen(false);
        // Reset form
        setComposeData({
            subject: '',
            message: '',
            recipientType: 'all',
            selectedRecipients: []
        });
    };

    // Ensure only admin users can access this page
    useEffect(() => {
        if (user && !user.isAdmin) {
            window.location.href = '/login';
        }
    }, [user]);

    if (!user?.isAdmin) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Communications</h2>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button size="sm" onClick={() => setIsComposeOpen(true)}>
                        <Send className="h-4 w-4 mr-2" />
                        Compose New
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="messages" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full max-w-lg">
                    <TabsTrigger value="messages" className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" /> Messages
                    </TabsTrigger>
                    <TabsTrigger value="emails" className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" /> Email Campaigns
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" /> Notifications
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    {/* Messages Tab */}
                    <TabsContent value="messages" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                    <CardTitle>Customer Messages</CardTitle>
                                    <div className="flex space-x-2">
                                        <div className="relative w-64">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search messages..."
                                                className="pl-8"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <Button variant="outline" size="icon">
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardDescription>
                                    Manage and respond to customer inquiries and support requests.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={selectedUsers.length === mockMessages.length && mockMessages.length > 0}
                                                    onCheckedChange={selectAllUsers}
                                                    aria-label="Select all"
                                                />
                                            </TableHead>
                                            <TableHead className="w-12">Status</TableHead>
                                            <TableHead className="w-[200px]">From</TableHead>
                                            <TableHead>Subject & Preview</TableHead>
                                            <TableHead className="w-[180px]">Received</TableHead>
                                            <TableHead className="w-[100px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filterMessages().map((message) => (
                                            <TableRow key={message.id} className={message.read ? "" : "bg-primary/5"}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedUsers.includes(message.id)}
                                                        onCheckedChange={() => toggleSelectUser(message.id)}
                                                        aria-label={`Select ${message.from.name}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {!message.read ? (
                                                        <Badge variant="default" className="bg-primary">New</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Read</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={message.from.avatar} alt={message.from.name} />
                                                            <AvatarFallback>{message.from.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium">{message.from.name}</p>
                                                            <p className="text-xs text-muted-foreground">{message.from.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{message.subject}</p>
                                                        <p className="text-sm text-muted-foreground truncate max-w-[350px]">
                                                            {message.snippet}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatDate(message.date)}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-1">
                                                        <Button variant="ghost" size="icon" title="Reply">
                                                            <Send className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" title="Delete">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {filterMessages().length} messages
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" disabled={selectedUsers.length === 0}>
                                        Mark as Read
                                    </Button>
                                    <Button variant="outline" size="sm" disabled={selectedUsers.length === 0}>
                                        Archive Selected
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Email Campaigns Tab */}
                    <TabsContent value="emails" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                    <CardTitle>Email Campaigns</CardTitle>
                                    <Button>
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Create Campaign
                                    </Button>
                                </div>
                                <CardDescription>
                                    Create and manage email marketing campaigns for your customers.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Campaign Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Recipients</TableHead>
                                            <TableHead className="text-right">Open Rate</TableHead>
                                            <TableHead className="text-right">Click Rate</TableHead>
                                            <TableHead className="w-[120px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockEmailCampaigns.map((campaign) => (
                                            <TableRow key={campaign.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{campaign.name}</p>
                                                        <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {campaign.status === 'sent' ? (
                                                        <Badge className="bg-green-600">Sent</Badge>
                                                    ) : campaign.status === 'scheduled' ? (
                                                        <Badge className="bg-amber-500">Scheduled</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Draft</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {campaign.sentDate ? (
                                                        <div>
                                                            <p className="text-sm">Sent on:</p>
                                                            <p className="font-medium">{formatDate(campaign.sentDate)}</p>
                                                        </div>
                                                    ) : campaign.sendDate ? (
                                                        <div>
                                                            <p className="text-sm">Scheduled for:</p>
                                                            <p className="font-medium">{formatDate(campaign.sendDate)}</p>
                                                        </div>
                                                    ) : campaign.lastEdited ? (
                                                        <div>
                                                            <p className="text-sm">Last edited:</p>
                                                            <p className="font-medium">{formatDate(campaign.lastEdited)}</p>
                                                        </div>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {campaign.recipients ?? '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {campaign.opened && campaign.recipients
                                                        ? `${Math.round((campaign.opened / campaign.recipients) * 100)}%`
                                                        : '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {campaign.clicked && campaign.recipients
                                                        ? `${Math.round((campaign.clicked / campaign.recipients) * 100)}%`
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-1">
                                                        <Button variant="ghost" size="icon" title="Edit">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" title="Duplicate">
                                                            <Upload className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" title="Delete">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="text-sm text-muted-foreground">
                                    {mockEmailCampaigns.length} campaigns total
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Data
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-center">
                                    <CardTitle>Notification Templates</CardTitle>
                                    <Button>
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        New Template
                                    </Button>
                                </div>
                                <CardDescription>
                                    Manage notification templates sent to users across different channels.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Template Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Channels</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Last Sent</TableHead>
                                            <TableHead className="text-right">Sent Count</TableHead>
                                            <TableHead className="w-[120px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockNotifications.map((notification) => (
                                            <TableRow key={notification.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{notification.title}</p>
                                                        <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                                                            {notification.message}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {notification.type === 'transactional' ? (
                                                        <Badge variant="outline" className="border-blue-500 text-blue-500">Transactional</Badge>
                                                    ) : notification.type === 'marketing' ? (
                                                        <Badge variant="outline" className="border-purple-500 text-purple-500">Marketing</Badge>
                                                    ) : notification.type === 'security' ? (
                                                        <Badge variant="outline" className="border-red-500 text-red-500">Security</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="border-green-500 text-green-500">Engagement</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-1">
                                                        {notification.channels.map((channel, index) => (
                                                            <Badge key={index} variant="secondary" className="capitalize">
                                                                {channel}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {notification.status === 'active' ? (
                                                        <div className="flex items-center">
                                                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                                                            Active
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <div className="h-2 w-2 rounded-full bg-gray-400 mr-2" />
                                                            Inactive
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>{formatDate(notification.lastSent)}</TableCell>
                                                <TableCell className="text-right">{notification.sentCount.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-1">
                                                        <Button variant="ghost" size="icon" title="Edit">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" title="Toggle Status">
                                                            {notification.status === 'active' ? (
                                                                <XCircle className="h-4 w-4" />
                                                            ) : (
                                                                <CheckCircle className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button variant="ghost" size="icon" title="View Stats">
                                                            <AlertCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="text-sm text-muted-foreground">
                                    {mockNotifications.length} notification templates
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Clock className="h-4 w-4 mr-2" />
                                        View Send History
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>

            {/* Compose Dialog */}
            <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Compose Message</DialogTitle>
                        <DialogDescription>
                            Create a new message or notification to send to users.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleComposeSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="recipient-type" className="text-right">
                                    To
                                </Label>
                                <div className="col-span-3">
                                    <Select
                                        value={composeData.recipientType}
                                        onValueChange={(val) => setComposeData({ ...composeData, recipientType: val })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select recipients" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Recipient Groups</SelectLabel>
                                                <SelectItem value="all">All Users</SelectItem>
                                                <SelectItem value="customers">All Customers</SelectItem>
                                                <SelectItem value="admins">All Administrators</SelectItem>
                                                <SelectItem value="specific">Specific Users</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {composeData.recipientType === 'specific' && (
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label className="text-right pt-2">
                                        Select Users
                                    </Label>
                                    <div className="col-span-3 border rounded-md">
                                        <ScrollArea className="h-24">
                                            {mockUsers.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center space-x-2 p-2 hover:bg-muted/50"
                                                >
                                                    <Checkbox
                                                        id={`user-${user.id}`}
                                                        checked={composeData.selectedRecipients.includes(user.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setComposeData({
                                                                    ...composeData,
                                                                    selectedRecipients: [...composeData.selectedRecipients, user.id]
                                                                });
                                                            } else {
                                                                setComposeData({
                                                                    ...composeData,
                                                                    selectedRecipients: composeData.selectedRecipients.filter(id => id !== user.id)
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <Label
                                                        htmlFor={`user-${user.id}`}
                                                        className="text-sm flex items-center justify-between w-full cursor-pointer"
                                                    >
                                                        <span>{user.name}</span>
                                                        <span className="text-muted-foreground text-xs">{user.email}</span>
                                                    </Label>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="subject" className="text-right">
                                    Subject
                                </Label>
                                <Input
                                    id="subject"
                                    className="col-span-3"
                                    value={composeData.subject}
                                    onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                                    placeholder="Enter message subject"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="message" className="text-right">
                                    Message
                                </Label>
                                <Textarea
                                    id="message"
                                    className="col-span-3"
                                    rows={8}
                                    value={composeData.message}
                                    onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                                    placeholder="Write your message here..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsComposeOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Send Message</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}