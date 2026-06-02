import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { Project } from '@/data/projects';

interface ProjectGridProps {
  projects: Project[];
  featured?: boolean;
  isLoading?: boolean;
}

const ProjectGrid = ({ projects, featured = false, isLoading = false }: ProjectGridProps) => {
  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            className="border border-border rounded-lg p-4 h-64 bg-muted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              ease: "easeOut"
            }}
            style={{
              backgroundSize: "200% 200%",
              animation: "pulse 1.5s ease-in-out infinite alternate"
            }}
          />
        ))}
      </motion.div>
    );
  }

  if (projects.length === 0) {
    return (
      <motion.div
        className="text-center py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-muted-foreground">No projects found.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          featured={featured && project.featured}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default ProjectGrid;
