import React from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Typography, Button, Row, Col } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={12}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Title level={2} style={{ color: 'white', marginBottom: '16px' }}>
                <span style={{ color: '#00FF99' }}>Move big.</span> Move smart.
              </Title>
              <Paragraph style={{ color: 'white', fontSize: '1.2em', marginBottom: '24px' }}>
                {t('hero.subtitle')}
              </Paragraph>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link href="/order">
                  <Button type="primary" style={{ backgroundColor: '#00FF99', color: '#00334D', fontWeight: 'bold' }}>
                    {t('hero.createOrder')}
                  </Button>
                </Link>
                <Link href="/carriers/register">
                  <Button type="default" style={{ color: 'white', fontWeight: 'bold', borderColor: 'white' }}>
                    {t('hero.becomeCarrier')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </Col>
          <Col xs={24} md={12}>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1601628828688-632f38a5a7d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Moving truck on the road"
                className="w-full rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-5 -right-5 bg-[#00FF99] text-primary p-4 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold">4,500+</p>
                <p className="text-sm">Successful Deliveries</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default HeroSection;
