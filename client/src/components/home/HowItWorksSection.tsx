import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "1",
    title: 'howItWorks.step1.title',
    description: 'howItWorks.step1.description',
  },
  {
    number: "2",
    title: 'howItWorks.step2.title',
    description: 'howItWorks.step2.description',
  },
  {
    number: "3",
    title: 'howItWorks.step3.title',
    description: 'howItWorks.step3.description',
  },
];

const HowItWorksSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t('howItWorks.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[#00FF99] font-bold text-xl">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t(step.title)}</h3>
              <p className="text-gray-600">
                {t(step.description)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
