import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { FaTruck, FaHandshake, FaShieldAlt, FaStar, FaGlobe, FaUserCog } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const teamMembers = [
    {
      name: 'Michael Johnson',
      title: 'CEO & Co-Founder',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Sarah Williams',
      title: 'COO & Co-Founder',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'David Chen',
      title: 'CTO',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    {
      name: 'Lisa Rodriguez',
      title: 'VP of Operations',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
  ];

  const values = [
    {
      icon: <FaHandshake size={40} className="text-primary" />,
      title: 'Trust',
      description: 'We build trust through transparency, reliability, and excellent service quality.',
    },
    {
      icon: <FaShieldAlt size={40} className="text-primary" />,
      title: 'Safety',
      description: 'The safety of your items and our carriers is our top priority.',
    },
    {
      icon: <FaStar size={40} className="text-primary" />,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service delivery.',
    },
    {
      icon: <FaGlobe size={40} className="text-primary" />,
      title: 'Community',
      description: 'Building a community of satisfied customers and trusted service providers.',
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Haulino</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to revolutionize freight transportation by connecting clients with carriers and loaders in a seamless, transparent platform.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-lg text-gray-600 mb-6">
            Founded in 2022, Haulino was born from a simple idea: to make freight transportation more accessible, efficient, and reliable for everyone involved.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Our founders experienced firsthand the challenges of coordinating moves and transporting large items. They realized there was a need for a modern platform that could connect people with trustworthy carriers and professional loaders.
          </p>
          <p className="text-lg text-gray-600">
            Today, Haulino has grown into a nationwide network of verified carriers and loaders, helping thousands of clients move their belongings safely and efficiently.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <div className="bg-primary/10 rounded-full p-8">
            <FaTruck size={200} className="text-primary" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Our Values</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          These core values guide everything we do at Haulino.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {values.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow text-center"
          >
            <div className="flex justify-center mb-6">{value.icon}</div>
            <h3 className="text-xl font-bold mb-4">{value.title}</h3>
            <p className="text-gray-600">{value.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Our Team</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Meet the dedicated team behind Haulino.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden text-center"
          >
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-full h-48 object-cover" 
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-gray-600">{member.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Whether you're a client looking for transportation services or a professional carrier or loader, we'd love to have you join our growing community.
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

export default AboutPage;