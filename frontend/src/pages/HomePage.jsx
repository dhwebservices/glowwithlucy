import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

const HERO_IMAGE = "https://images.unsplash.com/photo-1651841689044-00521ab0fa66?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVpZ2UlMjBjYW5kbGV8ZW58MHx8fHwxNzc1MTc5MDIxfDA&ixlib=rb-4.1.0&q=85";

const CANDLE_IMAGES = {
  small: "https://images.unsplash.com/photo-1602525265024-bef0eb021a59?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwyfHxoYW5kbWFkZSUyMGJlaWdlJTIwY2FuZGxlfGVufDB8fHx8MTc3NTE3OTAzMXww&ixlib=rb-4.1.0&q=85",
  medium: "https://images.unsplash.com/photo-1658915304996-7784292b22e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGJlaWdlJTIwY2FuZGxlfGVufDB8fHx8MTc3NTE3OTAzMXww&ixlib=rb-4.1.0&q=85",
  large: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwzfHxoYW5kbWFkZSUyMGJlaWdlJTIwY2FuZGxlfGVufDB8fHx8MTc3NTE3OTAzMXww&ixlib=rb-4.1.0&q=85"
};

export const HomePage = () => {
  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Handmade candles"
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#6B6358] animate-fade-in">
              Handcrafted with Love
            </span>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight font-serif text-[#2E2922] animate-fade-in-up">
              Illuminate Your<br />
              <span className="italic">Moments</span>
            </h1>
            <p className="mt-8 text-lg lg:text-xl font-light leading-relaxed text-[#6B6358] max-w-lg animate-fade-in-up animation-delay-200">
              Bespoke, handmade candles crafted to bring warmth, comfort, and a touch of elegance to every space.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
              <Link to="/shop">
                <Button 
                  className="btn-primary px-8 py-6 text-sm uppercase tracking-[0.15em] font-medium rounded-none"
                  data-testid="hero-shop-btn"
                >
                  View Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  className="btn-outline px-8 py-6 text-sm uppercase tracking-[0.15em] font-medium rounded-none"
                  data-testid="hero-contact-btn"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sizes Section */}
      <section className="py-24 lg:py-32 bg-[#F9F8F6]" data-testid="featured-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#6B6358]">
              Our Collection
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight font-serif text-[#2E2922]">
              Find Your Perfect Size
            </h2>
            <p className="mt-6 text-base lg:text-lg font-light text-[#6B6358] max-w-2xl mx-auto">
              Each candle is handcrafted with care. Choose your size and let us know your preferred scent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 7oz Candle */}
            <div className="candle-card bg-white rounded-sm overflow-hidden" data-testid="candle-7oz">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={CANDLE_IMAGES.small}
                  alt="7oz Candle"
                  className="img-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-serif text-[#2E2922]">7 oz</h3>
                <p className="mt-2 text-[#6B6358] font-light">Perfect for small spaces</p>
                <p className="mt-1 text-sm text-[#6B6358]">~35 hours burn time</p>
              </div>
            </div>

            {/* 9oz Candle */}
            <div className="candle-card bg-white rounded-sm overflow-hidden" data-testid="candle-9oz">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={CANDLE_IMAGES.medium}
                  alt="9oz Candle"
                  className="img-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-serif text-[#2E2922]">9 oz</h3>
                <p className="mt-2 text-[#6B6358] font-light">Our most popular size</p>
                <p className="mt-1 text-sm text-[#6B6358]">~45 hours burn time</p>
              </div>
            </div>

            {/* 12oz Candle */}
            <div className="candle-card bg-white rounded-sm overflow-hidden" data-testid="candle-12oz">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={CANDLE_IMAGES.large}
                  alt="12oz Candle"
                  className="img-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-serif text-[#2E2922]">12 oz</h3>
                <p className="mt-2 text-[#6B6358] font-light">Maximum luxury</p>
                <p className="mt-1 text-sm text-[#6B6358]">~60 hours burn time</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/shop">
              <Button 
                className="btn-primary px-8 py-6 text-sm uppercase tracking-[0.15em] font-medium rounded-none"
                data-testid="view-all-btn"
              >
                View All Sizes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 lg:py-32 bg-[#EAE5DE]" data-testid="why-us-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#6B6358]">
                Our Promise
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight font-serif text-[#2E2922]">
                Crafted with Intention
              </h2>
              <div className="mt-8 space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[#C4B9A7] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2E2922] font-serif">01</span>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-serif text-[#2E2922]">Handmade</h3>
                    <p className="mt-2 text-[#6B6358] font-light">Each candle is carefully hand-poured with attention to detail.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[#C4B9A7] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2E2922] font-serif">02</span>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-serif text-[#2E2922]">Natural Ingredients</h3>
                    <p className="mt-2 text-[#6B6358] font-light">Made with premium soy wax and carefully selected fragrance oils.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-[#C4B9A7] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#2E2922] font-serif">03</span>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-serif text-[#2E2922]">Bespoke Scents</h3>
                    <p className="mt-2 text-[#6B6358] font-light">Choose your preferred scent for a truly personalized experience.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={CANDLE_IMAGES.medium}
                alt="Handcrafted candle process"
                className="w-full h-auto rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-[#C4B9A7]" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight font-serif text-[#2E2922]">
            Ready to Order?
          </h2>
          <p className="mt-6 text-lg font-light text-[#3A342C] max-w-2xl mx-auto">
            Get in touch to place your order. Simply let us know your preferred size and scent, and we'll create the perfect candle for you.
          </p>
          <div className="mt-10">
            <Link to="/contact">
              <Button 
                className="bg-[#2E2922] text-[#F9F8F6] px-8 py-6 text-sm uppercase tracking-[0.15em] font-medium rounded-none hover:bg-[#3A342C] transition-colors"
                data-testid="cta-contact-btn"
              >
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
