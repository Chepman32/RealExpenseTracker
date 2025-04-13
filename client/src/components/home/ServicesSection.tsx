import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FaCouch, FaTv, FaPeopleCarry, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Card, Col, Row, Typography } from 'antd';

const { Title, Paragraph } = Typography;

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
          <Title level={2}>{t('services.title')}</Title>
          <Paragraph className="text-gray-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {services.map((service, index) => (
            <Col xs={24} md={8} key={index}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  hoverable
                  style={{ height: '100%' }}
                >
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <Title level={4}>{t(service.title)}</Title>
                  <Paragraph>{t(service.description)}</Paragraph>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default ServicesSection;
