"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, Sun, Moon, User, LogOut, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'py-3' : 'py-4'}`}
      style={{
        backgroundColor: 'rgba(var(--background), 0.97)',
        backdropFilter: 'blur(5px)',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      }}
    >
      <div className="content-container flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 w-8 rounded-full border border-border"
            style={{ filter: scrolled ? 'brightness(0.8)' : 'none' }}
          />
          <span className="text-base font-medium">Project Bazaar</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/shop" className="text-sm hover:text-primary transition-colors">
            Projects
          </Link>
          <Link href="/custom" className="text-sm hover:text-primary transition-colors">
            Custom
          </Link>
          <Link href="/orders" className="text-sm hover:text-primary transition-colors">
            Orders
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Search - Desktop */}
          <div className="relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-[180px] h-8 rounded-full border border-border bg-background px-8 py-0 text-sm
                focus:outline-none focus:border-primary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </form>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          {/* Cart */}
          <Link href="/cart">
            <div className="p-2 rounded-full hover:bg-muted transition-colors relative">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-xs h-4 w-4 rounded-full flex items-center justify-center text-white font-medium">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-muted transition-colors">
                  <User className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-1">
                <DropdownMenuLabel className="font-normal text-xs">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.isAdmin ? (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="cursor-pointer text-sm">Dashboard</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer text-sm">Profile</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer text-sm">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer text-sm">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center">
              <Link href="/login">
                <button className="text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors">
                  Log in
                </button>
              </Link>
              <Link href="/signup" className="hidden sm:block">
                <button className="text-sm px-3 py-1.5 ml-1 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                  Sign up
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="p-2 rounded-full md:hidden hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-background z-50 md:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-border">
                <span className="text-base font-medium">Menu</span>
                <button
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4">
                <form onSubmit={handleSearchSubmit} className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full h-9 rounded-md border border-border bg-background px-9 py-2 text-sm
                    focus:outline-none focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </form>

                <nav className="flex flex-col space-y-1">
                  {[
                    { name: "Home", path: "/" },
                    { name: "Projects", path: "/shop" },
                    { name: "Custom", path: "/custom" },
                    { name: "Orders", path: "/orders" }
                  ].map((link, i) => (
                    <Link
                      key={i}
                      href={link.path}
                      className="py-2.5 px-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {!isAuthenticated && (
                  <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button className="w-full text-sm px-3 py-2 border border-border rounded-md hover:border-primary hover:text-primary transition-colors">
                        Log in
                      </button>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button className="w-full text-sm px-3 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
                        Sign up
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-auto p-4 border-t border-border flex justify-between items-center">
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMenuOpen(false);
                  }}
                  className="text-sm flex items-center gap-2"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
