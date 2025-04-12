import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import OrderForm from '@/components/order/OrderForm';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb } from 'antd';
import { Link } from 'wouter';
import { HomeOutlined, FormOutlined } from '@ant-design/icons';

const OrderPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Breadcrumb className="mb-8">
          <Breadcrumb.Item>
            <Link href="/">
              <a><HomeOutlined /> {t('header.home')}</a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <FormOutlined /> {t('orderForm.title')}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold text-center mb-2">{t('orderForm.title')}</h1>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
              {t('orderForm.subtitle')}
            </p>
            
            <div className="max-w-4xl mx-auto">
              <OrderForm />
            </div>
          </CardContent>
        </Card>
        
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00FF99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">
                Your information is encrypted and securely stored. We only share necessary details with assigned carriers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00FF99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">
                Get an instant estimate before booking. No hidden fees, pay only for the services you need.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#00FF99]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Vetted Carriers</h3>
              <p className="text-gray-600">
                All carriers on our platform are thoroughly vetted and rated by other customers for quality assurance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
