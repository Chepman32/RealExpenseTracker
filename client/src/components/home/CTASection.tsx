import React from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';

const CTASection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-xl mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/order">
              <a className="bg-[#00FF99] hover:bg-[#00CC7A] text-primary px-8 py-4 rounded-md transition-colors font-semibold hover:shadow-lg transform hover:-translate-y-1">
                {t('hero.createOrder')}
              </a>
            </Link>
            <Link href="/carriers/register">
              <a className="border border-white hover:bg-white hover:text-primary px-8 py-4 rounded-md transition-colors font-semibold hover:shadow-lg transform hover:-translate-y-1">
                {t('hero.becomeCarrier')}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
