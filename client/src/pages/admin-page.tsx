import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, Table, Tag, Button, Input, Select, Statistic, Row, Col, DatePicker, Badge, Space, Alert } from 'antd';
import { SearchOutlined, UserOutlined, ShoppingCartOutlined, BarChartOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { UserRole, OrderStatus, User, Order } from '@shared/schema';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Redirect if not admin
  React.useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch users
  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: !!user && user.role === UserRole.ADMIN,
  });

  // Fetch orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
    enabled: !!user && user.role === UserRole.ADMIN,
  });

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert
          message="Access Denied"
          description="You don't have permission to access this page."
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Sample data for dashboard
  const sampleUsers = [
    { id: 1, username: 'johndoe', email: 'john@example.com', firstName: 'John', lastName: 'Doe', role: UserRole.CLIENT, status: 'active', createdAt: new Date('2023-01-15') },
    { id: 2, username: 'mikecarrier', email: 'mike@example.com', firstName: 'Mike', lastName: 'Johnson', role: UserRole.CARRIER, status: 'active', createdAt: new Date('2023-02-20') },
    { id: 3, username: 'sarahchen', email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Chen', role: UserRole.CARRIER, status: 'active', createdAt: new Date('2023-03-10') },
    { id: 4, username: 'davidload', email: 'david@example.com', firstName: 'David', lastName: 'Kim', role: UserRole.LOADER, status: 'active', createdAt: new Date('2023-02-05') },
    { id: 5, username: 'emilyuser', email: 'emily@example.com', firstName: 'Emily', lastName: 'Rodriguez', role: UserRole.CLIENT, status: 'suspended', createdAt: new Date('2023-04-15') },
  ];

  const sampleOrders = [
    { id: 1, clientId: 1, carrierId: 2, status: OrderStatus.COMPLETED, description: 'Moving sofa and dining table', pickupAddress: '123 Main St, New York', deliveryAddress: '456 Oak St, New York', scheduledDate: new Date('2023-05-15'), price: 150, createdAt: new Date('2023-05-10') },
    { id: 2, clientId: 1, carrierId: 3, status: OrderStatus.IN_PROGRESS, description: 'TV and electronics', pickupAddress: '789 Pine St, Los Angeles', deliveryAddress: '101 Beach Dr, Los Angeles', scheduledDate: new Date('2023-06-20'), price: 120, createdAt: new Date('2023-06-15') },
    { id: 3, clientId: 5, status: OrderStatus.PENDING, description: 'Office chair and desk', pickupAddress: '202 Hill Rd, Chicago', deliveryAddress: '303 Lake St, Chicago', scheduledDate: new Date('2023-06-25'), price: 90, createdAt: new Date('2023-06-18') },
    { id: 4, clientId: 5, carrierId: 2, status: OrderStatus.CANCELLED, description: 'Refrigerator', pickupAddress: '404 River Ln, Miami', deliveryAddress: '505 Ocean Blvd, Miami', scheduledDate: new Date('2023-06-10'), price: 200, createdAt: new Date('2023-06-05') },
  ];

  const displayUsers = users || sampleUsers;
  const displayOrders = orders || sampleOrders;

  // User columns for table
  const userColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: User, b: User) => a.id - b.id,
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record: User) => `${record.firstName} ${record.lastName}`,
      sorter: (a: User, b: User) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={
          role === UserRole.ADMIN ? 'purple' :
          role === UserRole.CLIENT ? 'blue' :
          role === UserRole.CARRIER ? 'green' :
          'orange'
        }>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Client', value: UserRole.CLIENT },
        { text: 'Carrier', value: UserRole.CARRIER },
        { text: 'Loader', value: UserRole.LOADER },
        { text: 'Admin', value: UserRole.ADMIN },
      ],
      onFilter: (value: string, record: User) => record.role === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'error'} text={status} />
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Pending', value: 'pending' },
        { text: 'Suspended', value: 'suspended' },
      ],
      onFilter: (value: string, record: User) => record.status === value,
    },
    {
      title: 'Registered',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a: User, b: User) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  // Order columns for table
  const orderColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Order, b: Order) => a.id - b.id,
    },
    {
      title: 'Client ID',
      dataIndex: 'clientId',
      key: 'clientId',
    },
    {
      title: 'Carrier ID',
      dataIndex: 'carrierId',
      key: 'carrierId',
      render: (carrierId: number) => carrierId || '-',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === OrderStatus.COMPLETED ? 'success' :
          status === OrderStatus.IN_PROGRESS ? 'processing' :
          status === OrderStatus.PENDING ? 'warning' :
          'error'
        }>
          {status.toUpperCase().replace('_', ' ')}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: OrderStatus.PENDING },
        { text: 'Accepted', value: OrderStatus.ACCEPTED },
        { text: 'In Progress', value: OrderStatus.IN_PROGRESS },
        { text: 'Completed', value: OrderStatus.COMPLETED },
        { text: 'Cancelled', value: OrderStatus.CANCELLED },
      ],
      onFilter: (value: string, record: Order) => record.status === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
      sorter: (a: Order, b: Order) => a.price - b.price,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a: Order, b: Order) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space>
          <Button type="link">View</Button>
          <Button type="text" icon={<EditOutlined />} />
        </Space>
      ),
    },
  ];

  // Filter users by search text
  const filteredUsers = displayUsers.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchText.toLowerCase()) || 
      fullName.includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Filter orders by search text and status
  const filteredOrders = displayOrders.filter(order => {
    const matchesSearch = order.description.toLowerCase().includes(searchText.toLowerCase()) ||
                         order.id.toString().includes(searchText);
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Stats calculations
  const totalUsers = displayUsers.length;
  const totalOrders = displayOrders.length;
  const pendingOrders = displayOrders.filter(o => o.status === OrderStatus.PENDING).length;
  const completedOrders = displayOrders.filter(o => o.status === OrderStatus.COMPLETED).length;
  const totalRevenue = displayOrders.reduce((sum, order) => sum + (order.price || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-6">{t('admin.title')}</h1>
            
            <Row gutter={[16, 16]} className="mb-6">
              <Col xs={12} sm={6}>
                <Card>
                  <Statistic
                    title="Total Users"
                    value={totalUsers}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card>
                  <Statistic
                    title="Total Orders"
                    value={totalOrders}
                    prefix={<ShoppingCartOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card>
                  <Statistic
                    title="Pending Orders"
                    value={pendingOrders}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card>
                  <Statistic
                    title="Revenue"
                    value={totalRevenue}
                    prefix="$"
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <Tabs defaultActiveKey="1">
              <TabPane 
                tab={
                  <span>
                    <UserOutlined />
                    {t('admin.users')}
                  </span>
                } 
                key="1"
              >
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <h2 className="text-xl font-semibold mb-2 sm:mb-0">{t('admin.manageUsers')}</h2>
                  <Input 
                    prefix={<SearchOutlined />} 
                    placeholder="Search users..." 
                    onChange={e => setSearchText(e.target.value)}
                    className="w-full sm:w-64"
                  />
                </div>
                
                <Table 
                  columns={userColumns} 
                  dataSource={filteredUsers}
                  rowKey="id"
                  loading={isLoadingUsers}
                  scroll={{ x: true }}
                />
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <ShoppingCartOutlined />
                    {t('admin.orders')}
                  </span>
                } 
                key="2"
              >
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl font-semibold">{t('admin.manageOrders')}</h2>
                  
                  <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                    <Select
                      placeholder="Filter by status"
                      allowClear
                      style={{ width: 150 }}
                      onChange={value => setStatusFilter(value)}
                    >
                      <Option value={OrderStatus.PENDING}>Pending</Option>
                      <Option value={OrderStatus.ACCEPTED}>Accepted</Option>
                      <Option value={OrderStatus.IN_PROGRESS}>In Progress</Option>
                      <Option value={OrderStatus.COMPLETED}>Completed</Option>
                      <Option value={OrderStatus.CANCELLED}>Cancelled</Option>
                    </Select>
                    
                    <Input 
                      prefix={<SearchOutlined />} 
                      placeholder="Search orders..." 
                      onChange={e => setSearchText(e.target.value)}
                      className="w-full sm:w-64"
                    />
                  </div>
                </div>
                
                <Table 
                  columns={orderColumns} 
                  dataSource={filteredOrders}
                  rowKey="id"
                  loading={isLoadingOrders}
                  scroll={{ x: true }}
                />
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <BarChartOutlined />
                    {t('admin.statistics')}
                  </span>
                } 
                key="3"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Order Statistics</h2>
                  
                  <div className="mb-4">
                    <div className="flex justify-end mb-4">
                      <RangePicker />
                    </div>
                    
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={8}>
                        <Card>
                          <Statistic
                            title={t('admin.pendingOrders')}
                            value={pendingOrders}
                            valueStyle={{ color: '#faad14' }}
                          />
                          <div className="mt-4">
                            <Badge status="warning" text="Needs attention" />
                          </div>
                        </Card>
                      </Col>
                      
                      <Col xs={24} sm={8}>
                        <Card>
                          <Statistic
                            title={t('admin.activeOrders')}
                            value={displayOrders.filter(o => 
                              o.status === OrderStatus.ACCEPTED || 
                              o.status === OrderStatus.IN_PROGRESS
                            ).length}
                            valueStyle={{ color: '#1890ff' }}
                          />
                          <div className="mt-4">
                            <Badge status="processing" text="In progress" />
                          </div>
                        </Card>
                      </Col>
                      
                      <Col xs={24} sm={8}>
                        <Card>
                          <Statistic
                            title={t('admin.completedOrders')}
                            value={completedOrders}
                            valueStyle={{ color: '#3f8600' }}
                          />
                          <div className="mt-4">
                            <Badge status="success" text="Successfully delivered" />
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-4 mt-8">Revenue Overview</h2>
                  
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Card>
                        <Statistic
                          title="Total Revenue"
                          value={totalRevenue}
                          precision={2}
                          prefix="$"
                        />
                      </Card>
                    </Col>
                    
                    <Col xs={24} sm={12}>
                      <Card>
                        <Statistic
                          title="Average Order Value"
                          value={totalOrders ? (totalRevenue / totalOrders).toFixed(2) : 0}
                          precision={2}
                          prefix="$"
                        />
                      </Card>
                    </Col>
                  </Row>
                  
                  <div className="mt-8">
                    <Alert
                      message="Revenue Report"
                      description="Detailed revenue reports can be exported as CSV by clicking the button below."
                      type="info"
                      showIcon
                      action={
                        <Button size="small" type="primary">
                          Export Report
                        </Button>
                      }
                    />
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
