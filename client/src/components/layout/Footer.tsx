import React from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Select } from 'antd';
import { FaTruck, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  
  const handleLanguageChange = (value: string) => {
    if (value === 'en' || value === 'ru') {
      setLanguage(value);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaTruck className="text-[#00FF99] mr-2" />
              Haulino
            </h3>
            <p className="text-gray-400 mb-4">
              {t('footer.slogan')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.furnitureMoving')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.electronicsTransport')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.loadingServices')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.commercialMoving')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.specialtyItems')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.aboutUs')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.howItWorks')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.careers')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.press')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.blog')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.faqs')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.contactUs')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.termsOfService')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF99] transition-colors">{t('footer.privacyPolicy')}</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">{t('footer.language')}:</span>
              <Select
                value={language}
                onChange={handleLanguageChange}
                className="w-28"
                dropdownStyle={{ backgroundColor: '#262626', color: '#fff' }}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'ru', label: 'Русский' }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
