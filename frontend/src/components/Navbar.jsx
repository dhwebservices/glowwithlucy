import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';

const LOGO_URL = "/assets/glow-with-lucy-logo.png";

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav" data-testid="navbar">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="nav-logo">
            <img 
              src={LOGO_URL} 
              alt="Glow With Lucy" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                data-testid={`nav-link-${link.name.toLowerCase()}`}
                className={`text-sm uppercase tracking-wider font-medium transition-colors link-underline ${
                  isActive(link.path)
                    ? 'text-[#2E2922]'
                    : 'text-[#6B6358] hover:text-[#2E2922]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center rounded-full border border-[#D8D2CA] bg-white/70 p-3 text-[#2E2922]"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2E2922] px-1 text-[10px] text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-[#D8D2CA]" data-testid="mobile-menu">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm uppercase tracking-wider font-medium py-2 ${
                    isActive(link.path)
                      ? 'text-[#2E2922]'
                      : 'text-[#6B6358]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium py-2 text-[#6B6358]"
              >
                Cart {itemCount ? `(${itemCount})` : ""}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
