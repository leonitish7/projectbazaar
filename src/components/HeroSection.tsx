"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
    return (
        <section className="pt-16 pb-20 overflow-hidden">
            <div className="content-container relative">
                {/* Minimal background accents */}
                <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10" />
                <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-accent/5 blur-3xl -z-10" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Text content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center lg:text-left"
                    >
                        <span className="inline-block px-3 py-1 mb-6 text-xs font-medium bg-primary/10 text-primary rounded-full">
                            Tech Projects Marketplace
                        </span>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-6 leading-tight">
                            Find the Perfect Tech Projects For Your Portfolio
                        </h1>

                        <p className="text-muted-foreground text-base mb-8 max-w-lg mx-auto lg:mx-0">
                            Browse our collection of high-quality tech projects designed to enhance your portfolio and showcase your skills to potential employers.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <Link href="/shop">
                                <Button className="px-6">
                                    Browse Projects
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>

                            <Link href="/custom">
                                <Button variant="outline" className="px-6">
                                    Request Custom Project
                                </Button>
                            </Link>
                        </div>

                        {/* Category chips */}
                        <div className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start">
                            {[
                                "AI Projects",
                                "Web Development",
                                "Mobile Apps",
                                "Electronics",
                                "Data Science"
                            ].map((category, index) => (
                                <Link
                                    key={index}
                                    href={`/shop?category=${encodeURIComponent(category)}`}
                                    className="text-xs px-3 py-1 rounded-full bg-background border border-border hover:border-primary transition-colors"
                                >
                                    {category}
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:pl-10"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />

                            <div className="relative overflow-hidden rounded-lg border border-border card-minimal">
                                <img
                                    src="/project.png"
                                    alt="Tech Project Showcase"
                                    className="w-full h-auto object-cover"
                                />

                                {/* Overlay elements */}
                                <div className="absolute top-3 left-3 bg-background/90 px-2 py-1 rounded-md text-xs font-medium border border-border shadow-sm z-20">
                                    Featured Project
                                </div>

                                <div className="absolute top-3 right-3 bg-background/90 px-2 py-1 rounded-md text-xs font-medium border border-border shadow-sm z-20">
                                    ₹1,299
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-20">
                                    <h3 className="text-sm font-medium mb-1">AI-Powered Image Recognition System</h3>
                                    <p className="text-xs text-muted-foreground">Complete with source code and documentation</p>
                                </div>
                            </div>

                            {/* Floating feature tags */}
                            <div className="absolute -right-3 top-1/4 bg-background px-3 py-1.5 rounded-md text-xs border border-border shadow-sm">
                                Source Code Included
                            </div>

                            <div className="absolute -left-3 bottom-1/4 bg-background px-3 py-1.5 rounded-md text-xs border border-border shadow-sm">
                                Lifetime Updates
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;