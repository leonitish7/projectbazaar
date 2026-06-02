import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-16">
      {/* Main Footer Content */}
      <div className="content-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Project Bazaar</p>
            <p className="text-sm text-muted-foreground">
              Your marketplace for high-quality tech projects and academic resources.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Categories</p>
            <div className="grid grid-cols-2 gap-1">
              {[
                "Computer Science",
                "Web Development",
                "Data Science",
                "Mobile Apps",
                "Engineering",
                "Business"
              ].map((item, i) => (
                <Link
                  key={i}
                  href={`/shop?category=${encodeURIComponent(item)}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Links</p>
            <div className="grid grid-cols-2 gap-1">
              {[
                { label: "Contact", href: "/contact" },
                { label: "About", href: "/about" },
                { label: "FAQs", href: "/faq" },
                { label: "Terms", href: "/terms" },
                { label: "Privacy", href: "/privacy" },
                { label: "Refunds", href: "/refunds" }
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Stay updated</p>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for project alerts.
            </p>
            <form className="flex gap-1 mt-2">
              <input
                type="email"
                placeholder="Your email"
                required
                className="flex-grow h-8 rounded-md border border-border bg-background px-3 text-sm
                focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-sm"
              >
                Subscribe
              </button>
            </form>

            <div className="flex items-center gap-2 pt-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href="mailto:nt10nitish@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                nt10nitish@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-border py-6">
        <div className="content-container flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground order-2 sm:order-1">
            © {currentYear} Project Bazaar. All rights reserved.
          </p>

          <div className="flex gap-4 order-1 sm:order-2">
            {["Terms", "Privacy", "Cookies"].map((item, i) => (
              <Link
                key={i}
                href={`/${item.toLowerCase()}`}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
