import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/context/LanguageContext';
import { Form, Input, Button, Radio, Tabs, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GoogleOutlined } from '@ant-design/icons';
import { UserRole } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { FaTruck } from 'react-icons/fa';

const { TabPane } = Tabs;

const AuthPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('login');

  // If user is already logged in, redirect to homepage
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = (values: any) => {
    loginMutation.mutate({
      username: values.username,
      password: values.password,
    });
  };

  const handleRegister = (values: any) => {
    registerMutation.mutate({
      username: values.email.split('@')[0] + Math.floor(Math.random() * 1000),
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      role: values.role || UserRole.CLIENT,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Form Section */}
            <div>
              <Card className="w-full">
                <CardContent className="pt-6">
                  <Tabs 
                    activeKey={activeTab} 
                    onChange={setActiveTab}
                    className="mb-6"
                  >
                    <TabPane tab={t('auth.login')} key="login">
                      <h2 className="text-2xl font-bold mb-6 text-primary">{t('auth.loginTitle')}</h2>
                      
                      <Form
                        form={loginForm}
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={handleLogin}
                        layout="vertical"
                      >
                        <Form.Item
                          name="username"
                          rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                          <Input 
                            prefix={<UserOutlined />} 
                            placeholder={t('auth.email')} 
                            size="large" 
                          />
                        </Form.Item>
                        
                        <Form.Item
                          name="password"
                          rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                          <Input.Password 
                            prefix={<LockOutlined />} 
                            placeholder={t('auth.password')} 
                            size="large" 
                          />
                        </Form.Item>
                        
                        <div className="flex justify-between mb-4">
                          <Form.Item name="remember" valuePropName="checked" noStyle>
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id="remember" 
                                className="h-4 w-4 text-[#00FF99] border-gray-300 rounded"
                              />
                              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                {t('auth.rememberMe')}
                              </label>
                            </div>
                          </Form.Item>
                          
                          <a href="#" className="text-sm text-[#00FF99] hover:underline">
                            {t('auth.forgotPassword')}
                          </a>
                        </div>
                        
                        <Form.Item>
                          <Button 
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-primary hover:bg-opacity-90 text-white font-medium py-2 h-10"
                            loading={loginMutation.isPending}
                          >
                            {t('auth.loginButton')}
                          </Button>
                        </Form.Item>
                      </Form>
                      
                      <Divider plain>{t('auth.or')}</Divider>
                      
                      <Button 
                        className="w-full border border-gray-300 bg-white text-gray-700 font-medium h-10 flex items-center justify-center"
                        icon={<GoogleOutlined />}
                      >
                        {t('auth.continueWithGoogle')}
                      </Button>
                      
                      <p className="mt-6 text-center text-sm text-gray-600">
                        {t('auth.noAccount')} 
                        <Button 
                          type="link" 
                          onClick={() => setActiveTab('register')}
                          className="text-[#00FF99] font-medium hover:underline p-0"
                        >
                          {t('auth.signup')}
                        </Button>
                      </p>
                    </TabPane>
                    
                    <TabPane tab={t('auth.signup')} key="register">
                      <h2 className="text-2xl font-bold mb-6 text-primary">{t('auth.registerTitle')}</h2>
                      
                      <Form
                        form={registerForm}
                        name="register"
                        onFinish={handleRegister}
                        layout="vertical"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <Form.Item
                            name="firstName"
                            rules={[{ required: true, message: 'Please input your first name!' }]}
                          >
                            <Input 
                              placeholder={t('auth.firstName')} 
                              size="large" 
                            />
                          </Form.Item>
                          
                          <Form.Item
                            name="lastName"
                            rules={[{ required: true, message: 'Please input your last name!' }]}
                          >
                            <Input 
                              placeholder={t('auth.lastName')} 
                              size="large" 
                            />
                          </Form.Item>
                        </div>
                        
                        <Form.Item
                          name="email"
                          rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                          ]}
                        >
                          <Input 
                            prefix={<MailOutlined />} 
                            placeholder={t('auth.email')} 
                            size="large" 
                          />
                        </Form.Item>
                        
                        <Form.Item
                          name="phone"
                          rules={[{ required: true, message: 'Please input your phone number!' }]}
                        >
                          <Input 
                            prefix={<PhoneOutlined />} 
                            placeholder={t('auth.phone')} 
                            size="large" 
                          />
                        </Form.Item>
                        
                        <Form.Item
                          name="password"
                          rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                          ]}
                        >
                          <Input.Password 
                            prefix={<LockOutlined />} 
                            placeholder={t('auth.password')} 
                            size="large" 
                          />
                        </Form.Item>
                        
                        <Form.Item
                          name="confirmPassword"
                          dependencies={['password']}
                          rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                              },
                            }),
                          ]}
                        >
                          <Input.Password 
                            prefix={<LockOutlined />} 
                            placeholder={t('auth.confirmPassword')} 
                            size="large" 
                          />
                        </Form.Item>
                        
                        <Form.Item 
                          name="role"
                          label={t('auth.role')}
                          initialValue={UserRole.CLIENT}
                        >
                          <Radio.Group>
                            <Radio value={UserRole.CLIENT}>{t('auth.client')}</Radio>
                            <Radio value={UserRole.CARRIER}>{t('auth.carrier')}</Radio>
                            <Radio value={UserRole.LOADER}>{t('auth.loader')}</Radio>
                          </Radio.Group>
                        </Form.Item>
                        
                        <Form.Item>
                          <Button 
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-primary hover:bg-opacity-90 text-white font-medium py-2 h-10"
                            loading={registerMutation.isPending}
                          >
                            {t('auth.registerButton')}
                          </Button>
                        </Form.Item>
                      </Form>
                      
                      <p className="mt-6 text-center text-sm text-gray-600">
                        {t('auth.hasAccount')} 
                        <Button 
                          type="link" 
                          onClick={() => setActiveTab('login')}
                          className="text-[#00FF99] font-medium hover:underline p-0"
                        >
                          {t('auth.login')}
                        </Button>
                      </p>
                    </TabPane>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            {/* Hero Section */}
            <div className="bg-primary rounded-lg p-8 text-white hidden md:block">
              <div className="flex items-center mb-6">
                <FaTruck className="text-[#00FF99] text-3xl mr-3" />
                <h1 className="text-3xl font-bold">Haulino</h1>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">
                <span className="text-[#00FF99]">Move big.</span> Move smart.
              </h2>
              
              <p className="mb-6">
                Join Haulino today and simplify your freight shipping across the US. Connect with verified carriers and loaders in just a few clicks.
              </p>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-start">
                  <div className="bg-[#00FF99] p-2 rounded-full text-primary mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Easy Ordering</h3>
                    <p className="text-sm text-gray-200">Create orders in just a few minutes with our simple step-by-step process.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#00FF99] p-2 rounded-full text-primary mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Verified Carriers</h3>
                    <p className="text-sm text-gray-200">All our carriers and loaders are thoroughly vetted for quality service.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-[#00FF99] p-2 rounded-full text-primary mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Transparent Pricing</h3>
                    <p className="text-sm text-gray-200">Know exactly what you're paying for with our upfront pricing system.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <p className="text-xs uppercase tracking-wide font-semibold text-[#00FF99]">TRUSTED BY THOUSANDS</p>
                <p className="text-3xl font-bold mt-2">4,500+ Successful Deliveries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
