import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CONTACT_IMAGE = "https://images.pexels.com/photos/11431800/pexels-photo-11431800.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    candleSize: '',
    scentPreference: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, candleSize: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await axios.post(`${API}/contact`, formData);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        candleSize: '',
        scentPreference: '',
        message: ''
      });
    } catch (err) {
      setError('Something went wrong. Please try emailing us directly at lucyd789@sky.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20" data-testid="contact-page">
      {/* Hero Section */}
      <section className="py-24 lg:py-32 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form Section */}
            <div>
              <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#6B6358]">
                Get in Touch
              </span>
              <h1 className="mt-4 text-5xl sm:text-6xl font-light tracking-tight font-serif text-[#2E2922]">
                Contact Us
              </h1>
              <p className="mt-6 text-lg font-light leading-relaxed text-[#6B6358]">
                Ready to order? Fill out the form below with your size preference and scent ideas. I'll get back to you as soon as possible.
              </p>

              {/* Contact Info */}
              <div className="mt-8 p-6 bg-[#EAE5DE] rounded-sm">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-[#6B6358]" />
                  <a 
                    href="mailto:lucyd789@sky.com" 
                    className="ml-3 text-[#2E2922] hover:underline"
                    data-testid="contact-email-link"
                  >
                    lucyd789@sky.com
                  </a>
                </div>
              </div>

              {/* Form */}
              {isSubmitted ? (
                <div className="mt-10 p-8 bg-[#EAE5DE] rounded-sm text-center" data-testid="success-message">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <h3 className="mt-4 text-xl font-serif text-[#2E2922]">Message Sent!</h3>
                  <p className="mt-2 text-[#6B6358] font-light">
                    Thank you for your enquiry. I'll get back to you soon.
                  </p>
                  <Button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 btn-primary px-6 py-4 text-sm uppercase tracking-[0.15em] font-medium rounded-none"
                    data-testid="send-another-btn"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-10 space-y-6" data-testid="contact-form">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-600" data-testid="error-message">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm uppercase tracking-[0.1em] font-medium text-[#2E2922]">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-2 rounded-none border-[#D8D2CA] focus:border-[#C4B9A7] focus:ring-[#C4B9A7]"
                        placeholder="Your name"
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm uppercase tracking-[0.1em] font-medium text-[#2E2922]">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-2 rounded-none border-[#D8D2CA] focus:border-[#C4B9A7] focus:ring-[#C4B9A7]"
                        placeholder="your@email.com"
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="candleSize" className="text-sm uppercase tracking-[0.1em] font-medium text-[#2E2922]">
                      Preferred Candle Size
                    </Label>
                    <Select onValueChange={handleSelectChange} value={formData.candleSize}>
                      <SelectTrigger className="mt-2 rounded-none border-[#D8D2CA]" data-testid="select-size">
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7oz" data-testid="size-7oz">7 oz - Petite Glow</SelectItem>
                        <SelectItem value="9oz" data-testid="size-9oz">9 oz - Classic Glow</SelectItem>
                        <SelectItem value="12oz" data-testid="size-12oz">12 oz - Grand Glow</SelectItem>
                        <SelectItem value="not-sure" data-testid="size-not-sure">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="scentPreference" className="text-sm uppercase tracking-[0.1em] font-medium text-[#2E2922]">
                      Scent Preferences
                    </Label>
                    <Textarea
                      id="scentPreference"
                      name="scentPreference"
                      value={formData.scentPreference}
                      onChange={handleChange}
                      className="mt-2 rounded-none border-[#D8D2CA] focus:border-[#C4B9A7] focus:ring-[#C4B9A7] min-h-[100px]"
                      placeholder="Tell me about scents you love - floral, woody, fresh, sweet, etc. Or describe the mood you want to create."
                      data-testid="input-scent"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm uppercase tracking-[0.1em] font-medium text-[#2E2922]">
                      Additional Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-2 rounded-none border-[#D8D2CA] focus:border-[#C4B9A7] focus:ring-[#C4B9A7] min-h-[120px]"
                      placeholder="Any other details or questions?"
                      data-testid="input-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-6 text-sm uppercase tracking-[0.15em] font-medium rounded-none"
                    data-testid="submit-btn"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>

            {/* Image Section */}
            <div className="hidden lg:block">
              <img
                src={CONTACT_IMAGE}
                alt="Artistic candle"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-32 bg-[#EAE5DE]" data-testid="faq-section">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#6B6358]">
              Common Questions
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-light tracking-tight font-serif text-[#2E2922]">
              Frequently Asked
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-[#F9F8F6] p-8 rounded-sm">
              <h3 className="text-lg font-serif text-[#2E2922]">How long does it take to receive my candle?</h3>
              <p className="mt-3 text-[#6B6358] font-light">
                Each candle is made to order and requires curing time. Typically, expect 1-2 weeks for creation and delivery.
              </p>
            </div>
            <div className="bg-[#F9F8F6] p-8 rounded-sm">
              <h3 className="text-lg font-serif text-[#2E2922]">Can I request a custom scent?</h3>
              <p className="mt-3 text-[#6B6358] font-light">
                Absolutely! That's what makes Glow With Lucy special. Tell me what scents you love or the atmosphere you want to create.
              </p>
            </div>
            <div className="bg-[#F9F8F6] p-8 rounded-sm">
              <h3 className="text-lg font-serif text-[#2E2922]">What are your candles made from?</h3>
              <p className="mt-3 text-[#6B6358] font-light">
                I use premium soy wax and high-quality fragrance oils for a clean, long-lasting burn.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
