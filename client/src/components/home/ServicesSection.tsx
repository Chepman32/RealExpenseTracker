import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FaCouch, FaTv, FaPeopleCarry, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const services = [
  {
    icon: <FaCouch className="text-[#00FF99] text-xl" />,
    title: 'services.furniture.title',
    description: 'services.furniture.description',
  },
  {
    icon: <FaTv className="text-[#00FF99] text-xl" />,
    title: 'services.electronics.title',
    description: 'services.electronics.description',
  },
  {
    icon: <FaPeopleCarry className="text-[#00FF99] text-xl" />,
    title: 'services.loading.title',
    description: 'services.loading.description',
  },
];

const ServicesSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t('services.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="bg-gray-100 rounded-lg p-6 transition-all hover:shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{t(service.title)}</h3>
              <p className="text-gray-600 mb-4">
                {t(service.description)}
              </p>
              <a href="#" className="text-primary font-semibold hover:text-[#00FF99] transition-colors flex items-center">
                {t('services.learnMore')}
                <FaArrowRight className="ml-2" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
