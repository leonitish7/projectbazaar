
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProjectGrid from '@/components/ProjectGrid';
import CategoryFilter from '@/components/CategoryFilter';
import { projects as allProjects, Project } from '@/data/projects';

const Shop = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    searchParams.get('subcategory')
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.set('category', selectedCategory);
    }

    if (selectedSubcategory) {
      params.set('subcategory', selectedSubcategory);
    }

    router.push(`?${params.toString()}`);
  }, [selectedCategory, selectedSubcategory, router]);

  // Filter and sort projects
  useEffect(() => {
    let filtered = [...allProjects];

    // Filter by category and subcategory
    if (selectedCategory) {
      filtered = filtered.filter(project => project.category === selectedCategory);

      if (selectedSubcategory) {
        filtered = filtered.filter(project => project.subcategory === selectedSubcategory);
      }
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.title.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.category.toLowerCase().includes(term) ||
          project.subcategory.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProjects(filtered);
  }, [selectedCategory, selectedSubcategory, searchTerm, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via the useEffect
  };

  return (
    <div className="container mx-auto px-6 py-8">

      <h1 className="text-3xl font-bold mb-8">Browse Projects</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with filters */}
        <div className="w-full md:w-1/4 space-y-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectCategory={setSelectedCategory}
            onSelectSubcategory={setSelectedSubcategory}
          />
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          <div className="mb-6 space-y-4">
            {/* Search and sort controls */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <div className="flex flex-wrap justify-between items-center">
              <p className="text-muted-foreground">
                Showing {filteredProjects.length} projects
              </p>

              <div className="flex items-center space-x-2">
                <span className="text-sm">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="downloads">Popularity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Project grid */}
          <ProjectGrid projects={filteredProjects} />

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search term
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;