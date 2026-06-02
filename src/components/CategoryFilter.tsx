
import React, { useState } from 'react';
import { categories } from '@/data/projects';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onSelectSubcategory: (subcategory: string | null) => void;
}

const CategoryFilter = ({
  selectedCategory,
  selectedSubcategory,
  onSelectCategory,
  onSelectSubcategory
}: CategoryFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      onSelectCategory(null);
      onSelectSubcategory(null);
    } else {
      onSelectCategory(category);
      onSelectSubcategory(null);
    }
  };

  const handleSubcategoryClick = (subcategory: string) => {
    if (selectedSubcategory === subcategory) {
      onSelectSubcategory(null);
    } else {
      onSelectSubcategory(subcategory);
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6 fade-in">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg sm:mb-6">Categories</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleExpand}
          className="md:hidden"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </div>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        <div>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${!selectedCategory ? 'bg-accent text-accent-foreground' : ''}`}
            onClick={() => {
              onSelectCategory(null);
              onSelectSubcategory(null);
            }}
          >
            All Categories
          </Button>
        </div>

        {categories.map((category) => (
          <div key={category.name} className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start font-medium ${selectedCategory === category.name ? 'bg-accent text-accent-foreground' : ''}`}
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.name}
            </Button>
            
            {selectedCategory === category.name && (
              <div className="pl-4 space-y-1 border-l-2 border-border ml-2">
                {category.subcategories.map((subcategory) => (
                  <Button
                    key={subcategory}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm ${selectedSubcategory === subcategory ? 'bg-secondary text-secondary-foreground' : ''}`}
                    onClick={() => handleSubcategoryClick(subcategory)}
                  >
                    {subcategory}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
