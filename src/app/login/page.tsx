"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, User, ShoppingCart } from 'lucide-react';

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    useEffect(() => {
        const justRegistered = searchParams.get('registered');
        if (justRegistered === 'true') {
            setSuccessMessage('Account created successfully! Please log in.');
        }
    }, [searchParams]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setSuccessMessage('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            if (isAdminLogin) {
                if (formData.email === "nt10nitish@gmail.com" && formData.password === "nk10nikhil") {
                    login("admin-token", {
                        _id: "admin",
                        name: "Admin",
                        email: formData.email,
                        isAdmin: true
                    });
                    router.push('/admin/dashboard');
                    return;
                } else {
                    setServerError('Invalid admin credentials');
                    setIsLoading(false);
                    return;
                }
            }

            const response = await fetchAPI('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            login(response.token, response.user);
            router.push('/');
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof Error) {
                setServerError(error.message);
            } else if (typeof error === 'object' && error && 'message' in error) {
                setServerError(String(error.message));
            } else {
                setServerError('Invalid email or password');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10 p-4">
            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
                <motion.div
                    className="hidden md:flex flex-col justify-center items-center p-8"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative">
                        <motion.div
                            className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full"
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 10, 0]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute -bottom-10 -right-8 w-32 h-32 bg-accent/10 rounded-full"
                            animate={{
                                scale: [1, 1.15, 1],
                                rotate: [0, -10, 0]
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                        />
                        <div className="relative z-10 mb-8">
                            {/* Enhanced Project Bazaar Branding */}
                            <div className="flex items-center mb-8">
                                <div className="bg-primary/20 p-4 rounded-xl shadow-md mr-4">
                                    <ShoppingCart size={28} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                        Project Bazaar
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">Your marketplace for premium projects</p>
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Welcome Back!
                            </h1>
                            <p className="text-muted-foreground max-w-md">
                                Sign in to access your account and continue exploring our curated collection of high-quality projects.
                            </p>
                        </div>

                        <div className="mt-8 space-y-4 relative z-10">
                            <div className="flex items-center space-x-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-sm">Access your purchases and downloads</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-accent/10 p-2 rounded-full">
                                    <Lock className="h-5 w-5 text-accent" />
                                </div>
                                <p className="text-sm">Securely manage your account</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <ArrowRight className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-sm">Get started with your next project</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Mobile Logo for small screens */}
                    <div className="md:hidden flex justify-center mb-6">
                        <div className="flex items-center">
                            <div className="bg-primary/20 p-3 rounded-xl shadow-md mr-3">
                                <ShoppingCart size={20} className="text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Project Bazaar
                            </h2>
                        </div>
                    </div>

                    <Card className="border-none shadow-lg bg-card/70 backdrop-blur-sm">
                        <CardHeader className="space-y-2">
                            <div className="flex justify-center mb-2">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Lock className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                            <CardDescription className="text-center">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {serverError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertDescription>{serverError}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}

                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert className="mb-4 border border-green-200 bg-green-50">
                                        <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="pl-10"
                                        />
                                    </div>
                                    {errors.email && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm text-red-500"
                                        >
                                            {errors.email}
                                        </motion.span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            className="pl-10"
                                        />
                                    </div>
                                    {errors.password && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-sm text-red-500"
                                        >
                                            {errors.password}
                                        </motion.span>
                                    )}
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Signing in...
                                            </div>
                                        ) : 'Sign In'}
                                    </Button>
                                </motion.div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 border-t border-border/50 pt-4">
                            <p className="text-sm text-muted-foreground text-center">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="text-primary font-medium hover:underline">
                                    Sign up
                                </Link>
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsAdminLogin(!isAdminLogin)}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {isAdminLogin ? 'Switch to User Login' : 'Admin Login'}
                            </button>
                            {isAdminLogin && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-xs text-muted-foreground mt-1 text-center italic"
                                >
                                    Admin access is restricted to authorized personnel only.
                                </motion.p>
                            )}
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;