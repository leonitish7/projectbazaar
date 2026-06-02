"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Search,
    MoreHorizontal,
    Filter,
    Download,
    Upload,
    Edit,
    Trash,
    Eye,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Sample data - in a real app, this would come from an API call
const mockProjects = [
    {
        id: 'p1',
        title: 'Advanced Web Development Portfolio',
        category: 'Web Development',
        status: 'active',
        price: 4999,
        sales: 34,
        rating: 4.7,
        image: '/projects/web2.png',
        description: 'Complete web portfolio with React, Next.js, and more',
        dateCreated: '2025-02-15',
    },
    {
        id: 'p2',
        title: 'Machine Learning Model for Sentiment Analysis',
        category: 'AI & Machine Learning',
        status: 'active',
        price: 5500,
        sales: 28,
        rating: 4.8,
        image: '/projects/ai1.png',
        description: 'Pre-trained ML model for analyzing text sentiment',
        dateCreated: '2025-03-02',
    },
    {
        id: 'p3',
        title: 'E-commerce Mobile Application',
        category: 'Mobile App Development',
        status: 'active',
        price: 4999,
        sales: 26,
        rating: 4.5,
        image: '/projects/app1.png',
        description: 'Complete e-commerce app with React Native',
        dateCreated: '2025-03-10',
    },
    {
        id: 'p4',
        title: 'IoT Home Automation System',
        category: 'IoT & Electronics',
        status: 'active',
        price: 5500,
        sales: 22,
        rating: 4.6,
        image: '/projects/arduino1.png',
        description: 'Arduino-based smart home system',
        dateCreated: '2025-01-28',
    },
    {
        id: 'p5',
        title: 'Blockchain Wallet Implementation',
        category: 'Blockchain',
        status: 'draft',
        price: 5500,
        sales: 0,
        rating: 0,
        image: '/projects/web1.png',
        description: 'Secure cryptocurrency wallet implementation',
        dateCreated: '2025-04-15',
    },
    {
        id: 'p6',
        title: 'Autonomous Drone Navigation System',
        category: 'Robotics',
        status: 'archived',
        price: 7999,
        sales: 18,
        rating: 4.2,
        image: '/projects/drone1.png',
        description: 'Complete drone navigation system with obstacle avoidance',
        dateCreated: '2024-11-05',
    },
];

export default function ProjectsPage() {
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    // Filter projects based on search query and filters
    const filteredProjects = mockProjects.filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Get unique categories for filter dropdown
    const categories = Array.from(new Set(mockProjects.map(p => p.category)));

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedProjects(filteredProjects.map(project => project.id));
        } else {
            setSelectedProjects([]);
        }
    };

    const handleSelectProject = (projectId: string, checked: boolean) => {
        if (checked) {
            setSelectedProjects([...selectedProjects, projectId]);
        } else {
            setSelectedProjects(selectedProjects.filter(id => id !== projectId));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Project Management</h1>
                    <p className="text-muted-foreground">Manage and organize your project listings</p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Create New Project</DialogTitle>
                                <DialogDescription>
                                    Fill in the details to create a new project.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Project Title</Label>
                                    <Input id="title" placeholder="Enter project title" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="price">Price (₹)</Label>
                                        <Input id="price" type="number" placeholder="Set price" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input id="description" placeholder="Brief description of the project" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="image">Project Image</Label>
                                    <div className="flex items-center gap-2">
                                        <Input id="image" type="file" className="flex-1" />
                                        <Button variant="outline" size="icon">
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select defaultValue="draft">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                                <Button type="submit">Create Project</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-2/3 relative">
                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-1/3 flex gap-2">
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => setStatusFilter(value)}
                    >
                        <SelectTrigger>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <span>{statusFilter === 'all' ? 'All Status' : `Status: ${statusFilter}`}</span>
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={categoryFilter}
                        onValueChange={(value) => setCategoryFilter(value)}
                    >
                        <SelectTrigger>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <span>Category</span>
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card>
                <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Projects ({filteredProjects.length})</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled={selectedProjects.length === 0}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Selected
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={
                                                filteredProjects.length > 0 &&
                                                selectedProjects.length === filteredProjects.length
                                            }
                                            onCheckedChange={handleSelectAll}
                                            aria-label="Select all"
                                        />
                                    </TableHead>
                                    <TableHead className="w-[300px]">Project</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Sales</TableHead>
                                    <TableHead className="text-right">Rating</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedProjects.includes(project.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectProject(project.id, checked as boolean)
                                                    }
                                                    aria-label={`Select ${project.title}`}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 rounded-md">
                                                        <AvatarImage src={project.image} alt={project.title} />
                                                        <AvatarFallback className="rounded-md">
                                                            {project.title.substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span>{project.title}</span>
                                                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                            {project.description}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{project.category}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    project.status === 'active'
                                                        ? 'default'
                                                        : project.status === 'draft'
                                                            ? 'outline'
                                                            : 'secondary'
                                                }>
                                                    {project.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">₹{project.price.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">{project.sales}</TableCell>
                                            <TableCell className="text-right">
                                                {project.rating > 0 ? project.rating : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Trash className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            No projects found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}