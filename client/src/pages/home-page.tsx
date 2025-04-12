import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CarrierShowcase from '@/components/home/CarrierShowcase';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import OrderForm from '@/components/order/OrderForm';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <OrderForm />
      <CarrierShowcase />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
