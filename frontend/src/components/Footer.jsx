import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#EAE5DE] py-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-[#2E2922] mb-4">Glow With Lucy</h3>
            <p className="text-[#6B6358] font-light leading-relaxed">
              Handcrafted candles made with love, bringing warmth and ambiance to your space.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] font-medium text-[#2E2922] mb-6">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-[#6B6358] hover:text-[#2E2922] transition-colors"
                data-testid="footer-link-home"
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="text-[#6B6358] hover:text-[#2E2922] transition-colors"
                data-testid="footer-link-shop"
              >
                Shop
              </Link>
              <Link 
                to="/about" 
                className="text-[#6B6358] hover:text-[#2E2922] transition-colors"
                data-testid="footer-link-about"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-[#6B6358] hover:text-[#2E2922] transition-colors"
                data-testid="footer-link-contact"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] font-medium text-[#2E2922] mb-6">
              Get in Touch
            </h4>
            <div className="flex flex-col space-y-3">
              <a 
                href="mailto:Lucyd789@sky.com" 
                className="flex items-center text-[#6B6358] hover:text-[#2E2922] transition-colors"
                data-testid="footer-email"
              >
                <Mail className="h-4 w-4 mr-3" />
                Lucyd789@sky.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#D8D2CA]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#6B6358] text-sm" data-testid="footer-copyright">
              © {new Date().getFullYear()} Glow With Lucy. All rights reserved.
            </p>
            <p className="text-[#6B6358] text-sm mt-4 md:mt-0" data-testid="footer-built-by">
              Built by DH Website Services
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
