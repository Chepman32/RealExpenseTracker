import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, Form, Input, Button, Select, Upload, Avatar, List, Rate, Tag, Empty, Spin, Badge } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, UploadOutlined, PlusOutlined, ClockCircleOutlined, CheckCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { FaTruck, FaMapMarkerAlt } from 'react-icons/fa';
import { UserRole, VehicleType, Order, OrderStatus } from '@shared/schema';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const ProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');

  // Fetch user orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ['/api/orders/client'],
    enabled: !!user,
  });

  // Fetch carrier orders if user is a carrier
  const { data: carrierOrders, isLoading: isLoadingCarrierOrders } = useQuery<Order[]>({
    queryKey: ['/api/orders/carrier'],
    enabled: !!user && user.role === UserRole.CARRIER,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/update-profile", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle profile update
  const handleUpdateProfile = (values: any) => {
    updateProfileMutation.mutate(values);
  };

  // Initialize profile form values
  React.useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        workAreas: user.workAreas,
        vehicleType: user.vehicleType,
        vehicleCapacity: user.vehicleCapacity,
        description: user.description,
      });
    }
  }, [user, profileForm]);

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'warning';
      case OrderStatus.ACCEPTED:
        return 'processing';
      case OrderStatus.IN_PROGRESS:
        return 'processing';
      case OrderStatus.COMPLETED:
        return 'success';
      case OrderStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Sidebar */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar 
                      size={100} 
                      src={user.profilePicture} 
                      icon={<UserOutlined />}
                      className="mb-4" 
                    />
                    <h2 className="text-2xl font-bold">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-gray-500">
                      {user.role === UserRole.CLIENT ? 'Client' : 
                       user.role === UserRole.CARRIER ? 'Carrier' : 
                       user.role === UserRole.LOADER ? 'Loader' : 'Admin'}
                    </p>
                    
                    {(user.role === UserRole.CARRIER || user.role === UserRole.LOADER) && (
                      <div className="mt-2">
                        <Rate disabled defaultValue={user.rating || 0} />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MailOutlined className="text-gray-400 mr-3" />
                      <span>{user.email}</span>
                    </div>
                    
                    {user.phone && (
                      <div className="flex items-center">
                        <PhoneOutlined className="text-gray-400 mr-3" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    
                    {user.workAreas && user.workAreas.length > 0 && (
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-gray-400 mr-3" />
                        <span>{user.workAreas.join(', ')}</span>
                      </div>
                    )}
                    
                    {user.vehicleType && (
                      <div className="flex items-center">
                        <FaTruck className="text-gray-400 mr-3" />
                        <span>
                          {user.vehicleType === VehicleType.BOX_TRUCK ? 'Box Truck' : 'Pickup Truck'}
                          {user.vehicleCapacity && ` (${user.vehicleCapacity})`}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-3">Account Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-100 p-3 rounded-md text-center">
                        <p className="text-2xl font-bold text-primary">{orders?.length || 0}</p>
                        <p className="text-sm text-gray-500">Orders</p>
                      </div>
                      
                      {user.role === UserRole.CARRIER && (
                        <div className="bg-gray-100 p-3 rounded-md text-center">
                          <p className="text-2xl font-bold text-primary">{carrierOrders?.length || 0}</p>
                          <p className="text-sm text-gray-500">Deliveries</p>
                        </div>
                      )}
                      
                      {user.role === UserRole.CLIENT && (
                        <div className="bg-gray-100 p-3 rounded-md text-center">
                          <p className="text-2xl font-bold text-primary">
                            {orders?.filter(o => o.status === OrderStatus.COMPLETED).length || 0}
                          </p>
                          <p className="text-sm text-gray-500">Completed</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="w-full md:w-2/3">
              <Card>
                <CardContent className="pt-6">
                  <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Profile" key="1">
                      <h2 className="text-2xl font-bold mb-6">{t('profile.title')}</h2>
                      
                      <Form
                        form={profileForm}
                        layout="vertical"
                        onFinish={handleUpdateProfile}
                      >
                        <h3 className="text-lg font-semibold mb-4">{t('profile.personalInfo')}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <Form.Item
                            name="firstName"
                            label="First Name"
                            rules={[{ required: true, message: 'Please input your first name!' }]}
                          >
                            <Input />
                          </Form.Item>
                          
                          <Form.Item
                            name="lastName"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please input your last name!' }]}
                          >
                            <Input />
                          </Form.Item>
                          
                          <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                              { required: true, message: 'Please input your email!' },
                              { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                          >
                            <Input disabled />
                          </Form.Item>
                          
                          <Form.Item
                            name="phone"
                            label="Phone"
                          >
                            <Input />
                          </Form.Item>
                        </div>
                        
                        {(user.role === UserRole.CARRIER || user.role === UserRole.LOADER) && (
                          <>
                            <h3 className="text-lg font-semibold mb-4">{t('profile.workInfo')}</h3>
                            
                            <Form.Item
                              name="workAreas"
                              label={t('profile.workAreas')}
                            >
                              <Select mode="tags" placeholder={t('profile.addArea')}>
                                <Option value="New York">New York</Option>
                                <Option value="Los Angeles">Los Angeles</Option>
                                <Option value="Chicago">Chicago</Option>
                                <Option value="Miami">Miami</Option>
                                <Option value="San Francisco">San Francisco</Option>
                              </Select>
                            </Form.Item>
                            
                            {user.role === UserRole.CARRIER && (
                              <>
                                <h3 className="text-lg font-semibold mb-4">{t('profile.vehicleInfo')}</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                  <Form.Item
                                    name="vehicleType"
                                    label={t('profile.vehicleType')}
                                  >
                                    <Select placeholder="Select vehicle type">
                                      <Option value={VehicleType.PICKUP}>Pickup Truck</Option>
                                      <Option value={VehicleType.BOX_TRUCK}>Box Truck</Option>
                                    </Select>
                                  </Form.Item>
                                  
                                  <Form.Item
                                    name="vehicleCapacity"
                                    label={t('profile.vehicleCapacity')}
                                  >
                                    <Input placeholder="e.g., 1500 lbs, 16 ft" />
                                  </Form.Item>
                                </div>
                                
                                <Form.Item
                                  name="vehiclePhoto"
                                  label={t('profile.vehiclePhoto')}
                                >
                                  <Upload
                                    listType="picture"
                                    maxCount={1}
                                    beforeUpload={() => false}
                                  >
                                    <Button icon={<UploadOutlined />}>{t('profile.uploadPhoto')}</Button>
                                  </Upload>
                                </Form.Item>
                              </>
                            )}
                            
                            <Form.Item
                              name="description"
                              label={t('profile.description')}
                            >
                              <TextArea rows={4} placeholder="Tell clients about your experience, specialties, etc." />
                            </Form.Item>
                          </>
                        )}
                        
                        <Form.Item>
                          <Button 
                            type="primary"
                            htmlType="submit"
                            loading={updateProfileMutation.isPending}
                            className="bg-primary text-white"
                          >
                            {t('profile.saveChanges')}
                          </Button>
                        </Form.Item>
                      </Form>
                    </TabPane>
                    
                    <TabPane tab="Orders" key="2">
                      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                      
                      {isLoadingOrders ? (
                        <div className="flex justify-center py-8">
                          <Spin size="large" />
                        </div>
                      ) : orders && orders.length > 0 ? (
                        <List
                          itemLayout="horizontal"
                          dataSource={orders}
                          renderItem={order => (
                            <List.Item
                              actions={[
                                <Button key="view" type="link">View Details</Button>
                              ]}
                            >
                              <List.Item.Meta
                                avatar={
                                  <Badge status={getStatusBadgeColor(order.status)} />
                                }
                                title={
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <span>Order #{order.id}</span>
                                    <Tag color={getStatusBadgeColor(order.status)}>
                                      {order.status}
                                    </Tag>
                                  </div>
                                }
                                description={
                                  <div>
                                    <p className="mb-1">{order.description}</p>
                                    <div className="text-xs text-gray-500">
                                      <p className="mb-1">
                                        <span className="font-medium">From:</span> {order.pickupAddress}
                                      </p>
                                      <p className="mb-1">
                                        <span className="font-medium">To:</span> {order.deliveryAddress}
                                      </p>
                                      <p>
                                        <span className="font-medium">Scheduled:</span> {new Date(order.scheduledDate).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Empty
                          description="You haven't created any orders yet"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                          <Button type="primary" href="/order" className="bg-primary text-white">
                            Create Your First Order
                          </Button>
                        </Empty>
                      )}
                    </TabPane>
                    
                    {user.role === UserRole.CARRIER && (
                      <TabPane tab="Jobs" key="3">
                        <h2 className="text-2xl font-bold mb-6">My Carrier Jobs</h2>
                        
                        {isLoadingCarrierOrders ? (
                          <div className="flex justify-center py-8">
                            <Spin size="large" />
                          </div>
                        ) : carrierOrders && carrierOrders.length > 0 ? (
                          <List
                            itemLayout="horizontal"
                            dataSource={carrierOrders}
                            renderItem={order => (
                              <List.Item
                                actions={[
                                  <Button key="view" type="link">View Details</Button>
                                ]}
                              >
                                <List.Item.Meta
                                  avatar={
                                    order.status === OrderStatus.PENDING ? (
                                      <ClockCircleOutlined className="text-yellow-500" />
                                    ) : order.status === OrderStatus.COMPLETED ? (
                                      <CheckCircleOutlined className="text-green-500" />
                                    ) : (
                                      <InboxOutlined className="text-blue-500" />
                                    )
                                  }
                                  title={
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                      <span>Job #{order.id}</span>
                                      <Tag color={getStatusBadgeColor(order.status)}>
                                        {order.status}
                                      </Tag>
                                    </div>
                                  }
                                  description={
                                    <div>
                                      <p className="mb-1">{order.description}</p>
                                      <div className="text-xs text-gray-500">
                                        <p className="mb-1">
                                          <span className="font-medium">From:</span> {order.pickupAddress}
                                        </p>
                                        <p className="mb-1">
                                          <span className="font-medium">To:</span> {order.deliveryAddress}
                                        </p>
                                        <p>
                                          <span className="font-medium">Scheduled:</span> {new Date(order.scheduledDate).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        ) : (
                          <Empty
                            description="You haven't accepted any jobs yet"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                          />
                        )}
                      </TabPane>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
