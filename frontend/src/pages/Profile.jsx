import React, { useState, useEffect } from 'react';
import { ProfileInfo } from '../components/ProfileComp';
import ProfileAddress from '../components/ProfileAddress';
import OrderHistory from '../components/OrderHistory';
import { FaUser, FaMapMarkerAlt, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';
import { Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { key: 'profile', label: 'My Profile', icon: <FaUser /> },
  { key: 'addresses', label: 'Delivery Address', icon: <FaMapMarkerAlt /> },
  { key: 'orders', label: 'My Orders', icon: <FaShoppingBag /> },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentTime, setCurrentTime] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "Guest"; 

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo />;
      case 'addresses':
        return <ProfileAddress />;
      case 'orders':
        return <OrderHistory />;
      default:
        return null;
    }
  };

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setIsMobileMenuOpen(false); 
  };

  const handleLogout = () => {
    // ✅ Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userData");

    // ✅ Redirect to login or homepage
    navigate("/"); 
  };

  const currentTabLabel = tabs.find(tab => tab.key === activeTab)?.label || 'Profile';

  return (
    <div className="min-h-screen bg-[#F8FBF7]">
      
      {/* Desktop Layout */}
      <div className="hidden md:flex">
        {/* Sidebar */}
        <aside className="w-64 bg-green-900 text-white rounded-r-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                {userName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{userName}</p>
                <p className="text-xs opacity-80">{currentTime}</p>
              </div>
            </div>

            <ul className="space-y-3">
              {tabs.map(tab => (
                <li key={tab.key}>
                  <button
                    className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg transition font-medium ${
                      activeTab === tab.key
                        ? 'bg-green-100 text-green-900'
                        : 'hover:bg-green-800 hover:text-white text-white'
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Logout Desktop */}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-4 py-2 mt-6 text-sm bg-green-800 rounded-lg hover:bg-green-700 transition"
          >
            <FaSignOutAlt /> Log Out
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Good {getGreeting()}, {userName.split(' ')[0]}!
          </h1>
          {renderTab()}
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Header */}
        <header className="bg-green-900 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md">
                {userName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-lg">{userName}</p>
                <p className="text-xs opacity-80">{currentTime}</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-green-800 rounded-lg transition-colors"
              aria-label="Profile Settings"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Settings className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="mt-4 bg-green-800 rounded-lg px-4 py-2">
            <h2 className="text-base font-medium text-green-100">{currentTabLabel}</h2>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="fixed top-0 right-0 h-full w-80 bg-green-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-green-700">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                    {userName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-lg font-bold">{userName}</span>
                    <p className="text-xs text-green-200">Profile Settings</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-green-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Nav */}
              <div className="p-6">
                <ul className="space-y-2">
                  {tabs.map(tab => (
                    <li key={tab.key}>
                      <button
                        className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                          activeTab === tab.key
                            ? 'bg-green-100 text-green-900 shadow-md'
                            : 'hover:bg-green-800 text-white'
                        }`}
                        onClick={() => handleTabClick(tab.key)}
                      >
                        <span className="text-lg">{tab.icon}</span>
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Logout Mobile */}
                <div className="border-t border-green-700 pt-6">
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 px-4 py-3 text-sm bg-red-600 hover:bg-red-700 rounded-xl transition-colors w-full font-medium"
                  >
                    <FaSignOutAlt className="text-lg" /> 
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="p-4">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Good {getGreeting()}, {userName.split(' ')[0]}!
            </h1>
          </div>
          {renderTab()}
        </main>
      </div>
    </div>
  );
};

// Helper
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
};

export default ProfilePage;
