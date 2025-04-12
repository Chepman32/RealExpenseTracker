import React from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-primary text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-[#00FF99]">Move big.</span> Move smart.
            </motion.h1>
            <motion.p 
              className="text-xl mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Link href="/order">
                <a className="bg-[#00FF99] hover:bg-[#00CC7A] text-primary text-lg font-semibold px-8 py-4 rounded-md transition-colors text-center hover:shadow-lg transform hover:-translate-y-1">
                  {t('hero.createOrder')}
                </a>
              </Link>
              <Link href="/carriers/register">
                <a className="border border-white hover:bg-white hover:text-primary text-lg font-semibold px-8 py-4 rounded-md transition-colors text-center hover:shadow-lg transform hover:-translate-y-1">
                  {t('hero.becomeCarrier')}
                </a>
              </Link>
            </motion.div>
          </div>
          <div className="relative h-64 md:h-auto">
            <img 
              src="https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Moving truck on the road" 
              className="w-full h-full object-cover rounded-lg shadow-xl" 
            />
            <div className="absolute -bottom-5 -right-5 bg-[#00FF99] text-primary p-4 rounded-lg shadow-lg hidden md:block">
              <p className="font-bold">4,500+</p>
              <p className="text-sm">Successful Deliveries</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
