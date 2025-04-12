import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FaStar, FaStarHalfAlt, FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const testimonials = [
  {
    text: '"I needed to move my sofa and dining table across town on short notice. Haulino matched me with a carrier within minutes, and everything was moved that same day. Incredible service!"',
    name: 'Emily R.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    rating: 5,
  },
  {
    text: '"As someone who\'s moved multiple times, I can confidently say Haulino made this the easiest move ever. The carriers were professional, on time, and handled my items with care."',
    name: 'Marcus T.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    rating: 4.5,
  }
];

const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} />);
    } else {
      stars.push(<FaStar key={i} className="opacity-30" />);
    }
  }
  
  return stars;
};

const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t('testimonials.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-100 rounded-lg p-6 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-[#00FF99] text-4xl absolute -top-3 -left-2">
                <FaQuoteLeft />
              </div>
              <div className="mb-4 pt-4">
                <p className="text-gray-700 italic">
                  {testimonial.text}
                </p>
              </div>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4" 
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="flex text-yellow-500">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
