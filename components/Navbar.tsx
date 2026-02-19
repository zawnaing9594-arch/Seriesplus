import React, { useState } from 'react';
import { Search, Bell, Menu, X, UploadCloud, Settings, Lock, LogOut, User } from 'lucide-react';
import { SiteConfig } from '../types';

interface NavbarProps {
  onOpenAdmin: () => void;
  onAdminLogin: () => void;
  isAdmin: boolean;
  siteConfig: SiteConfig;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onAdminLogin, isAdmin, siteConfig, onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm transition-all duration-300 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Desktop Menu */}
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth'})}>
              {siteConfig.siteLogoUrl ? (
                  <img src={siteConfig.siteLogoUrl} alt="Logo" className="h-8 w-auto object-contain" />
              ) : null}
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 hidden md:block">
                {siteConfig.siteName}
              </span>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                <a href="#" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:text-blue-400 transition">Home</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">TV Shows</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Movies</a>
              </div>
            </div>
          </div>

          {/* Right Icons / Search */}
          <div className="flex items-center space-x-4 md:space-x-6">
             {/* Search Bar */}
            <div className={`flex items-center bg-gray-800/50 rounded-full border border-gray-700 transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64 px-3 py-1' : 'w-8 h-8 md:w-auto bg-transparent border-none'}`}>
                <Search 
                    className={`w-5 h-5 text-gray-300 cursor-pointer ${!isSearchOpen && 'hover:text-white'}`} 
                    onClick={() => {
                         if (!isSearchOpen) setIsSearchOpen(true);
                    }}
                />
                <input 
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                    className={`bg-transparent border-none outline-none text-white text-sm ml-2 w-full ${!isSearchOpen ? 'hidden' : 'block'}`}
                    autoFocus={isSearchOpen}
                />
                {isSearchOpen && (
                    <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" onClick={() => { setSearchQuery(''); onSearch(''); setIsSearchOpen(false); }} />
                )}
            </div>

             {isAdmin && (
                 <button 
                    onClick={onOpenAdmin}
                    className="hidden md:flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-full text-sm font-medium transition animate-fade-in-up"
                 >
                    <Settings className="w-4 h-4" />
                    <span>Manage</span>
                 </button>
             )}
            
            {/* User Avatar / Admin Login Button */}
            <button 
                onClick={onAdminLogin}
                className="flex items-center space-x-2 cursor-pointer focus:outline-none"
                title={isAdmin ? "Logout Admin" : "Admin Login (PIN: 1234)"}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-colors border ${isAdmin ? 'bg-indigo-600 border-indigo-400 hover:bg-indigo-700' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}`}>
                {isAdmin ? 'A' : <User className="w-4 h-4" />}
              </div>
            </button>
            
             {/* Mobile menu button */}
            <div className="flex md:hidden">
                <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 absolute w-full border-b border-gray-800 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="#" className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium">TV Shows</a>
            <a href="#" className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium">Movies</a>
            
            <div className="border-t border-gray-800 my-2 pt-2">
                {isAdmin && (
                    <button 
                        onClick={() => { onOpenAdmin(); setIsMobileMenuOpen(false); }}
                        className="w-full text-left text-indigo-400 block px-3 py-2 rounded-md text-base font-medium flex items-center mb-1"
                    >
                        <Settings className="w-4 h-4 mr-2" /> Admin Dashboard
                    </button>
                )}
                
                <button
                    onClick={() => {
                        onAdminLogin();
                        setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium flex items-center ${isAdmin ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:bg-gray-800'}`}
                >
                    {isAdmin ? (
                        <><LogOut className="w-4 h-4 mr-2" /> Logout Admin</>
                    ) : (
                        <><Lock className="w-4 h-4 mr-2" /> Admin Login</>
                    )}
                </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;