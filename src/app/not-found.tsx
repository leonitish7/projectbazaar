"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.info(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 fade-in">
      <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
        404
      </h1>
      <p className="text-xl md:text-2xl font-medium text-muted-foreground mb-8 text-center">
        Oops! We couldn&apos;t find the page you&apos;re looking for.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" asChild>
          <Link href="/">
            <span className="flex items-center">
              <Home className="h-5 w-5 mr-2" /> Go to Homepage
            </span>
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/shop">
            <span className="flex items-center">
              <Search className="h-5 w-5 mr-2" /> Browse Projects
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;