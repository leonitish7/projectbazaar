"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Star, Shield, DownloadCloud, Clock, CheckCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { getProjectById, getProjectsByCategory, Project } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';

const ProjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart, cartItems } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    // Get project details - decode the URL parameter to handle special characters
    const decodedId = typeof id === 'string' ? decodeURIComponent(id) : '';
    const project = getProjectById(decodedId);

    // Check if the item is already in the cart
    useEffect(() => {
        if (project && cartItems) {
            const existingItem = cartItems.find((item: { id: string }) => item.id === project.id);
            if (existingItem) {
                setIsAdded(true);
            }
        }
    }, [cartItems, project]);

    if (!project) {
        return (
            <div className="container mx-auto px-6 py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    The project you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Button asChild>
                    <Link href="/shop">Browse Projects</Link>
                </Button>
            </div>
        );
    }

    // Get related projects
    const relatedProjects = getProjectsByCategory(project.category, project.subcategory)
        .filter(p => p.id !== project.id)
        .slice(0, 4);

    const handleAddToCart = () => {
        addToCart({
            id: project.id,
            title: project.title,
            price: project.price,
            category: project.category,
            subcategory: project.subcategory,
            image: project.image
        });
        setIsAdded(true);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <Link
                href="/shop"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
            >
                <span className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
                </span>
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                {/* Project Image */}
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-lg fade-in">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-auto object-cover rounded-md shadow-md"
                    />
                </div>

                {/* Project Details */}
                <div className="space-y-6 slide-in">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <div className="flex items-center space-x-2">
                                <Badge>{project.category}</Badge>
                                <Badge variant="outline">{project.subcategory}</Badge>
                                {project.featured && (
                                    <Badge variant="secondary">Featured</Badge>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold mt-2">{project.title}</h1>
                        </div>

                        <div className="text-3xl font-bold text-right">
                            Rs {project.price.toFixed(2)}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${i < Math.floor(project.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                            ))}
                            <span className="ml-2 text-muted-foreground">{project.rating.toFixed(1)}</span>
                        </div>

                        <Separator orientation="vertical" className="h-5" />

                        <div className="flex items-center text-muted-foreground">
                            <DownloadCloud className="h-5 w-5 mr-1" />
                            <span>{project.downloads} downloads</span>
                        </div>
                    </div>

                    <p className="text-lg">{project.description}</p>

                    <div>
                        <h3 className="text-lg font-medium mb-2">Key Features:</h3>
                        <ul className="space-y-1">
                            {project.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                    <CheckCircle className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            size="lg"
                            className={`flex-1 ${isAdded ? 'bg-accent hover:bg-accent' : ''}`}
                            onClick={handleAddToCart}
                            disabled={isAdded}
                        >
                            {isAdded ? (
                                <>
                                    <Check className="h-5 py-5 w-5 mr-2" /> Added to Cart
                                </>
                            ) : (
                                <>
                                        <ShoppingCart className="h-5 py-5 w-5 mr-2" /> Add to Cart
                                </>
                            )}
                        </Button>

                        {isAdded && (
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-1"
                                asChild
                            >
                                <Link href="/cart">
                                    <ShoppingCart className="h-5 py-5 w-5 mr-2" /> View Cart
                                </Link>
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        {[
                            {
                                icon: <Shield className="h-5 w-5 text-primary" />,
                                title: "Secure Purchase",
                                text: "100% secure checkout"
                            },
                            {
                                icon: <DownloadCloud className="h-5 w-5 text-primary" />,
                                title: "Instant Download",
                                text: "Get it immediately"
                            },
                            {
                                icon: <Clock className="h-5 w-5 text-primary" />,
                                title: "30-Day Support",
                                text: "Questions answered"
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg"
                            >
                                {item.icon}
                                <div>
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Tabs for Additional Information */}
            <div className="mb-16 fade-in">
                <Tabs defaultValue="details">
                    <TabsList className="grid grid-cols-3 mb-8">
                        <TabsTrigger value="details">Project Details</TabsTrigger>
                        <TabsTrigger value="requirements">Requirements</TabsTrigger>
                        <TabsTrigger value="delivery">Delivery & Support</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                        <h3 className="text-xl font-semibold">Project Details</h3>
                        <p>
                            This project includes a comprehensive implementation of {project.title} with all the
                            features listed. The code is well-documented and follows best practices for maintainability
                            and scalability.
                        </p>
                        <p>
                            Whether you&apos;re using this for educational purposes, as a starting point for your own
                            project, or implementing it directly in a production environment, you&apos;ll find the
                            structure and implementation to be clean and professional.
                        </p>
                    </TabsContent>

                    <TabsContent value="requirements" className="space-y-4">
                        <h3 className="text-xl font-semibold">System Requirements</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Modern web browser for web projects</li>
                            <li>Appropriate development environment for the specific technology</li>
                            <li>Required software dependencies (detailed in documentation)</li>
                            <li>Minimum hardware requirements based on project complexity</li>
                            <li>Internet connection for any API integrations</li>
                        </ul>
                    </TabsContent>

                    <TabsContent value="delivery" className="space-y-4">
                        <h3 className="text-xl font-semibold">Delivery Information</h3>
                        <p>
                            After completing your purchase, you&apos;ll receive immediate access to download the project
                            files. The delivery includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Complete source code</li>
                            <li>Documentation and setup guide</li>
                            <li>Any assets included in the project</li>
                            <li>30 days of support via email</li>
                            <li>One free update if a new version is released within 90 days</li>
                        </ul>
                    </TabsContent>
                </Tabs>
            </div>
            {/* Related Projects */}
            {relatedProjects.length > 0 && (
                <div className="fade-in">
                    <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;