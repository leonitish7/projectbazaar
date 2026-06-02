"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ChevronDown, Zap, Settings, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectGrid from '@/components/ProjectGrid';
import { getFeaturedProjects, categories } from '@/data/projects';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import ParallaxSection from '@/components/ui/parallax-section';
import Card3D from '@/components/ui/card3d';

export default function Home() {
  const featuredProjects = getFeaturedProjects();

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section - using our new component */}
      <HeroSection />

      {/* Categories Section */}
      <section className="pb-16 bg-gradient-to-b from-background to-secondary/10">
        <div className="container mx-auto px-6">
          <ParallaxSection direction="up" speed={0.2}>
            <div className="text-center mb-12">
              <motion.span
                className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Explore Categories
              </motion.span>
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Browse by Category
              </motion.h2>
              <motion.p
                className="text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Explore our wide range of project categories to find exactly what you need for your next venture.
              </motion.p>
            </div>
          </ParallaxSection>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                variants={itemVariants}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card3D className="h-full">
                  <div className="bg-card border border-border rounded-lg p-6 h-full">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      {category.name}
                    </h3>
                    <ul className="space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory}>
                          <Link
                            href={`/shop?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`}
                            className="text-muted-foreground hover:text-primary transition-colors flex items-center group"
                          >
                            <span className="flex items-center">
                              <motion.span
                                className="inline-flex items-center"
                                initial={{ x: 0 }}
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <ArrowRight className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                                <span>{subcategory}</span>
                              </motion.span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <motion.div
                      className="mt-6"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="default"
                        className="w-full"
                        asChild
                      >
                        <Link href={`/shop?category=${encodeURIComponent(category.name)}`}>
                          View All {category.name} Projects
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ParallaxSection direction="up" speed={0.2}>
            <div className="flex justify-between items-center mb-12 flex-col md:flex-row">
              <div>
                <motion.span
                  className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Handpicked Selection
                </motion.span>
                <motion.h2
                  className="text-3xl md:text-4xl font-bold"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Featured Projects
                </motion.h2>
                <motion.p
                  className="text-muted-foreground mt-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Our hand-picked selection of quality projects
                </motion.p>
              </div>
              <motion.div
                className="mt-6 md:mt-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild className="px-6 py-2 h-auto">
                  <Link href="/shop" className="flex items-center space-x-2">
                    <span>View All Projects</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </ParallaxSection>

          <ProjectGrid projects={featuredProjects} featured={true} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/10">
        <div className="container mx-auto px-6">
          <ParallaxSection direction="up" speed={0.2}>
            <div className="text-center mb-12">
              <motion.span
                className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Simple Process
              </motion.span>
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                How It Works
              </motion.h2>
              <motion.p
                className="text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Get started with Project Bazaar in just a few simple steps
              </motion.p>
            </div>
          </ParallaxSection>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Browse & Select",
                description: "Explore our extensive collection and find the perfect project for your needs.",
                icon: <Zap className="h-8 w-8 text-primary" />,
                delay: 0
              },
              {
                title: "Customize If Needed",
                description: "Request specific customizations to tailor the project to your requirements.",
                icon: <Settings className="h-8 w-8 text-primary" />,
                delay: 0.2
              },
              {
                title: "Purchase & Download",
                description: "Complete your purchase and get instant access to download your projects.",
                icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                delay: 0.4
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.5, delay: step.delay }}
              >
                <Card3D className="h-full">
                  <div className="h-full bg-card border border-border rounded-lg p-8 text-center">
                    <motion.div
                      className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-5"
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, 5, -5, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ParallaxSection direction="up" speed={0.2}>
            <div className="text-center mb-12">
              <motion.span
                className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Customer Feedback
              </motion.span>
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                What Our Customers Say
              </motion.h2>
              <motion.p
                className="text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Hear from students and professionals who have used our projects
              </motion.p>
            </div>
          </ParallaxSection>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Satyam Kharwar",
                role: "Computer Science Student",
                quote: "The web development project I purchased saved me countless hours of work. The code was well-documented and easy to understand.",
                rating: 5,
                delay: 0
              },
              {
                name: "Nikhil Kumar",
                role: "Project Manager",
                quote: "I used the management dashboard for my team's project tracking. The customization option allowed me to tailor it perfectly to our needs.",
                rating: 4,
                delay: 0.2
              },
              {
                name: "Priya Sharma",
                role: "Engineering Professional",
                quote: "The engineering calculation tool was exactly what I needed for my work. The support team was also very helpful with my questions.",
                rating: 5,
                delay: 0.4
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.5, delay: testimonial.delay }}
              >
                <Card3D className="h-full">
                  <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic flex-grow">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center mt-auto">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ParallaxSection direction="up" speed={0.1}>
            <motion.div
              className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 glass-effect dark:bg-background"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="text-center max-w-3xl mx-auto">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Ready to Get Started?
                </motion.h2>
                <motion.p
                  className="text-muted-foreground text-lg mb-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Browse our collection of projects and find the perfect one for your needs today.
                </motion.p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="px-8 py-6 h-auto text-lg font-medium glow-effect" asChild>
                    <Link href="/shop">
                      <span className="flex items-center">
                        Explore Projects <ArrowRight className="ml-2 h-5 w-5" />
                      </span>
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </ParallaxSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16" id="faq">
        <div className="container mx-auto px-6">
          <ParallaxSection direction="up" speed={0.2}>
            <div className="text-center mb-12">
              <motion.span
                className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Got Questions?
              </motion.span>
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p
                className="text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Find answers to common questions about our projects and services
              </motion.p>
            </div>
          </ParallaxSection>

          <motion.div
            className="max-w-3xl mx-auto space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                question: "Are the projects ready to use?",
                answer: "Yes, all our projects are fully functional and ready to use. Some may require minor setup or configuration based on your specific environment."
              },
              {
                question: "Can I request customizations?",
                answer: "Absolutely! During checkout, you can provide detailed customization requests in the provided text area for each item in your cart."
              },
              {
                question: "How do I download my purchased projects?",
                answer: "After successful payment, you'll receive immediate access to download your purchased projects from your account dashboard."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer refunds within 7 days of purchase if the project doesn't match the description or has significant technical issues that cannot be resolved."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card3D
                  className="bg-card border border-border rounded-lg overflow-hidden glass-effect dark:bg-background"
                  intensity={10}
                >
                  <details className="group">
                    <summary className="flex justify-between items-center p-6 cursor-pointer">
                      <h3 className="font-medium text-lg">{faq.question}</h3>
                      <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <motion.div
                      className="px-6 pb-6 text-muted-foreground"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  </details>
                </Card3D>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
