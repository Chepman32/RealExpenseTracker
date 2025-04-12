import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FaCouch, FaTv, FaHandsHelping, FaTruck, FaBuilding, FaPalette } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const ServicesPage: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: <FaCouch size={40} className="text-primary" />,
      title: t('services.furniture.title'),
      description: t('services.furniture.description'),
    },
    {
      icon: <FaTv size={40} className="text-primary" />,
      title: t('services.electronics.title'),
      description: t('services.electronics.description'),
    },
    {
      icon: <FaHandsHelping size={40} className="text-primary" />,
      title: t('services.loading.title'),
      description: t('services.loading.description'),
    },
    {
      icon: <FaTruck size={40} className="text-primary" />,
      title: 'Commercial Moving',
      description: 'Professional moving services for offices, retail spaces, and other commercial properties.',
    },
    {
      icon: <FaBuilding size={40} className="text-primary" />,
      title: 'Storage Solutions',
      description: 'Secure storage options for your belongings during transition periods or long-term needs.',
    },
    {
      icon: <FaPalette size={40} className="text-primary" />,
      title: 'Specialty Items',
      description: 'Careful handling and transportation of pianos, artwork, antiques, and other high-value items.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('services.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('services.subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="mb-6">{service.icon}</div>
            <h3 className="text-xl font-bold mb-4">{service.title}</h3>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/5">
              {t('services.learnMore')}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to simplify your moving experience?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join thousands of satisfied customers who've made moving easier with Haulino.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/order">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Create an Order
            </Button>
          </Link>
          <Link href="/carriers/register">
            <Button size="lg" variant="outline" className="text-primary border-primary hover:bg-primary/5">
              Become a Carrier
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;