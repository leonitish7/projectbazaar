"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
    Home, Package, ClipboardList, Settings, LogOut,
    Users, BarChart3, FileText, Tag, ShieldAlert,
    Bell, ChevronLeft, ChevronRight, Menu, Cpu,
    Activity, Database, Globe, MessageSquare, HelpCircle,
    BookOpen, UserPlus, AlertTriangle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState(3);
    const [currentTime, setCurrentTime] = useState('');
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        main: true,
        content: true,
        users: true,
        analytics: true,
        system: true
    });

    // Update current time
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    // Redirect if not admin - client side
    useEffect(() => {
        if (!user?.isAdmin) {
            window.location.href = '/login';
        }
    }, [user]);

    // Handle window resize to set sidebar state
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!user?.isAdmin) {
        return null;
    }

    const toggleGroup = (group: string) => {
        setOpenGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    // Menu items organized by category
    const menuGroups = {
        main: [
            {
                href: '/admin/dashboard',
                icon: <Home className="h-4 w-4" />,
                label: 'Dashboard',
                active: pathname === '/admin/dashboard'
            },
            {
                href: '/admin/activity',
                icon: <Activity className="h-4 w-4" />,
                label: 'Recent Activity',
                active: pathname.includes('/admin/activity')
            }
        ],
        content: [
            {
                href: '/admin/projects',
                icon: <FileText className="h-4 w-4" />,
                label: 'Projects',
                active: pathname.includes('/admin/projects'),
                submenu: [
                    {
                        href: '/admin/projects/all',
                        label: 'All Projects',
                        active: pathname === '/admin/projects/all'
                    },
                    {
                        href: '/admin/projects/categories',
                        label: 'Categories',
                        active: pathname === '/admin/projects/categories'
                    },
                    {
                        href: '/admin/projects/new',
                        label: 'Add New',
                        active: pathname === '/admin/projects/new'
                    },
                    {
                        href: '/admin/projects/featured',
                        label: 'Featured Projects',
                        active: pathname === '/admin/projects/featured'
                    }
                ]
            },
            {
                href: '/admin/orders',
                icon: <Package className="h-4 w-4" />,
                label: 'Orders',
                badge: '12',
                badgeClass: 'bg-primary text-primary-foreground',
                active: pathname.includes('/admin/orders'),
                submenu: [
                    {
                        href: '/admin/orders/all',
                        label: 'All Orders',
                        active: pathname === '/admin/orders/all'
                    },
                    {
                        href: '/admin/orders/pending',
                        label: 'Pending',
                        badge: '8',
                        active: pathname === '/admin/orders/pending'
                    },
                    {
                        href: '/admin/orders/completed',
                        label: 'Completed',
                        active: pathname === '/admin/orders/completed'
                    }
                ]
            },
            {
                href: '/admin/custom-requests',
                icon: <ClipboardList className="h-4 w-4" />,
                label: 'Custom Requests',
                badge: '5',
                badgeClass: 'bg-accent text-accent-foreground',
                active: pathname.includes('/admin/custom-requests')
            }
        ],
        users: [
            {
                href: '/admin/users',
                icon: <Users className="h-4 w-4" />,
                label: 'User Management',
                active: pathname.includes('/admin/users'),
                submenu: [
                    {
                        href: '/admin/users/all',
                        label: 'All Users',
                        active: pathname === '/admin/users/all'
                    },
                    {
                        href: '/admin/users/customers',
                        label: 'Customers',
                        active: pathname === '/admin/users/customers'
                    },
                    {
                        href: '/admin/users/admins',
                        label: 'Administrators',
                        active: pathname === '/admin/users/admins'
                    }
                ]
            },
            {
                href: '/admin/communications',
                icon: <MessageSquare className="h-4 w-4" />,
                label: 'Communications',
                active: pathname.includes('/admin/communications'),
                submenu: [
                    {
                        href: '/admin/communications/messages',
                        label: 'Messages',
                        badge: '3',
                        active: pathname === '/admin/communications/messages'
                    },
                    {
                        href: '/admin/communications/emails',
                        label: 'Email Campaigns',
                        active: pathname === '/admin/communications/emails'
                    },
                    {
                        href: '/admin/communications/notifications',
                        label: 'Notifications',
                        active: pathname === '/admin/communications/notifications'
                    }
                ]
            }
        ],
        analytics: [
            {
                href: '/admin/analytics',
                icon: <BarChart3 className="h-4 w-4" />,
                label: 'Analytics',
                active: pathname.includes('/admin/analytics'),
                submenu: [
                    {
                        href: '/admin/analytics/overview',
                        label: 'Overview',
                        active: pathname === '/admin/analytics/overview'
                    },
                    {
                        href: '/admin/analytics/sales',
                        label: 'Sales Metrics',
                        active: pathname === '/admin/analytics/sales'
                    },
                    {
                        href: '/admin/analytics/traffic',
                        label: 'Traffic Sources',
                        active: pathname === '/admin/analytics/traffic'
                    }
                ]
            },
            {
                href: '/admin/marketing',
                icon: <Tag className="h-4 w-4" />,
                label: 'Marketing',
                active: pathname.includes('/admin/marketing')
            }
        ],
        system: [
            {
                href: '/admin/settings',
                icon: <Settings className="h-4 w-4" />,
                label: 'Settings',
                active: pathname.includes('/admin/settings'),
                submenu: [
                    {
                        href: '/admin/settings/general',
                        label: 'General',
                        active: pathname === '/admin/settings/general'
                    },
                    {
                        href: '/admin/settings/appearance',
                        label: 'Appearance',
                        active: pathname === '/admin/settings/appearance'
                    },
                    {
                        href: '/admin/settings/payment',
                        label: 'Payment',
                        active: pathname === '/admin/settings/payment'
                    }
                ]
            },
            {
                href: '/admin/database',
                icon: <Database className="h-4 w-4" />,
                label: 'Database',
                active: pathname.includes('/admin/database')
            },
            {
                href: '/admin/security',
                icon: <ShieldAlert className="h-4 w-4" />,
                label: 'Security',
                badge: '!',
                badgeClass: 'bg-destructive text-destructive-foreground',
                active: pathname.includes('/admin/security')
            }
        ]
    };

    // Group labels for sidebar organization
    const groupLabels: Record<string, string> = {
        main: 'Overview',
        content: 'Content Management',
        users: 'User Management',
        analytics: 'Analytics & Reporting',
        system: 'System Settings'
    };

    // Mock notifications data
    const notificationItems = [
        {
            id: 'n1',
            title: 'New Order',
            message: 'New order #2025053 received',
            time: '5 min ago',
            read: false,
            icon: <Package className="h-4 w-4" />
        },
        {
            id: 'n2',
            title: 'System Alert',
            message: 'Server load is high (85%)',
            time: '15 min ago',
            read: false,
            icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />
        },
        {
            id: 'n3',
            title: 'New User',
            message: 'Rahul Singh just registered',
            time: '1 hour ago',
            read: true,
            icon: <UserPlus className="h-4 w-4 text-green-500" />
        }
    ];

    const getPageTitle = () => {
        // More specific routes first
        if (pathname.includes('/admin/orders/details')) return 'Order Details';
        if (pathname.includes('/admin/orders/pending')) return 'Pending Orders';
        if (pathname.includes('/admin/orders/completed')) return 'Completed Orders';
        if (pathname.includes('/admin/projects/categories')) return 'Project Categories';
        if (pathname.includes('/admin/projects/new')) return 'Add New Project';
        if (pathname.includes('/admin/projects/all')) return 'All Projects';

        // Then check for section routes
        if (pathname === '/admin/dashboard') return 'Dashboard';
        if (pathname.includes('/admin/orders')) return 'Orders Management';
        if (pathname.includes('/admin/custom-requests')) return 'Custom Project Requests';
        if (pathname.includes('/admin/users')) return 'Users Management';
        if (pathname.includes('/admin/projects')) return 'Projects Management';
        if (pathname.includes('/admin/settings')) return 'Admin Settings';
        if (pathname.includes('/admin/analytics')) return 'Analytics Dashboard';
        if (pathname.includes('/admin/marketing')) return 'Marketing Tools';
        if (pathname.includes('/admin/database')) return 'Database Management';
        if (pathname.includes('/admin/security')) return 'Security Controls';

        return 'Admin Panel';
    };

    // Quick actions for the header
    const quickActions = [
        { label: 'New Project', icon: <FileText className="h-3 w-3" />, href: '/admin/projects/new' },
        { label: 'New User', icon: <UserPlus className="h-3 w-3" />, href: '/admin/users/new' },
        { label: 'View Site', icon: <Globe className="h-3 w-3" />, href: '/' }
    ];

    const renderMenuItem = (item: any) => {
        const hasSubmenu = item.submenu && item.submenu.length > 0;

        if (hasSubmenu) {
            return (
                <Collapsible
                    key={item.href}
                    className="w-full mb-1"
                    open={item.active}
                    onOpenChange={() => { }}
                >
                    <CollapsibleTrigger asChild>
                        <div className={`
                            flex items-center justify-between w-full px-3 py-2 rounded-md text-sm
                            ${item.active ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 hover:text-accent-foreground'}
                            cursor-pointer transition-colors
                        `}>
                            <div className="flex items-center gap-3">
                                <span className={`p-1.5 rounded-md ${item.active ? "bg-primary/20" : "bg-muted/50"}`}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </div>
                            {item.badge && (
                                <Badge className={`text-xs h-5 ${item.badgeClass || ""}`}>
                                    {item.badge}
                                </Badge>
                            )}
                            <ChevronRight className={`h-4 w-4 transition-transform ${item.active ? 'rotate-90' : ''}`} />
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="pt-1 pl-9 space-y-1">
                            {item.submenu.map((subItem: any) => (
                                <Link key={subItem.href} href={subItem.href}>
                                    <div className={`
                                        px-3 py-1.5 rounded-md text-sm
                                        ${subItem.active ? 'bg-accent/80 text-accent-foreground' : 'hover:bg-accent/30 hover:text-accent-foreground'}
                                        cursor-pointer transition-colors
                                    `}>
                                        <div className="flex items-center justify-between">
                                            <span>{subItem.label}</span>
                                            {subItem.badge && (
                                                <Badge variant="outline" className="text-[10px] h-4">
                                                    {subItem.badge}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            );
        }

        return (
            <Link key={item.href} href={item.href} className="w-full">
                <div className={`
                    flex items-center justify-between px-3 py-2 rounded-md text-sm mb-1
                    ${item.active ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 hover:text-accent-foreground'}
                    cursor-pointer transition-colors
                `}>
                    <div className="flex items-center gap-3">
                        <span className={`p-1.5 rounded-md ${item.active ? "bg-primary/20" : "bg-muted/50"}`}>
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </div>
                    {item.badge && (
                        <Badge className={`text-xs h-5 ${item.badgeClass || ""}`}>
                            {item.badge}
                        </Badge>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-20 w-64 bg-card shadow-sm border-r
                    transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:relative
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    ${isMobileMenuOpen ? 'translate-x-0' : ''}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-primary/20">
                            <AvatarImage src="/logo.png" alt="Project Bazaar" />
                            <AvatarFallback className="bg-primary/10">PB</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-semibold">Admin Panel</span>
                            <span className="text-xs text-muted-foreground">Project Bazaar</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:flex ml-auto hidden"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden ml-auto"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Sidebar Menu */}
                    <ScrollArea className="flex-1 py-3 px-3">
                        {Object.entries(menuGroups).map(([key, items]) => (
                            <div key={key} className="mb-4">
                                <div
                                    className="flex items-center justify-between px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground mb-2"
                                    onClick={() => toggleGroup(key)}
                                >
                                    <span>{groupLabels[key]}</span>
                                    <ChevronRight
                                        className={`h-4 w-4 transition-transform ${openGroups[key] ? 'rotate-90' : ''}`}
                                    />
                                </div>

                                {openGroups[key] && (
                                    <div className="space-y-1">
                                        {items.map(renderMenuItem)}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="mt-4 px-3">
                            <div className="p-3 rounded-md border border-dashed bg-muted/30 text-center space-y-2">
                                <HelpCircle className="h-4 w-4 mx-auto text-muted-foreground" />
                                <h4 className="text-xs font-medium">Need Help?</h4>
                                <p className="text-xs text-muted-foreground">Check our documentation</p>
                                <Button variant="outline" size="sm" className="w-full text-xs">
                                    <BookOpen className="h-3 w-3 mr-1" /> Documentation
                                </Button>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Sidebar Footer */}
                    <div className="p-3 border-t">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{user?.name || 'Admin User'}</span>
                                <span className="text-xs text-muted-foreground">Administrator</span>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={logout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 bg-card border-b sticky top-0 z-10">
                    <div className="flex items-center justify-between h-full px-4">
                        {/* Mobile Menu Trigger */}
                        <div className="flex items-center">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="lg:hidden mr-2"
                                    >
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-80">
                                    {/* Mobile sidebar content is handled by the main sidebar with responsive classes */}
                                </SheetContent>
                            </Sheet>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden lg:flex mr-2"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>

                            <h1 className="text-xl font-semibold hidden sm:block">
                                {getPageTitle()}
                            </h1>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3">
                            {/* Quick Actions */}
                            <div className="hidden md:flex items-center space-x-1">
                                {quickActions.map((action, index) => (
                                    <Link key={index} href={action.href}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-9"
                                        >
                                            {action.icon}
                                            <span className="ml-2">{action.label}</span>
                                        </Button>
                                    </Link>
                                ))}
                            </div>

                            {/* Time */}
                            <div className="hidden md:block text-sm text-muted-foreground">
                                {currentTime}
                            </div>

                            {/* Notification Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="relative"
                                    >
                                        <Bell className="h-5 w-5" />
                                        {notifications > 0 && (
                                            <span className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full text-[10px] flex items-center justify-center text-primary-foreground">
                                                {notifications}
                                            </span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuLabel className="flex justify-between items-center">
                                        <span>Notifications</span>
                                        <Badge variant="outline" className="ml-2">
                                            {notifications} new
                                        </Badge>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    {notificationItems.map(notification => (
                                        <DropdownMenuItem key={notification.id} className="cursor-pointer flex items-start py-2">
                                            <div className="flex items-start gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    {notification.icon}
                                                </div>
                                                <div>
                                                    <div className="flex justify-between">
                                                        <p className="text-sm font-medium">{notification.title}</p>
                                                        <span className="text-xs text-muted-foreground ml-2">{notification.time}</span>
                                                    </div>
                                                    <p className="text-xs mt-1">{notification.message}</p>
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="justify-center cursor-pointer">
                                        <span className="text-sm">View all notifications</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>
                                                {user?.name?.charAt(0) || 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout} className="text-destructive">Logout</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Breadcrumb navigation */}
                <div className="px-4 py-2 text-xs text-muted-foreground border-b bg-card/50">
                    <div className="flex items-center">
                        <Link href="/admin/dashboard" className="hover:text-primary">Admin</Link>
                        {pathname !== '/admin/dashboard' && pathname.split('/').slice(2).map((segment, i, arr) => (
                            <React.Fragment key={i}>
                                <span className="mx-1">/</span>
                                {i === arr.length - 1 ? (
                                    <span className="text-foreground capitalize">
                                        {segment.replace(/-/g, ' ')}
                                    </span>
                                ) : (
                                    <Link
                                        href={`/admin/${arr.slice(0, i + 1).join('/')}`}
                                        className="hover:text-primary capitalize"
                                    >
                                        {segment.replace(/-/g, ' ')}
                                    </Link>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-4 bg-background overflow-auto">
                    {children}
                </main>

                {/* Footer */}
                <footer className="border-t py-3 px-4 text-xs text-muted-foreground bg-card/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <p>© {new Date().getFullYear()} Project Bazaar Admin</p>
                        <div className="flex items-center gap-4">
                            <Link href="/admin/help" className="hover:text-primary">Help</Link>
                            <Link href="/admin/support" className="hover:text-primary">Support</Link>
                            <Link href="/admin/privacy" className="hover:text-primary">Privacy</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;