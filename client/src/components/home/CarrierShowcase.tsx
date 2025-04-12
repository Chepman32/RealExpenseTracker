import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import { Link } from 'wouter';
import { Spin } from 'antd';
import { User } from '@shared/schema';

const CarrierShowcase: React.FC = () => {
  const { t } = useLanguage();
  
  const { data: carriers, isLoading } = useQuery<User[]>({
    queryKey: ['/api/carriers'],
    // Default queryFn from queryClient.ts will handle this
  });

  // Sample data to display when actual data isn't available yet
  const sampleCarriers = [
    {
      id: 1,
      firstName: 'Mike',
      lastName: 'Johnson',
      rating: 4.9,
      vehicleType: 'box_truck',
      workAreas: ['Los Angeles'],
      profilePicture: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Chen',
      rating: 4.8,
      vehicleType: 'pickup',
      workAreas: ['San Francisco'],
      profilePicture: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 3,
      firstName: 'James',
      lastName: 'Wilson',
      rating: 4.7,
      vehicleType: 'box_truck',
      workAreas: ['New York'],
      profilePicture: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    }
  ];

  const displayCarriers = carriers && carriers.length > 0 ? carriers.slice(0, 3) : sampleCarriers;
  
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t('carriers.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('carriers.subtitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayCarriers.map((carrier) => (
              <div 
                key={carrier.id} 
                className="bg-white rounded-lg overflow-hidden shadow transition-shadow hover:shadow-lg"
              >
                <img 
                  src={carrier.profilePicture || `https://ui-avatars.com/api/?name=${carrier.firstName}+${carrier.lastName}&background=random`}
                  alt={`${carrier.firstName} ${carrier.lastName}`} 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold">{carrier.firstName} {carrier.lastName}</h3>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1"><FaStar /></span>
                      <span className="font-medium">{carrier.rating || '4.5+'}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {carrier.vehicleType === 'box_truck' ? 'Box Truck' : 'Pickup Truck'} | {carrier.workAreas?.[0] || 'Local'} Area
                  </p>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Furniture</span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Electronics</span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Appliances</span>
                  </div>
                  <Link href={`/carriers/${carrier.id}`}>
                    <a className="text-primary font-semibold hover:text-[#00FF99] transition-colors flex items-center">
                      {t('carriers.viewProfile')}
                      <FaArrowRight className="ml-2" />
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/carriers">
            <a className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-md transition-colors inline-block font-medium hover:shadow-lg transform hover:-translate-y-1">
              {t('carriers.browseAll')}
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CarrierShowcase;
