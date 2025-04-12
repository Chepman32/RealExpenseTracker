import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Form, Input, Radio, Select, DatePicker, Button, Steps, Upload, message } from 'antd';
import { UploadOutlined, BoxPlotOutlined, EnvironmentOutlined, CalendarOutlined, InboxOutlined } from '@ant-design/icons';
import { FaCouch, FaTv, FaBlender, FaBox, FaDolly, FaTruck, FaTruckPickup, FaTimes, FaUser, FaUserFriends, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { InsertOrder, CategoryType, VehicleType } from '@shared/schema';

const { Step } = Steps;
const { TextArea } = Input;
const { Dragger } = Upload;

const OrderForm: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: InsertOrder) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders/client'] });
      toast({
        title: "Order created",
        description: "Your order has been successfully created!",
      });
      navigate('/profile');
    },
    onError: (error: Error) => {
      toast({
        title: "Order creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const steps = [
    {
      title: t('orderForm.steps.items'),
      icon: <BoxPlotOutlined />,
    },
    {
      title: t('orderForm.steps.location'),
      icon: <EnvironmentOutlined />,
    },
    {
      title: t('orderForm.steps.schedule'),
      icon: <CalendarOutlined />,
    },
  ];

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: RcFile) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }
    
    if (fileList.length >= 5) {
      message.error('You can only upload up to 5 images!');
      return false;
    }
    
    return isLt5M;
  };

  const nextStep = () => {
    form.validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = (values: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to create an order",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    const orderData: InsertOrder = {
      clientId: user.id,
      categoryType: values.categoryType,
      description: values.description,
      pickupAddress: values.pickupAddress,
      deliveryAddress: values.deliveryAddress,
      scheduledDate: values.scheduledDate.toISOString(),
      vehicleType: values.vehicleType,
      needLoaders: values.needLoaders,
      photos: fileList.map(file => file.response?.url || ''),
    };

    createOrderMutation.mutate(orderData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{t('orderForm.itemSection.title')}</h3>
            
            {/* Item Category Selection */}
            <Form.Item name="categoryType" rules={[{ required: true, message: 'Please select a category' }]} className="mb-6">
              <Radio.Group className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Radio value={CategoryType.FURNITURE} className="hidden">
                  {t('orderForm.itemSection.categories.furniture')}
                </Radio>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#00FF99] hover:bg-gray-50 transition-colors text-center">
                  <label 
                    htmlFor="category-furniture" 
                    className="flex flex-col items-center cursor-pointer w-full h-full"
                    onClick={() => form.setFieldsValue({ categoryType: CategoryType.FURNITURE })}
                  >
                    <FaCouch className="text-2xl text-primary mb-2" />
                    <span className="text-sm font-medium">{t('orderForm.itemSection.categories.furniture')}</span>
                    <input type="radio" id="category-furniture" className="hidden" />
                  </label>
                </div>
                
                <Radio value={CategoryType.ELECTRONICS} className="hidden">
                  {t('orderForm.itemSection.categories.electronics')}
                </Radio>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#00FF99] hover:bg-gray-50 transition-colors text-center">
                  <label 
                    htmlFor="category-electronics" 
                    className="flex flex-col items-center cursor-pointer w-full h-full"
                    onClick={() => form.setFieldsValue({ categoryType: CategoryType.ELECTRONICS })}
                  >
                    <FaTv className="text-2xl text-primary mb-2" />
                    <span className="text-sm font-medium">{t('orderForm.itemSection.categories.electronics')}</span>
                    <input type="radio" id="category-electronics" className="hidden" />
                  </label>
                </div>
                
                <Radio value={CategoryType.APPLIANCES} className="hidden">
                  {t('orderForm.itemSection.categories.appliances')}
                </Radio>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#00FF99] hover:bg-gray-50 transition-colors text-center">
                  <label 
                    htmlFor="category-appliances" 
                    className="flex flex-col items-center cursor-pointer w-full h-full"
                    onClick={() => form.setFieldsValue({ categoryType: CategoryType.APPLIANCES })}
                  >
                    <FaBlender className="text-2xl text-primary mb-2" />
                    <span className="text-sm font-medium">{t('orderForm.itemSection.categories.appliances')}</span>
                    <input type="radio" id="category-appliances" className="hidden" />
                  </label>
                </div>
                
                <Radio value={CategoryType.BOXES} className="hidden">
                  {t('orderForm.itemSection.categories.boxes')}
                </Radio>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#00FF99] hover:bg-gray-50 transition-colors text-center">
                  <label 
                    htmlFor="category-boxes" 
                    className="flex flex-col items-center cursor-pointer w-full h-full"
                    onClick={() => form.setFieldsValue({ categoryType: CategoryType.BOXES })}
                  >
                    <FaBox className="text-2xl text-primary mb-2" />
                    <span className="text-sm font-medium">{t('orderForm.itemSection.categories.boxes')}</span>
                    <input type="radio" id="category-boxes" className="hidden" />
                  </label>
                </div>
                
                <Radio value={CategoryType.OTHER} className="hidden">
                  {t('orderForm.itemSection.categories.other')}
                </Radio>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#00FF99] hover:bg-gray-50 transition-colors text-center">
                  <label 
                    htmlFor="category-other" 
                    className="flex flex-col items-center cursor-pointer w-full h-full"
                    onClick={() => form.setFieldsValue({ categoryType: CategoryType.OTHER })}
                  >
                    <FaDolly className="text-2xl text-primary mb-2" />
                    <span className="text-sm font-medium">{t('orderForm.itemSection.categories.other')}</span>
                    <input type="radio" id="category-other" className="hidden" />
                  </label>
                </div>
              </Radio.Group>
            </Form.Item>
            
            {/* Item Description */}
            <Form.Item 
              name="description" 
              label={t('orderForm.itemSection.description')}
              rules={[{ required: true, message: 'Please provide a description' }]}
              className="mb-6"
            >
              <TextArea 
                rows={3} 
                placeholder={t('orderForm.itemSection.descriptionPlaceholder')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </Form.Item>
            
            {/* Photo Upload */}
            <Form.Item 
              label={t('orderForm.itemSection.photos')}
              className="mb-6"
            >
              <Dragger
                listType="picture"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={beforeUpload}
                multiple
                maxCount={5}
                showUploadList={{ showPreviewIcon: true, showDownloadIcon: false, showRemoveIcon: true }}
                className="border-2 border-dashed border-gray-300 rounded-md"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-2xl text-gray-400" />
                </p>
                <p className="text-sm text-gray-500">
                  {t('orderForm.itemSection.photosHint')} <span className="text-[#00FF99] font-medium">{t('orderForm.itemSection.browseFiles')}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {t('orderForm.itemSection.photoLimit')}
                </p>
              </Dragger>
            </Form.Item>
            
            {/* Vehicle Type */}
            <Form.Item 
              name="vehicleType" 
              label={t('orderForm.itemSection.vehicleType')}
              rules={[{ required: true, message: 'Please select a vehicle type' }]}
              className="mb-6"
            >
              <Radio.Group className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <Radio value={VehicleType.PICKUP} className="hidden">
                  {t('orderForm.itemSection.pickup.title')}
                </Radio>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#00FF99] hover:bg-gray-50 transition-colors">
                  <label 
                    htmlFor="vehicle-pickup" 
                    className="flex items-center cursor-pointer w-full"
                    onClick={() => form.setFieldsValue({ vehicleType: VehicleType.PICKUP })}
                  >
                    <FaTruckPickup className="text-xl text-primary mr-3" />
                    <div>
                      <span className="font-medium block">{t('orderForm.itemSection.pickup.title')}</span>
                      <span className="text-xs text-gray-500">{t('orderForm.itemSection.pickup.description')}</span>
                    </div>
                  </label>
                </div>
                
                <Radio value={VehicleType.BOX_TRUCK} className="hidden">
                  {t('orderForm.itemSection.boxTruck.title')}
                </Radio>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#00FF99] hover:bg-gray-50 transition-colors">
                  <label 
                    htmlFor="vehicle-box" 
                    className="flex items-center cursor-pointer w-full"
                    onClick={() => form.setFieldsValue({ vehicleType: VehicleType.BOX_TRUCK })}
                  >
                    <FaTruck className="text-xl text-primary mr-3" />
                    <div>
                      <span className="font-medium block">{t('orderForm.itemSection.boxTruck.title')}</span>
                      <span className="text-xs text-gray-500">{t('orderForm.itemSection.boxTruck.description')}</span>
                    </div>
                  </label>
                </div>
              </Radio.Group>
            </Form.Item>
            
            {/* Loader Options */}
            <Form.Item 
              name="needLoaders" 
              label={t('orderForm.itemSection.loaders')}
              rules={[{ required: true, message: 'Please select loader option' }]}
            >
              <Radio.Group className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Radio value={0} className="hidden">{t('orderForm.itemSection.noLoaders')}</Radio>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#00FF99] hover:bg-gray-50 transition-colors text-center">
                  <label 
                    htmlFor="loaders-none" 
                    className="flex flex-col items-center cursor-pointer w-full"
                    onClick={() => form.setFieldsValue({ needLoaders: 0 })}
                  >
                    <FaTimes className="text-2xl text-primary mb-1" />
                    <span className="text-sm font-medium">{t('orderForm.itemSection.noLoaders')}</span>
                  </label>
                </div>
                
                <Radio value={1} className="hidden">{t('orderForm.itemSection.oneLoader')}</Radio>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#00FF99] hover:bg-gray-50 transition-colors text-center">
                  <label 
                    htmlFor="loaders-one" 
                    className="flex flex-col items-center cursor-pointer w-full"
                    onClick={() => form.setFieldsValue({ needLoaders: 1 })}
                  >
                    <FaUser className="text-2xl text-primary mb-1" />
                    <span className="text-sm font-medium">{t('orderForm.itemSection.oneLoader')}</span>
                    <span className="text-xs text-gray-500">+$40{t('orderForm.itemSection.perHour')}</span>
                  </label>
                </div>
                
                <Radio value={2} className="hidden">{t('orderForm.itemSection.twoLoaders')}</Radio>
                <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#00FF99] hover:bg-gray-50 transition-colors text-center">
                  <label 
                    htmlFor="loaders-two" 
                    className="flex flex-col items-center cursor-pointer w-full"
                    onClick={() => form.setFieldsValue({ needLoaders: 2 })}
                  >
                    <FaUserFriends className="text-2xl text-primary mb-1" />
                    <span className="text-sm font-medium">{t('orderForm.itemSection.twoLoaders')}</span>
                    <span className="text-xs text-gray-500">+$80{t('orderForm.itemSection.perHour')}</span>
                  </label>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>
        );
      case 1:
        return (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{t('orderForm.steps.location')}</h3>
            
            <Form.Item
              name="pickupAddress"
              label="Pickup Address"
              rules={[{ required: true, message: 'Please enter pickup address' }]}
              className="mb-6"
            >
              <Input 
                placeholder="123 Main St, City, State, ZIP" 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </Form.Item>
            
            <Form.Item
              name="deliveryAddress"
              label="Delivery Address"
              rules={[{ required: true, message: 'Please enter delivery address' }]}
              className="mb-6"
            >
              <Input 
                placeholder="456 Other St, City, State, ZIP" 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </Form.Item>
          </div>
        );
      case 2:
        return (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{t('orderForm.steps.schedule')}</h3>
            
            <Form.Item
              name="scheduledDate"
              label="Scheduled Date and Time"
              rules={[{ required: true, message: 'Please select date and time' }]}
              className="mb-6"
            >
              <DatePicker 
                showTime 
                className="w-full border border-gray-300 rounded-md px-3 py-2" 
              />
            </Form.Item>
            
            <div className="border border-gray-300 rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2">Order Summary</h4>
              <dl className="space-y-1">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Item Category:</dt>
                  <dd>{form.getFieldValue('categoryType')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Vehicle Type:</dt>
                  <dd>{form.getFieldValue('vehicleType') === 'box_truck' ? 'Box Truck' : 'Pickup Truck'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Loaders:</dt>
                  <dd>{form.getFieldValue('needLoaders') || 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Pickup:</dt>
                  <dd>{form.getFieldValue('pickupAddress') || '-'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Delivery:</dt>
                  <dd>{form.getFieldValue('deliveryAddress') || '-'}</dd>
                </div>
              </dl>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between font-semibold">
                  <span>Estimated Price:</span>
                  <span>$150 - $200</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Final price will be determined based on the exact distance and time required.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="order-form" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">{t('orderForm.title')}</h2>
            <p className="text-gray-600">
              {t('orderForm.subtitle')}
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 md:p-8 shadow-sm">
            {/* Progress Steps */}
            <Steps
              current={currentStep}
              className="mb-8"
              items={steps}
            />

            {/* Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                needLoaders: 0,
                categoryType: CategoryType.FURNITURE,
                vehicleType: VehicleType.PICKUP,
              }}
            >
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {currentStep === 0 ? (
                  <Button type="default" className="bg-gray-200 text-gray-600 px-6 py-5 h-auto">
                    {t('orderForm.buttons.cancel')}
                  </Button>
                ) : (
                  <Button 
                    type="default" 
                    onClick={prevStep}
                    className="bg-gray-200 text-gray-600 px-6 py-5 h-auto"
                    icon={<FaArrowLeft className="mr-2" />}
                  >
                    {t('orderForm.buttons.back')}
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button 
                    type="primary" 
                    onClick={nextStep}
                    className="bg-[#00FF99] hover:bg-[#00CC7A] text-primary px-6 py-5 h-auto font-medium"
                  >
                    {t('orderForm.buttons.continue')}
                    <FaArrowRight className="ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={createOrderMutation.isPending}
                    className="bg-[#00FF99] hover:bg-[#00CC7A] text-primary px-6 py-5 h-auto font-medium"
                  >
                    {t('orderForm.buttons.submit')}
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;
