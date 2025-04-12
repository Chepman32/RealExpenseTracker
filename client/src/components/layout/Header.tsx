import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/hooks/use-auth';
import { Button, Dropdown, Menu, Avatar } from 'antd';
import { UserOutlined, MenuOutlined, GlobalOutlined, CaretDownOutlined, LogoutOutlined, ProfileOutlined, DashboardOutlined } from '@ant-design/icons';
import { FaTruck } from 'react-icons/fa';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Menus are now defined directly in the Dropdown components

  return (
    <header className="bg-primary sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="text-[#00FF99] font-bold text-2xl flex items-center">
              <FaTruck className="mr-2" />
              Haulino
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-white hover:text-[#00FF99] transition-colors">
            {t('header.home')}
          </Link>
          <Link href="/services" className="text-white hover:text-[#00FF99] transition-colors">
            {t('header.services')}
          </Link>
          <Link href="/carriers" className="text-white hover:text-[#00FF99] transition-colors">
            {t('header.carriers')}
          </Link>
          <Link href="/loaders" className="text-white hover:text-[#00FF99] transition-colors">
            {t('header.loaders')}
          </Link>
          <Link href="/about" className="text-white hover:text-[#00FF99] transition-colors">
            {t('header.about')}
          </Link>
        </nav>

        {/* User & Language Controls */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher */}
          <Dropdown menu={{ items: [
            {
              key: 'en',
              label: 'English',
              onClick: () => setLanguage('en'),
            },
            {
              key: 'ru',
              label: 'Русский',
              onClick: () => setLanguage('ru'),
            },
          ]}} placement="bottomRight">
            <Button 
              type="text" 
              className="text-white flex items-center" 
              icon={<GlobalOutlined />}
            >
              {language.toUpperCase()}
              <CaretDownOutlined />
            </Button>
          </Dropdown>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <Dropdown menu={{ items: [
                {
                  key: 'profile',
                  icon: <ProfileOutlined />,
                  label: 'Profile',
                  onClick: () => navigate('/profile'),
                },
                ...(user.role === 'admin' ? [
                  {
                    key: 'admin',
                    icon: <DashboardOutlined />,
                    label: 'Admin Dashboard',
                    onClick: () => navigate('/admin'),
                  }
                ] : []),
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Logout',
                  onClick: handleLogout,
                },
              ]}} placement="bottomRight">
                <div className="flex items-center cursor-pointer">
                  <Avatar 
                    src={user.profilePicture} 
                    icon={<UserOutlined />} 
                    className="bg-[#00FF99] text-primary"
                  />
                  <span className="ml-2 text-white hidden lg:inline">
                    {user.firstName} {user.lastName}
                  </span>
                  <CaretDownOutlined className="ml-1 text-white" />
                </div>
              </Dropdown>
            ) : (
              <>
                <Link href="/auth" className="text-white hover:text-[#00FF99] transition-colors">
                  {t('header.login')}
                </Link>
                <Link href="/auth" className="bg-[#00FF99] hover:bg-[#00CC7A] text-primary px-4 py-2 rounded-md transition-colors">
                  {t('header.signup')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            type="text" 
            className="md:hidden text-white"
            icon={<MenuOutlined />}
            onClick={toggleMobileMenu}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-white hover:text-[#00FF99] transition-colors py-2">
                {t('header.home')}
              </Link>
              <Link href="/services" className="text-white hover:text-[#00FF99] transition-colors py-2">
                {t('header.services')}
              </Link>
              <Link href="/carriers" className="text-white hover:text-[#00FF99] transition-colors py-2">
                {t('header.carriers')}
              </Link>
              <Link href="/loaders" className="text-white hover:text-[#00FF99] transition-colors py-2">
                {t('header.loaders')}
              </Link>
              <Link href="/about" className="text-white hover:text-[#00FF99] transition-colors py-2">
                {t('header.about')}
              </Link>
              
              {!user && (
                <div className="pt-2 flex space-x-2">
                  <Link href="/auth" className="text-white border border-white hover:bg-white hover:text-primary px-4 py-2 rounded-md transition-colors flex-1 text-center">
                    {t('header.login')}
                  </Link>
                  <Link href="/auth" className="bg-[#00FF99] hover:bg-[#00CC7A] text-primary px-4 py-2 rounded-md transition-colors flex-1 text-center">
                    {t('header.signup')}
                  </Link>
                </div>
              )}
              
              {user && (
                <div className="pt-2 flex flex-col space-y-2">
                  <Link href="/profile" className="text-white border border-white hover:bg-white hover:text-primary px-4 py-2 rounded-md transition-colors text-center">
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-white border border-white hover:bg-white hover:text-primary px-4 py-2 rounded-md transition-colors text-center">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    className="bg-[#00FF99] hover:bg-[#00CC7A] text-primary px-4 py-2 rounded-md transition-colors text-center"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
