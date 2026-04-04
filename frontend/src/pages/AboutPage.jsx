import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Leaf, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

const ABOUT_IMAGE = "/assets/site/about.jpg";
const CANDLE_IMAGE = "/assets/site/candle-medium.jpg";

export const AboutPage = () => {
  return (
    <div className="pt-20" data-testid="about-page">
      {/* Hero Section */}
      <section className="py-24 lg:py-32 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#6B6358]">
                Our Story
              </span>
              <h1 className="mt-4 text-5xl sm:text-6xl font-light tracking-tight font-serif text-[#2E2922]">
                Glow With Lucy
              </h1>
              <p className="mt-8 text-lg lg:text-xl font-light leading-relaxed text-[#6B6358]">
                What started as a passion project in my kitchen has blossomed into a small business dedicated to creating beautiful, handcrafted candles that bring warmth and ambiance to every space.
              </p>
              <p className="mt-6 text-base lg:text-lg font-light leading-relaxed text-[#6B6358]">
                Every candle I create is made with love, care, and attention to detail. I believe that the right candle can transform a room, create a mood, and make any moment feel special.
              </p>
            </div>
            <div className="relative">
              <img
                src={ABOUT_IMAGE}
                alt="Candle making process"
                className="w-full h-auto rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-32 bg-[#EAE5DE]" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#6B6358]">
              What We Believe
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight font-serif text-[#2E2922]">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="bg-[#F9F8F6] p-10 rounded-sm text-center">
              <div className="w-16 h-16 rounded-full bg-[#C4B9A7] flex items-center justify-center mx-auto">
                <Heart className="h-7 w-7 text-[#2E2922]" />
              </div>
              <h3 className="mt-6 text-xl font-serif text-[#2E2922]">Made with Love</h3>
              <p className="mt-4 text-[#6B6358] font-light leading-relaxed">
                Every candle is hand-poured with care and attention. I treat each creation as if it were going to my own home.
              </p>
            </div>
            <div className="bg-[#F9F8F6] p-10 rounded-sm text-center">
              <div className="w-16 h-16 rounded-full bg-[#C4B9A7] flex items-center justify-center mx-auto">
                <Leaf className="h-7 w-7 text-[#2E2922]" />
              </div>
              <h3 className="mt-6 text-xl font-serif text-[#2E2922]">Natural Quality</h3>
              <p className="mt-4 text-[#6B6358] font-light leading-relaxed">
                I use premium soy wax and carefully selected fragrance oils to ensure a clean, long-lasting burn.
              </p>
            </div>
            <div className="bg-[#F9F8F6] p-10 rounded-sm text-center">
              <div className="w-16 h-16 rounded-full bg-[#C4B9A7] flex items-center justify-center mx-auto">
                <Sparkles className="h-7 w-7 text-[#2E2922]" />
              </div>
              <h3 className="mt-6 text-xl font-serif text-[#2E2922]">Bespoke Experience</h3>
              <p className="mt-4 text-[#6B6358] font-light leading-relaxed">
                Your candle, your way. Choose your scent and let me create something uniquely yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 lg:py-32 bg-[#F9F8F6]" data-testid="process-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={CANDLE_IMAGE}
                alt="Finished candle"
                className="w-full h-auto rounded-sm"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#6B6358]">
                The Process
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight font-serif text-[#2E2922]">
                How Each Candle is Made
              </h2>
              <div className="mt-8 space-y-6">
                <div className="border-l-2 border-[#C4B9A7] pl-6">
                  <h3 className="text-lg font-serif text-[#2E2922]">Preparation</h3>
                  <p className="mt-2 text-[#6B6358] font-light">
                    I start by measuring and melting premium soy wax to the perfect temperature.
                  </p>
                </div>
                <div className="border-l-2 border-[#C4B9A7] pl-6">
                  <h3 className="text-lg font-serif text-[#2E2922]">Scent Blending</h3>
                  <p className="mt-2 text-[#6B6358] font-light">
                    Carefully selected fragrance oils are added at the optimal temperature for the best scent throw.
                  </p>
                </div>
                <div className="border-l-2 border-[#C4B9A7] pl-6">
                  <h3 className="text-lg font-serif text-[#2E2922]">Hand Pouring</h3>
                  <p className="mt-2 text-[#6B6358] font-light">
                    Each candle is hand-poured into its vessel with a pre-centered wick.
                  </p>
                </div>
                <div className="border-l-2 border-[#C4B9A7] pl-6">
                  <h3 className="text-lg font-serif text-[#2E2922]">Curing</h3>
                  <p className="mt-2 text-[#6B6358] font-light">
                    Candles cure for several days to ensure optimal scent and burn quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-[#C4B9A7]" data-testid="about-cta-section">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight font-serif text-[#2E2922]">
            Let's Create Something Beautiful
          </h2>
          <p className="mt-6 text-lg font-light text-[#3A342C] max-w-2xl mx-auto">
            I'd love to hear from you. Whether you have questions about my candles or want to place an order, don't hesitate to get in touch.
          </p>
          <div className="mt-10">
            <Link to="/contact">
              <Button 
                className="bg-[#2E2922] text-[#F9F8F6] px-8 py-6 text-sm uppercase tracking-[0.15em] font-medium rounded-none hover:bg-[#3A342C] transition-colors"
                data-testid="about-contact-btn"
              >
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
