import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { FaStar, FaArrowRight, FaFilter } from 'react-icons/fa';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Input, Select, Button, Breadcrumb, Spin, Empty, Rate, Pagination, Drawer, Space, Checkbox, Radio, Divider } from 'antd';
import { HomeOutlined, SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { User } from '@shared/schema';

const { Option } = Select;
const { Search } = Input;

const CarriersPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

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
      description: 'Professional carrier with 5+ years of experience in furniture and electronics transportation.',
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Chen',
      rating: 4.8,
      vehicleType: 'pickup',
      workAreas: ['San Francisco'],
      profilePicture: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Specializing in small-to-medium item transport with careful handling of fragile goods.',
    },
    {
      id: 3,
      firstName: 'James',
      lastName: 'Wilson',
      rating: 4.7,
      vehicleType: 'box_truck',
      workAreas: ['New York'],
      profilePicture: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'NYC-based carrier offering quick and efficient furniture and office equipment moving services.',
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Rodriguez',
      rating: 4.6,
      vehicleType: 'box_truck',
      workAreas: ['Chicago'],
      profilePicture: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Experienced in residential and commercial moves throughout the Midwest region.',
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Kim',
      rating: 4.9,
      vehicleType: 'pickup',
      workAreas: ['Seattle'],
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'Reliable carrier specializing in electronics and delicate items transport in the Pacific Northwest.',
    },
    {
      id: 6,
      firstName: 'Lisa',
      lastName: 'Martinez',
      rating: 4.8,
      vehicleType: 'box_truck',
      workAreas: ['Miami'],
      profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      description: 'South Florida carrier with expertise in furniture and appliance moving.',
    }
  ];

  const displayCarriers = carriers && carriers.length > 0 ? carriers : sampleCarriers;
  
  // Filter carriers based on search term and location
  const filteredCarriers = displayCarriers.filter(carrier => {
    const fullName = `${carrier.firstName} ${carrier.lastName}`.toLowerCase();
    const matchesSearch = searchTerm ? fullName.includes(searchTerm.toLowerCase()) : true;
    const matchesLocation = selectedLocation ? carrier.workAreas?.includes(selectedLocation) : true;
    return matchesSearch && matchesLocation;
  });
  
  // Paginate carriers
  const paginatedCarriers = filteredCarriers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const availableLocations = [...new Set(displayCarriers.flatMap(carrier => carrier.workAreas || []))];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Breadcrumb className="mb-8">
          <Breadcrumb.Item>
            <Link href="/">
              <a><HomeOutlined /> {t('header.home')}</a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('header.carriers')}</Breadcrumb.Item>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('carriers.title')}</h1>
            <p className="text-gray-600 max-w-2xl">{t('carriers.subtitle')}</p>
          </div>

          <div className="mt-4 md:mt-0">
            <Button 
              type="primary" 
              icon={<FaFilter />}
              onClick={() => setFiltersVisible(true)}
              className="md:hidden mb-4 w-full"
            >
              Filters
            </Button>
            
            <div className="hidden md:flex space-x-3">
              <Search 
                placeholder="Search carriers" 
                allowClear 
                onSearch={value => setSearchTerm(value)}
                style={{ width: 200 }}
              />
              
              <Select
                placeholder="Select location"
                allowClear
                style={{ width: 150 }}
                onChange={value => setSelectedLocation(value)}
              >
                {availableLocations.map(location => (
                  <Option key={location} value={location}>{location}</Option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        <Drawer
          title="Filter Carriers"
          placement="right"
          open={filtersVisible}
          onClose={() => setFiltersVisible(false)}
          footer={
            <Space>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedLocation('');
              }}>Clear</Button>
              <Button type="primary" onClick={() => setFiltersVisible(false)}>Apply</Button>
            </Space>
          }
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Search</h4>
              <Input 
                placeholder="Search carriers" 
                allowClear 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </div>
            
            <Divider />
            
            <div>
              <h4 className="font-semibold mb-2">Location</h4>
              <Radio.Group onChange={e => setSelectedLocation(e.target.value)} value={selectedLocation}>
                <Space direction="vertical">
                  {availableLocations.map(location => (
                    <Radio key={location} value={location}>{location}</Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
            
            <Divider />
            
            <div>
              <h4 className="font-semibold mb-2">Vehicle Type</h4>
              <Checkbox.Group>
                <Space direction="vertical">
                  <Checkbox value="box_truck">Box Truck</Checkbox>
                  <Checkbox value="pickup">Pickup Truck</Checkbox>
                </Space>
              </Checkbox.Group>
            </div>
            
            <Divider />
            
            <div>
              <h4 className="font-semibold mb-2">Minimum Rating</h4>
              <Rate defaultValue={4} />
            </div>
          </div>
        </Drawer>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : filteredCarriers.length === 0 ? (
          <Empty
            description="No carriers found matching your criteria"
            className="my-12"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedCarriers.map((carrier) => (
                <Card key={carrier.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={carrier.profilePicture || `https://ui-avatars.com/api/?name=${carrier.firstName}+${carrier.lastName}&background=random`}
                        alt={`${carrier.firstName} ${carrier.lastName}`} 
                        className="w-full h-48 object-cover rounded-t-lg" 
                      />
                      <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                        <EnvironmentOutlined className="mr-1 text-gray-500" />
                        {carrier.workAreas?.[0] || 'Local Area'}
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">{carrier.firstName} {carrier.lastName}</h3>
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1"><FaStar /></span>
                          <span className="font-medium">{carrier.rating || '4.5+'}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {carrier.vehicleType === 'box_truck' ? 'Box Truck' : 'Pickup Truck'}
                      </p>
                      
                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {carrier.description || 'Experienced carrier offering professional transportation services.'}
                      </p>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Furniture</span>
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Electronics</span>
                      </div>
                      
                      <Link href={`/carriers/${carrier.id}`}>
                        <a className="text-primary font-semibold hover:text-[#00FF99] transition-colors flex items-center">
                          {t('carriers.viewProfile')}
                          <FaArrowRight className="ml-2" />
                        </a>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-12">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredCarriers.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
        
        <div className="mt-16 bg-primary text-white rounded-lg p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Want to join our network of carriers?</h2>
            <p className="text-lg mb-6">
              Become a Haulino carrier and start earning by helping people move their items.
            </p>
            <Button 
              type="primary" 
              size="large"
              className="bg-[#00FF99] hover:bg-[#00CC7A] text-primary px-8 py-6 h-auto font-semibold"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarriersPage;
