import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { FaUserFriends, FaHandsHelping, FaStar, FaShieldAlt } from 'react-icons/fa';

const LoadersPage: React.FC = () => {
  const { t } = useLanguage();

  const loaders = [
    {
      id: 1,
      name: 'John Smith',
      location: 'New York, NY',
      rating: 4.9,
      jobsCompleted: 124,
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      location: 'Los Angeles, CA',
      rating: 5.0,
      jobsCompleted: 98,
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: 3,
      name: 'David Johnson',
      location: 'Chicago, IL',
      rating: 4.8,
      jobsCompleted: 87,
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: 4,
      name: 'Lisa Williams',
      location: 'Houston, TX',
      rating: 4.7,
      jobsCompleted: 112,
      image: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    {
      id: 5,
      name: 'Robert Brown',
      location: 'Miami, FL',
      rating: 4.9,
      jobsCompleted: 76,
      image: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    {
      id: 6,
      name: 'Jennifer Davis',
      location: 'Seattle, WA',
      rating: 4.8,
      jobsCompleted: 103,
      image: 'https://randomuser.me/api/portraits/women/6.jpg'
    },
  ];

  const benefits = [
    {
      icon: <FaUserFriends size={40} className="text-primary" />,
      title: 'Verified Professionals',
      description: 'All our loaders are verified, background-checked professionals with experience.'
    },
    {
      icon: <FaHandsHelping size={40} className="text-primary" />,
      title: 'Careful Handling',
      description: 'Trained to handle your items with care, from furniture to delicate electronics.'
    },
    {
      icon: <FaStar size={40} className="text-primary" />,
      title: 'Highly Rated',
      description: 'Our loaders maintain an average rating of 4.8/5 based on customer feedback.'
    },
    {
      icon: <FaShieldAlt size={40} className="text-primary" />,
      title: 'Fully Insured',
      description: 'Peace of mind with insurance coverage for all items handled by our loaders.'
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
          Expert Loading Services
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with skilled loaders who can help with heavy lifting, careful packing, and proper handling of your items.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="mb-6">{benefit.icon}</div>
            <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
            <p className="text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-center mb-10">Top Rated Loaders</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {loaders.map((loader) => (
          <motion.div
            key={loader.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: loader.id * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img 
                  src={loader.image} 
                  alt={loader.name} 
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold">{loader.name}</h3>
                  <p className="text-gray-600">{loader.location}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="font-bold">{loader.rating}</span>
                </div>
                <div className="text-gray-600">
                  {loader.jobsCompleted} jobs completed
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">
                View Profile
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Need help with your move?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Book skilled loaders to assist with your next move. Our professionals will handle all the heavy lifting.
        </p>
        <Link href="/order">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
            Book Loaders Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LoadersPage;