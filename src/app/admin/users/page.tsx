"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { fetchAPI } from '@/lib/api';
import { User, UserPlus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Shield, Check, Ban, Download, AlertTriangle, ChevronDown, Mail, Phone, Calendar } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

interface UserType {
    _id: string;
    name: string;
    email: string;
    image?: string;
    isAdmin: boolean;
    isActive: boolean;
    createdAt: string;
    phone?: string;
    address?: string;
    orders?: number;
    totalSpent?: number;
    lastLogin?: string;
    status: 'active' | 'inactive' | 'suspended';
}

export default function UsersManagementPage() {
    const { user: currentUser, token } = useAuth();
    const [users, setUsers] = useState<UserType[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [userToEdit, setUserToEdit] = useState<UserType | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [userFilter, setUserFilter] = useState("all");

    useEffect(() => {
        fetchUsers();
    }, [activeTab, currentPage, sortBy, sortOrder, searchTerm, userFilter]);

    const fetchUsers = async () => {
        if (!currentUser?.isAdmin) return;

        try {
            setIsLoading(true);
            // In a production environment, this would be an actual API call
            // For now we'll simulate the API response with mock data
            // const response = await fetchAPI(`/api/admin/users?page=${currentPage}&limit=10&sort=${sortBy}&order=${sortOrder}&search=${searchTerm}&type=${activeTab}`, {
            //   headers: {
            //     Authorization: `Bearer ${token}`
            //   }
            // });

            // setUsers(response.users);
            // setTotalPages(response.totalPages);

            // For development, mock data:
            const mockUsers = getMockUsers();

            // Apply filters to mock data
            let filteredUsers = [...mockUsers];

            if (searchTerm) {
                filteredUsers = filteredUsers.filter(
                    user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (activeTab !== "all") {
                filteredUsers = filteredUsers.filter(user => {
                    if (activeTab === "admins") return user.isAdmin;
                    if (activeTab === "customers") return !user.isAdmin;
                    if (activeTab === "active") return user.isActive;
                    if (activeTab === "inactive") return !user.isActive;
                    return true;
                });
            }

            // Sort the filtered users
            filteredUsers.sort((a, b) => {
                if (sortBy === "name") {
                    return sortOrder === "asc"
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                } else if (sortBy === "email") {
                    return sortOrder === "asc"
                        ? a.email.localeCompare(b.email)
                        : b.email.localeCompare(a.email);
                } else if (sortBy === "createdAt") {
                    return sortOrder === "asc"
                        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                } else if (sortBy === "orders") {
                    return sortOrder === "asc"
                        ? (a.orders || 0) - (b.orders || 0)
                        : (b.orders || 0) - (a.orders || 0);
                }
                return 0;
            });

            // Pagination
            const startIndex = (currentPage - 1) * 10;
            const endIndex = startIndex + 10;
            const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

            setUsers(paginatedUsers);
            setTotalPages(Math.ceil(filteredUsers.length / 10));

        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectUser = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAllUsers = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(user => user._id));
        }
    };

    const handleEditUser = (user: UserType) => {
        setUserToEdit(user);
        setIsEditDialogOpen(true);
    };

    const handleDeletePrompt = (userId: string) => {
        setUserToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            // In a production environment, this would be an actual API call
            // await fetchAPI(`/api/admin/users/${userToDelete}`, {
            //   method: 'DELETE',
            //   headers: {
            //     Authorization: `Bearer ${token}`
            //   }
            // });

            // For development, just filter the user out
            setUsers(prev => prev.filter(user => user._id !== userToDelete));
            setSelectedUsers(prev => prev.filter(id => id !== userToDelete));
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);

        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleBulkAction = (action: string) => {
        if (selectedUsers.length === 0) return;

        // In a production environment, this would be an actual API call
        // const endpoint = `/api/admin/users/bulk-${action}`;
        // await fetchAPI(endpoint, {
        //   method: 'POST',
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   },
        //   body: JSON.stringify({ userIds: selectedUsers })
        // });

        // For development, just update the state accordingly
        let updatedUsers = [...users];

        if (action === 'delete') {
            updatedUsers = updatedUsers.filter(user => !selectedUsers.includes(user._id));
        } else if (action === 'activate') {
            updatedUsers = updatedUsers.map(user =>
                selectedUsers.includes(user._id) ? { ...user, isActive: true, status: 'active' } : user
            );
        } else if (action === 'deactivate') {
            updatedUsers = updatedUsers.map(user =>
                selectedUsers.includes(user._id) ? { ...user, isActive: false, status: 'inactive' } : user
            );
        } else if (action === 'make-admin') {
            updatedUsers = updatedUsers.map(user =>
                selectedUsers.includes(user._id) ? { ...user, isAdmin: true } : user
            );
        } else if (action === 'remove-admin') {
            updatedUsers = updatedUsers.map(user =>
                selectedUsers.includes(user._id) ? { ...user, isAdmin: false } : user
            );
        }

        setUsers(updatedUsers);
        setSelectedUsers([]);
    };

    const exportUsers = () => {
        // In a production environment, this would trigger a CSV download
        alert("In a production environment, this would download a CSV file of users");
    };

    // MOCK DATA GENERATION
    const getMockUsers = (): UserType[] => {
        return [
            {
                _id: "u1",
                name: "John Doe",
                email: "john@example.com",
                image: "https://ui-avatars.com/api/?name=John+Doe&background=random",
                isAdmin: true,
                isActive: true,
                createdAt: "2023-01-15T10:30:00Z",
                phone: "+91 98765 43210",
                address: "123 Main St, Mumbai",
                orders: 5,
                totalSpent: 15000,
                lastLogin: "2023-04-15T08:20:00Z",
                status: "active"
            },
            {
                _id: "u2",
                name: "Jane Smith",
                email: "jane@example.com",
                image: "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
                isAdmin: false,
                isActive: true,
                createdAt: "2023-02-20T14:45:00Z",
                phone: "+91 98765 12345",
                address: "456 Park Ave, Delhi",
                orders: 8,
                totalSpent: 24000,
                lastLogin: "2023-04-14T12:10:00Z",
                status: "active"
            },
            {
                _id: "u3",
                name: "Raj Kumar",
                email: "raj@example.com",
                image: "https://ui-avatars.com/api/?name=Raj+Kumar&background=random",
                isAdmin: false,
                isActive: true,
                createdAt: "2023-03-10T09:15:00Z",
                phone: "+91 87654 32109",
                address: "789 Tech Park, Bangalore",
                orders: 3,
                totalSpent: 8500,
                lastLogin: "2023-04-10T16:45:00Z",
                status: "active"
            },
            {
                _id: "u4",
                name: "Priya Singh",
                email: "priya@example.com",
                image: "https://ui-avatars.com/api/?name=Priya+Singh&background=random",
                isAdmin: false,
                isActive: false,
                createdAt: "2023-03-25T11:20:00Z",
                phone: "+91 76543 21098",
                address: "101 Lake View, Chennai",
                orders: 1,
                totalSpent: 3000,
                lastLogin: "2023-03-26T10:30:00Z",
                status: "inactive"
            },
            {
                _id: "u5",
                name: "Amit Patel",
                email: "amit@example.com",
                image: "https://ui-avatars.com/api/?name=Amit+Patel&background=random",
                isAdmin: true,
                isActive: true,
                createdAt: "2022-12-05T08:50:00Z",
                phone: "+91 65432 10987",
                address: "202 Green Heights, Ahmedabad",
                orders: 0,
                totalSpent: 0,
                lastLogin: "2023-04-16T09:15:00Z",
                status: "active"
            },
            {
                _id: "u6",
                name: "Sneha Reddy",
                email: "sneha@example.com",
                image: "https://ui-avatars.com/api/?name=Sneha+Reddy&background=random",
                isAdmin: false,
                isActive: true,
                createdAt: "2023-02-15T16:40:00Z",
                phone: "+91 54321 09876",
                address: "303 Hill Road, Hyderabad",
                orders: 6,
                totalSpent: 18500,
                lastLogin: "2023-04-12T14:20:00Z",
                status: "active"
            },
            {
                _id: "u7",
                name: "Rahul Sharma",
                email: "rahul@example.com",
                image: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=random",
                isAdmin: false,
                isActive: false,
                createdAt: "2023-01-30T10:10:00Z",
                phone: "+91 43210 98765",
                address: "404 River View, Kolkata",
                orders: 2,
                totalSpent: 5500,
                lastLogin: "2023-03-01T11:45:00Z",
                status: "suspended"
            }
        ];
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Users Management</h2>
                        <p className="text-muted-foreground">
                            Manage user accounts, permissions and activity
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportUsers}
                            className="h-9"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        <Button onClick={() => setIsEditDialogOpen(true)} className="h-9">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add New User
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="all">All Users</TabsTrigger>
                            <TabsTrigger value="customers">Customers</TabsTrigger>
                            <TabsTrigger value="admins">Administrators</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="inactive">Inactive</TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search users..."
                                    className="w-[250px] pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-9">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filter
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[200px]">
                                    <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setUserFilter("all")}>
                                        <Check className={`mr-2 h-4 w-4 ${userFilter === "all" ? "opacity-100" : "opacity-0"}`} />
                                        All Users
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setUserFilter("recent")}>
                                        <Check className={`mr-2 h-4 w-4 ${userFilter === "recent" ? "opacity-100" : "opacity-0"}`} />
                                        Recently Added
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setUserFilter("high-value")}>
                                        <Check className={`mr-2 h-4 w-4 ${userFilter === "high-value" ? "opacity-100" : "opacity-0"}`} />
                                        High Value Customers
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => { setSortBy("name"); setSortOrder("asc") }}>
                                        Name (A-Z)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setSortBy("name"); setSortOrder("desc") }}>
                                        Name (Z-A)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setSortBy("createdAt"); setSortOrder("desc") }}>
                                        Newest First
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setSortBy("createdAt"); setSortOrder("asc") }}>
                                        Oldest First
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setSortBy("orders"); setSortOrder("desc") }}>
                                        Most Orders
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            {selectedUsers.length > 0 && (
                                <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
                                    <div className="text-sm">
                                        <span className="font-medium">{selectedUsers.length}</span> user(s) selected
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleBulkAction("activate")}>
                                            <Check className="mr-2 h-4 w-4" />
                                            Activate
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleBulkAction("deactivate")}>
                                            <Ban className="mr-2 h-4 w-4" />
                                            Deactivate
                                        </Button>
                                        {currentUser?.isAdmin && (
                                            <>
                                                <Button variant="outline" size="sm" onClick={() => handleBulkAction("make-admin")}>
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    Make Admin
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleBulkAction("remove-admin")}>
                                                    <User className="mr-2 h-4 w-4" />
                                                    Remove Admin
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleBulkAction("delete")}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40px]">
                                            <Checkbox
                                                checked={
                                                    users.length > 0 && selectedUsers.length === users.length
                                                }
                                                onCheckedChange={handleSelectAllUsers}
                                                aria-label="Select all users"
                                            />
                                        </TableHead>
                                        <TableHead className="w-[250px]">User</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Orders</TableHead>
                                        <TableHead>Total Spent</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                                    <p className="text-sm text-muted-foreground">Loading users...</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <User className="h-10 w-10 text-muted-foreground" />
                                                    <p className="text-muted-foreground">No users found</p>
                                                    <Button size="sm" variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        Add New User
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <TableRow key={user._id} className="group">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedUsers.includes(user._id)}
                                                        onCheckedChange={() => handleSelectUser(user._id)}
                                                        aria-label={`Select ${user.name}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border">
                                                            <AvatarImage src={user.image} alt={user.name} />
                                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Mail className="h-3 w-3" /> {user.email}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            user.status === "active" ? "default" :
                                                                user.status === "inactive" ? "secondary" :
                                                                    "destructive"
                                                        }
                                                    >
                                                        {user.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.isAdmin ? (
                                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                                            Administrator
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            Customer
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>{user.orders || 0}</TableCell>
                                                <TableCell>
                                                    {user.totalSpent ? `₹${user.totalSpent.toLocaleString()}` : '₹0'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Actions</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            {user.isActive ? (
                                                                <DropdownMenuItem onClick={() => handleBulkAction("deactivate")}>
                                                                    <Ban className="mr-2 h-4 w-4" />
                                                                    Deactivate
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem onClick={() => handleBulkAction("activate")}>
                                                                    <Check className="mr-2 h-4 w-4" />
                                                                    Activate
                                                                </DropdownMenuItem>
                                                            )}
                                                            {currentUser?.isAdmin && !user.isAdmin && (
                                                                <DropdownMenuItem>
                                                                    <Shield className="mr-2 h-4 w-4" />
                                                                    Make Admin
                                                                </DropdownMenuItem>
                                                            )}
                                                            {currentUser?.isAdmin && user.isAdmin && user._id !== currentUser._id && (
                                                                <DropdownMenuItem>
                                                                    <User className="mr-2 h-4 w-4" />
                                                                    Remove Admin
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => handleDeletePrompt(user._id)}
                                                                disabled={user._id === currentUser?._id}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between border-t p-4">
                            <div className="text-xs text-muted-foreground">
                                Showing {users.length} of {totalPages * 10} users
                            </div>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        {currentPage > 1 && (
                                            <PaginationPrevious
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            />
                                        )}
                                    </PaginationItem>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                isActive={currentPage === i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        {currentPage < totalPages && (
                                            <PaginationNext
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            />
                                        )}
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </CardFooter>
                    </Card>
                </Tabs>
            </div>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {userToEdit ? `Edit User: ${userToEdit.name}` : "Create New User"}
                        </DialogTitle>
                        <DialogDescription>
                            {userToEdit
                                ? "Update user information and permissions."
                                : "Add a new user to the system."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                defaultValue={userToEdit?.name || ""}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                defaultValue={userToEdit?.email || ""}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                defaultValue={userToEdit?.phone || ""}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Address
                            </Label>
                            <Input
                                id="address"
                                defaultValue={userToEdit?.address || ""}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <Select defaultValue={userToEdit?.isAdmin ? "admin" : "customer"}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                    <SelectItem value="customer">Customer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Status
                            </Label>
                            <Select defaultValue={userToEdit?.status || "active"}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {!userToEdit && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    className="col-span-3"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" onClick={() => setIsEditDialogOpen(false)}>
                            {userToEdit ? "Save Changes" : "Create User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Delete User
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. Are you sure you want to delete this user?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}