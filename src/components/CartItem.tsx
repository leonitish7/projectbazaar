"use client";
import React from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProjectItem, useCart } from '@/contexts/CartContext';

interface CartItemProps {
  item: ProjectItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, updateCustomization, removeFromCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateQuantity(item.id, value);
    }
  };

  const handleCustomizationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCustomization(item.id, e.target.value);
  };

  return (
    <div className="border border-border rounded-lg p-4 mb-4 bg-card fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex justify-between">
            <Link
              href={`/project/${item.id}`}
              className="font-semibold hover:text-primary transition-colors"
              >
              {item.title}
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:text-destructive/80"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 size={18} />
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Category: {item.category} / {item.subcategory}
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label htmlFor={`quantity-${item.id}`} className="text-sm">Quantity:</label>
              <Input
                id={`quantity-${item.id}`}
                type="number"
                min="1"
                value={item.quantity}
                onChange={handleQuantityChange}
                className="w-20"
              />
            </div>
            
            <div className="text-lg ml-auto">
              Rs {(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
          
          <div>
            <label htmlFor={`customization-${item.id}`} className="text-sm block mb-1">
              Customization requests:
            </label>
            <Textarea
              id={`customization-${item.id}`}
              placeholder="Enter any customization requests here..."
              value={item.customization}
              onChange={handleCustomizationChange}
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
