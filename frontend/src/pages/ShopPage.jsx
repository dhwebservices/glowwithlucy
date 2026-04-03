import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';

const CANDLE_IMAGES = {
  small: "https://images.unsplash.com/photo-1602525265024-bef0eb021a59?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwyfHxoYW5kbWFkZSUyMGJlaWdlJTIwY2FuZGxlfGVufDB8fHx8MTc3NTE3OTAzMXww&ixlib=rb-4.1.0&q=85",
  medium: "https://images.unsplash.com/photo-1658915304996-7784292b22e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGJlaWdlJTIwY2FuZGxlfGVufDB8fHx8MTc3NTE3OTAzMXww&ixlib=rb-4.1.0&q=85",
  large: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwzfHxoYW5kbWFkZSUyMGJlaWdlJTIwY2FuZGxlfGVufDB8fHx8MTc3NTE3OTAzMXww&ixlib=rb-4.1.0&q=85"
};

const candles = [
  {
    id: 1,
    size: '7 oz',
    title: 'Petite Glow',
    description: 'Perfect for bedside tables, bathrooms, or small spaces. A subtle but impactful presence.',
    burnTime: '~35 hours',
    image: CANDLE_IMAGES.small,
    testId: 'shop-candle-7oz'
  },
  {
    id: 2,
    size: '9 oz',
    title: 'Classic Glow',
    description: 'Our most popular size. Ideal for living rooms, offices, and dining areas.',
    burnTime: '~45 hours',
    image: CANDLE_IMAGES.medium,
    testId: 'shop-candle-9oz'
  },
  {
    id: 3,
    size: '12 oz',
    title: 'Grand Glow',
    description: 'Maximum luxury and burn time. Perfect for large spaces or extended evenings.',
    burnTime: '~60 hours',
    image: CANDLE_IMAGES.large,
    testId: 'shop-candle-12oz'
  }
];

export const ShopPage = () => {
  return (
    <div className="pt-20" data-testid="shop-page">
      {/* Hero Section */}
      <section className="py-24 lg:py-32 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#6B6358]">
              Our Collection
            </span>
            <h1 className="mt-4 text-5xl sm:text-6xl font-light tracking-tight font-serif text-[#2E2922]">
              Choose Your Size
            </h1>
            <p className="mt-6 text-lg lg:text-xl font-light leading-relaxed text-[#6B6358]">
              Each candle is handcrafted to order. Select your preferred size and contact us with your scent preferences to create your perfect candle.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 lg:py-24 bg-[#EAE5DE]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {candles.map((candle) => (
              <div 
                key={candle.id} 
                className="candle-card bg-[#F9F8F6] rounded-sm overflow-hidden"
                data-testid={candle.testId}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={candle.image}
                    alt={`${candle.size} Candle`}
                    className="img-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#C4B9A7]">
                      {candle.size}
                    </span>
                    <span className="text-sm text-[#6B6358]">{candle.burnTime}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-[#2E2922]">{candle.title}</h3>
                  <p className="mt-4 text-[#6B6358] font-light leading-relaxed">
                    {candle.description}
                  </p>
                  <Link to="/contact" className="block mt-6">
                    <Button 
                      className="w-full btn-primary py-4 text-sm uppercase tracking-[0.15em] font-medium rounded-none"
                      data-testid={`order-${candle.size.replace(' ', '-').toLowerCase()}-btn`}
                    >
                      Enquire Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="py-24 lg:py-32 bg-[#F9F8F6]" data-testid="how-to-order-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#6B6358]">
              Simple Process
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight font-serif text-[#2E2922]">
              How to Order
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#C4B9A7] flex items-center justify-center mx-auto">
                <span className="text-2xl font-serif text-[#2E2922]">1</span>
              </div>
              <h3 className="mt-6 text-xl font-serif text-[#2E2922]">Choose Your Size</h3>
              <p className="mt-3 text-[#6B6358] font-light">
                Select from our 7oz, 9oz, or 12oz candles based on your needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#C4B9A7] flex items-center justify-center mx-auto">
                <span className="text-2xl font-serif text-[#2E2922]">2</span>
              </div>
              <h3 className="mt-6 text-xl font-serif text-[#2E2922]">Request Your Scent</h3>
              <p className="mt-3 text-[#6B6358] font-light">
                Let us know your preferred fragrance or describe the mood you want to create.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#C4B9A7] flex items-center justify-center mx-auto">
                <span className="text-2xl font-serif text-[#2E2922]">3</span>
              </div>
              <h3 className="mt-6 text-xl font-serif text-[#2E2922]">We Craft & Deliver</h3>
              <p className="mt-3 text-[#6B6358] font-light">
                We'll handcraft your candle and arrange delivery to your door.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link to="/contact">
              <Button 
                className="btn-primary px-8 py-6 text-sm uppercase tracking-[0.15em] font-medium rounded-none"
                data-testid="start-order-btn"
              >
                Start Your Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="py-16 bg-[#C4B9A7]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-[#2E2922]" />
          </div>
          <h3 className="text-2xl font-serif text-[#2E2922]">Questions about our candles?</h3>
          <p className="mt-4 text-[#3A342C] font-light">
            Reach out to us at{' '}
            <a 
              href="mailto:Lucyd789@sky.com" 
              className="underline hover:no-underline"
              data-testid="shop-email-link"
            >
              Lucyd789@sky.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};
