import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumb, Steps, Form, Input, Select, Upload, Button, Card, Checkbox, Divider, Alert } from 'antd';
import { HomeOutlined, UserOutlined, UploadOutlined, RocketOutlined, CarOutlined, DollarOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'wouter';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { InsertUser, UserRole, VehicleType } from '@shared/schema';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const CarrierRegisterPage: React.FC = () => {
  const { t } = useLanguage();
  const { user, registerMutation } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [idFileList, setIdFileList] = useState<UploadFile[]>([]);
  const [insuranceFileList, setInsuranceFileList] = useState<UploadFile[]>([]);
  const [agreementChecked, setAgreementChecked] = useState(false);

  // If user is already logged in, redirect to profile
  React.useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const steps = [
    {
      title: t('carrierRegister.steps.basicInfo'),
      content: 'basic-info',
      icon: <UserOutlined />
    },
    {
      title: t('carrierRegister.steps.vehicleDetails'),
      content: 'vehicle-details',
      icon: <CarOutlined />
    },
    {
      title: t('carrierRegister.steps.documents'),
      content: 'documents',
      icon: <UploadOutlined />
    },
    {
      title: t('carrierRegister.steps.finish'),
      content: 'finish',
      icon: <RocketOutlined />
    }
  ];

  const nextStep = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleIdUploadChange: UploadProps['onChange'] = ({ fileList }) => {
    setIdFileList(fileList);
  };

  const handleInsuranceUploadChange: UploadProps['onChange'] = ({ fileList }) => {
    setInsuranceFileList(fileList);
  };

  const handleRegister = async () => {
    try {
      const values = await form.validateFields();
      
      // Prepare the user data
      const userData: InsertUser = {
        username: values.email,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        role: UserRole.CARRIER,
        vehicleType: values.vehicleType,
        vehicleCapacity: values.vehicleCapacity,
        workAreas: values.workAreas,
        description: values.description,
      };

      // Register the carrier
      registerMutation.mutate(userData, {
        onSuccess: () => {
          toast({
            title: t('carrierRegister.registrationSuccessful') || "Registration successful",
            description: t('carrierRegister.accountCreated') || "Your carrier account has been created. Please complete your profile.",
          });
          navigate('/profile');
        }
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Render different steps
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input placeholder="Your first name" />
              </Form.Item>
              
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter your last name' }]}
              >
                <Input placeholder="Your last name" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="your@email.com" />
              </Form.Item>
              
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input placeholder="Your phone number" />
              </Form.Item>
              
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please enter a password' }]}
                hasFeedback
              >
                <Input.Password placeholder="Create a strong password" />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm your password" />
              </Form.Item>
            </div>
            
            <Form.Item
              name="workAreas"
              label="Work Areas"
              rules={[{ required: true, message: 'Please select at least one work area' }]}
            >
              <Select 
                mode="multiple" 
                placeholder="Select areas where you can provide service"
              >
                <Option value="New York">New York</Option>
                <Option value="Los Angeles">Los Angeles</Option>
                <Option value="Chicago">Chicago</Option>
                <Option value="Houston">Houston</Option>
                <Option value="Phoenix">Phoenix</Option>
                <Option value="Philadelphia">Philadelphia</Option>
                <Option value="San Antonio">San Antonio</Option>
                <Option value="San Diego">San Diego</Option>
                <Option value="Dallas">Dallas</Option>
                <Option value="San Francisco">San Francisco</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="description"
              label="About You"
              rules={[{ required: true, message: 'Please provide a brief description about yourself' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="Describe your experience, specialties, and why customers should choose you as their carrier."
              />
            </Form.Item>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Vehicle Information</h2>
            
            <Form.Item
              name="vehicleType"
              label="Vehicle Type"
              rules={[{ required: true, message: 'Please select your vehicle type' }]}
            >
              <Select placeholder="Select vehicle type">
                <Option value={VehicleType.PICKUP}>Pickup Truck</Option>
                <Option value={VehicleType.BOX_TRUCK}>Box Truck</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="vehicleCapacity"
              label="Vehicle Capacity"
              rules={[{ required: true, message: 'Please enter your vehicle capacity' }]}
            >
              <Input placeholder="e.g., 1500 lbs, 16 ft" />
            </Form.Item>
            
            <Form.Item
              name="vehicleYear"
              label="Vehicle Year"
              rules={[{ required: true, message: 'Please enter vehicle year' }]}
            >
              <Input placeholder="e.g., 2019" />
            </Form.Item>
            
            <Form.Item
              name="vehicleMake"
              label="Vehicle Make"
              rules={[{ required: true, message: 'Please enter vehicle make' }]}
            >
              <Input placeholder="e.g., Ford, Toyota" />
            </Form.Item>
            
            <Form.Item
              name="vehicleModel"
              label="Vehicle Model"
              rules={[{ required: true, message: 'Please enter vehicle model' }]}
            >
              <Input placeholder="e.g., F-150, Tacoma" />
            </Form.Item>
            
            <Form.Item
              name="vehiclePhotos"
              label="Vehicle Photos"
              tooltip="Please upload clear photos of your vehicle from different angles"
            >
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Upload Photos (Max 3)</Button>
              </Upload>
            </Form.Item>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Required Documents</h2>
            
            <Alert
              message="Document Verification"
              description="We require these documents to verify your identity and ensure you meet legal requirements. All documents are securely stored and handled with strict confidentiality."
              type="info"
              showIcon
              className="mb-6"
            />
            
            <Form.Item
              name="driverLicense"
              label="Driver's License"
              rules={[{ required: true, message: 'Please upload your driver\'s license' }]}
              tooltip="Upload both front and back side of your valid driver's license"
            >
              <Upload
                listType="picture"
                fileList={idFileList}
                onChange={handleIdUploadChange}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Upload ID</Button>
              </Upload>
            </Form.Item>
            
            <Form.Item
              name="insurance"
              label="Insurance Documents"
              rules={[{ required: true, message: 'Please upload proof of insurance' }]}
              tooltip="Upload your current vehicle insurance documents"
            >
              <Upload
                listType="picture"
                fileList={insuranceFileList}
                onChange={handleInsuranceUploadChange}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Upload Insurance</Button>
              </Upload>
            </Form.Item>
            
            <Form.Item
              name="additionalDocuments"
              label="Additional Documents (Optional)"
              tooltip="You can upload any additional documents that may be relevant"
            >
              <Upload
                listType="picture"
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Upload Documents</Button>
              </Upload>
            </Form.Item>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <div className="my-8">
              <div className="bg-green-100 text-green-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <RocketOutlined style={{ fontSize: '36px' }} />
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Almost there!</h2>
              <p className="mb-8 text-gray-600 max-w-md mx-auto">
                Please review your information and agree to our terms and conditions to complete your registration.
              </p>
            </div>
            
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms and conditions')),
                },
              ]}
            >
              <Checkbox onChange={e => setAgreementChecked(e.target.checked)}>
                I agree to the <a href="/terms" target="_blank" className="text-primary">Terms and Conditions</a> and <a href="/privacy" target="_blank" className="text-primary">Privacy Policy</a>
              </Checkbox>
            </Form.Item>
            
            <Divider />
            
            <div className="flex justify-center">
              <Button
                type="primary"
                size="large"
                onClick={handleRegister}
                loading={registerMutation.isPending}
                disabled={!agreementChecked}
                className="px-8 py-2 h-auto"
              >
                Complete Registration
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Breadcrumb className="mb-8">
          <Breadcrumb.Item>
            <Link href="/">
              <a><HomeOutlined /> {t('header.home')}</a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/carriers">
              <a>{t('header.carriers')}</a>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('header.register')}</Breadcrumb.Item>
        </Breadcrumb>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{t('carrierRegister.title')}</h1>
            <p className="text-gray-600 mt-2">{t('carrierRegister.subtitle')}</p>
          </div>
          
          <Card className="shadow-md">
            <Steps current={currentStep} className="mb-8">
              {steps.map(item => (
                <Step key={item.title} title={item.title} icon={item.icon} />
              ))}
            </Steps>
            
            <Form
              form={form}
              layout="vertical"
              className="max-w-3xl mx-auto"
              initialValues={{ vehicleType: VehicleType.PICKUP }}
            >
              {renderStepContent()}
              
              <div className="flex justify-between mt-8">
                {currentStep > 0 && (
                  <Button onClick={prevStep}>
                    {t('carrierRegister.previous')}
                  </Button>
                )}
                
                {currentStep < steps.length - 1 && (
                  <Button type="primary" onClick={nextStep}>
                    {t('carrierRegister.next')}
                  </Button>
                )}
                
                {currentStep === 0 && (
                  <div />
                )}
              </div>
            </Form>
          </Card>
          
          <div className="mt-8 text-center text-gray-600">
            {t('carrierRegister.alreadyRegistered')} <Link href="/auth"><a className="text-primary">{t('carrierRegister.login')}</a></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrierRegisterPage;