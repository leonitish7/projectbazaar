"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";

export default function ProfileSettingsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        if (typeof window !== "undefined") {
            router.push("/login");
        }
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: "", text: "" });

        // This would connect to a real API endpoint in production
        try {
            // Simulating API call for now
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage({
                type: "success",
                text: "Profile information updated successfully!"
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: "Failed to update profile information."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({
                type: "error",
                text: "New passwords do not match."
            });
            return;
        }

        setIsLoading(true);
        setMessage({ type: "", text: "" });

        // This would connect to a real API endpoint in production
        try {
            // Simulating API call for now
            await new Promise(resolve => setTimeout(resolve, 1000));

            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));

            setMessage({
                type: "success",
                text: "Password updated successfully!"
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: "Failed to update password."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl fade-in">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" asChild className="mr-4">
                    <Link href="/profile" legacyBehavior>
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Profile
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Account Settings</h1>
            </div>
            {message.text && (
                <div className={`p-4 mb-6 rounded-md ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                    {message.text}
                </div>
            )}
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your account details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your full name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Your email address"
                                />
                            </div>

                            <Button type="submit" disabled={isLoading}>
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>Update your password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    placeholder="Your current password"
                                />
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    placeholder="Your new password"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your new password"
                                />
                            </div>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}