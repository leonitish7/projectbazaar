"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { categories } from '@/data/projects';

export default function CustomProjectPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        projectType: '',
        projectCategory: '',
        description: '',
        budget: '',
        timeline: '',
        requirements: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) newErrors.email = 'Valid email is required';
        if (!formData.projectType.trim()) newErrors.projectType = 'Project type is required';
        if (!formData.projectCategory.trim()) newErrors.projectCategory = 'Category is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/custom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit request');
            }

            // Success
            toast({
                title: "Request Submitted",
                description: "Your custom project request has been submitted successfully. We'll contact you soon.",
            });

            // Reset form
            setFormData({
                name: user?.name || '',
                email: user?.email || '',
                phone: '',
                projectType: '',
                projectCategory: '',
                description: '',
                budget: '',
                timeline: '',
                requirements: ''
            });

            // Redirect after brief delay
            setTimeout(() => {
                router.push('/');
            }, 2000);

        } catch (error) {
            console.error('Error submitting request:', error);
            setServerError(error instanceof Error ? error.message : 'Failed to submit request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Project types
    const projectTypes = [
        'Academic Project',
        'Research Project',
        'Personal Project',
        'Commercial Project',
        'Prototype',
        'Other'
    ];

    // Timeline options
    const timelineOptions = [
        'Urgent (< 1 week)',
        'Short term (1-2 weeks)',
        'Medium term (2-4 weeks)',
        'Long term (1-2 months)',
        'Extended (2+ months)'
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl fade-in">
            <h1 className="text-3xl font-bold mb-6 text-center">Custom Project Request</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Request a Custom Project</CardTitle>
                    <CardDescription>
                        Fill out the form below to request a custom project tailored to your specific needs.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {serverError && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contact Information */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        disabled={isLoading}
                                    />
                                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your.email@example.com"
                                        disabled={isLoading}
                                    />
                                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Your contact number"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Project Information */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="projectType">Project Type *</Label>
                                    <Select
                                        value={formData.projectType}
                                        onValueChange={(value) => handleSelectChange('projectType', value)}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select project type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projectTypes.map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.projectType && <p className="text-sm text-red-500 mt-1">{errors.projectType}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="projectCategory">Project Category *</Label>
                                    <Select
                                        value={formData.projectCategory}
                                        onValueChange={(value) => handleSelectChange('projectCategory', value)}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.projectCategory && <p className="text-sm text-red-500 mt-1">{errors.projectCategory}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="timeline">Timeline (Optional)</Label>
                                    <Select
                                        value={formData.timeline}
                                        onValueChange={(value) => handleSelectChange('timeline', value)}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timeline" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timelineOptions.map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="budget">Budget (Optional)</Label>
                                    <Input
                                        id="budget"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        placeholder="Your budget range"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="description">Project Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your project requirements in detail"
                                    rows={5}
                                    disabled={isLoading}
                                />
                                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <Label htmlFor="requirements">Additional Requirements (Optional)</Label>
                                <Textarea
                                    id="requirements"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    placeholder="Any specific features, technologies, or requirements you want to include"
                                    rows={3}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <CardFooter className="px-0 pt-6 flex flex-col sm:flex-row justify-end gap-4">
                            <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}