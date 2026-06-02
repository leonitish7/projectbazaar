"use client";
import React, { memo, useCallback, useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, ArrowRight, Check, Eye, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Project } from '@/data/projects';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  index?: number;
}

const ProjectCard = memo(({ project, featured = false, index = 0 }: ProjectCardProps) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = useCallback(() => {
    addToCart({
      id: project.id,
      title: project.title,
      price: project.price,
      category: project.category,
      image: project.image
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }, [addToCart, project]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <div className="h-full flex flex-col card-minimal overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden">
          <div className="img-hover">
            <img
              src={project.image}
              alt={project.title}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>

          {/* Price tag */}
          <div className="absolute top-3 right-3 bg-background/90 px-2.5 py-1 rounded-md text-sm font-medium shadow-sm">
            ₹{project.price.toFixed(0)}
          </div>

          {/* Featured badge */}
          {featured && (
            <div className="absolute top-3 left-3 bg-accent/90 text-white text-xs px-2 py-1 rounded-md">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-2 mb-2">
            <Badge variant="outline" className="text-xs bg-background">
              {project.category}
            </Badge>

            {project.rating && (
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-primary text-primary mr-1" />
                <span className="text-xs">{project.rating}</span>
              </div>
            )}
          </div>

          <h3 className="font-medium text-base mb-2 line-clamp-1">
            {project.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
            {project.description}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              <span>{project.downloads} downloads</span>
            </div>

            <span className="text-xs">
              {project.difficulty || "Beginner"}
            </span>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8 border-border hover:border-primary hover:text-primary hover:bg-transparent"
              asChild
            >
              <Link href={`/projectdetails/${project.id}`}>
                Details
              </Link>
            </Button>

            <Button
              size="sm"
              className={cn(
                "flex-1 text-xs h-8",
                isAdded ? "bg-accent hover:bg-accent/90" : "bg-primary hover:bg-primary/90"
              )}
              onClick={handleAddToCart}
              disabled={isAdded}
            >
              {isAdded ? (
                <span className="flex items-center">
                  <Check className="h-3.5 w-3.5 mr-1" /> Added
                </span>
              ) : (
                <span className="flex items-center">
                  <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add to cart
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;