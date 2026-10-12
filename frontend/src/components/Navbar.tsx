import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, User, LogOut, Search, ChevronDown, ChevronRight, 
  ExternalLink, Globe, Sparkles, Radio, Tv, Flame, BookOpen, 
  Layers, Activity, Compass, ArrowUpRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentRoute: string;
  onRouteChange: (route: string) => void;
  user: UserProfile | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenCase?: (caseId: string) => void;
  onOpenInAnalyze?: (variableId: string, regionId: string, startYear: number, endYear: number) => void;
}

// NASA Meatball SVG Component for instant, crisp offline-ready rendering
export const NasaMeatballSvg: React.FC<{ className?: string }> = ({ className = "w-11 h-9" }) => (
  <svg 
    viewBox="0 0 120 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-label="NASA Logo"
  >
    {/* Blue Sphere */}
    <circle cx="60" cy="50" r="46" fill="#0B3D91" />
    
    {/* Background Stars */}
    <circle cx="28" cy="30" r="1.5" fill="#FFFFFF" opacity="0.9" />
    <circle cx="38" cy="22" r="1.2" fill="#FFFFFF" opacity="0.8" />
    <circle cx="45" cy="35" r="1.5" fill="#FFFFFF" opacity="0.9" />
    <circle cx="78" cy="25" r="1.8" fill="#FFFFFF" opacity="0.95" />
    <circle cx="88" cy="38" r="1.2" fill="#FFFFFF" opacity="0.8" />
    <circle cx="95" cy="28" r="1.5" fill="#FFFFFF" opacity="0.9" />
    <circle cx="32" cy="65" r="1.5" fill="#FFFFFF" opacity="0.85" />
    <circle cx="25" cy="48" r="1" fill="#FFFFFF" opacity="0.75" />
    <circle cx="82" cy="70" r="1.6" fill="#FFFFFF" opacity="0.9" />
    <circle cx="92" cy="60" r="1.2" fill="#FFFFFF" opacity="0.8" />
    
    {/* Orbital Path (Ellipse) */}
    <ellipse 
      cx="60" 
      cy="50" 
      rx="49" 
      ry="17" 
      transform="rotate(-25 60 50)" 
      stroke="#FFFFFF" 
      strokeWidth="2.8" 
      strokeDasharray="95 18 10 12"
      fill="none"
    />

    {/* Red Vector Wing (Chevron) */}
    <path 
      d="M18 68 L60 14 L75 38 L98 62 L64 36 Z" 
      fill="#F64137" 
    />
    
    {/* NASA Text */}
    <text 
      x="60" 
      y="57" 
      textAnchor="middle" 
      fill="#FFFFFF" 
      fontSize="27" 
      fontWeight="900" 
      fontFamily="system-ui, -apple-system, sans-serif"
      letterSpacing="2.5"
      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
    >
      NASA
    </text>
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onRouteChange,
  user,
  onOpenLoginModal,
  onLogout,
  onOpenCase,
  onOpenInAnalyze
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('earth');

  const exploreRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on scroll or outside click
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (exploreRef.current && !exploreRef.current.contains(target)) {
        setIsExploreOpen(false);
      }
      if (newsRef.current && !newsRef.current.contains(target)) {
        setIsNewsOpen(false);
      }
      if (mediaRef.current && !mediaRef.current.contains(target)) {
        setIsMediaOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key to dismiss overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExploreOpen(false);
        setIsNewsOpen(false);
        setIsMediaOpen(false);
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (route: string) => {
    onRouteChange(route);
    setIsMobileMenuOpen(false);
    setIsExploreOpen(false);
    setIsNewsOpen(false);
    setIsMediaOpen(false);
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWorkbenchProtected = () => {
    if (!user) {
      onOpenLoginModal();
    } else {
      onRouteChange('analyze');
    }
    setIsExploreOpen(false);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  // Search dataset entries
  const searchItems = [
    { title: 'Global Surface Temperature Anomaly', type: 'variable', category: 'Atmosphere', id: 'temp' },
    { title: 'Arctic & Antarctic Sea-Ice Extent', type: 'variable', category: 'Cryosphere', id: 'sea_ice' },
    { title: 'GRACE Terrestrial Groundwater Storage', type: 'variable', category: 'Hydrosphere', id: 'groundwater' },
    { title: 'MODIS Normalized Difference Vegetation Index (NDVI)', type: 'variable', category: 'Biosphere', id: 'ndvi' },
    { title: 'Global Precipitation Measurement (GPM)', type: 'variable', category: 'Hydrosphere', id: 'precip' },
    { title: 'Aerosol Optical Depth (AOD)', type: 'variable', category: 'Atmosphere', id: 'aerosol' },
    { title: 'Sahel Greening vs. Mediterranean Drying', type: 'case', category: 'Opposite Trend', id: 'sahel-vs-mediterranean' },
    { title: 'Arctic Amplification vs. Antarctic Stability', type: 'case', category: 'Opposite Trend', id: 'arctic-vs-antarctic' },
    { title: 'Northwest India Groundwater vs. Precipitation', type: 'case', category: 'Decoupling', id: 'india-groundwater' },
    { title: 'Western U.S. Megadrought & Wildfire Smoke', type: 'case', category: 'Teleconnection', id: 'california-drought' },
    { title: 'Amazon Deforestation & Local Rainfall Shift', type: 'case', category: 'Land-Use Change', id: 'amazon-vegetation' },
    { title: 'Artemis Lunar Exploration Program', type: 'mission', category: 'NASA Mission', url: 'https://www.nasa.gov/humans-in-space/artemis/' },
    { title: 'James Webb Space Telescope (JWST)', type: 'mission', category: 'Deep Space', url: 'https://science.nasa.gov/mission/webb/' },
    { title: 'SPHEREx Near-Infrared All-Sky Survey', type: 'mission', category: 'Astrophysics', url: 'https://www.nasa.gov/missions/spherex/' },
    { title: 'International Space Station (ISS)', type: 'mission', category: 'Human Spaceflight', url: 'https://www.nasa.gov/international-space-station/' },
  ];

  const filteredSearchResults = searchQuery.trim() === '' 
    ? [] 
    : searchItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSearchResultClick = (item: typeof searchItems[0]) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (item.type === 'variable' && item.id) {
      if (onOpenInAnalyze) {
        onOpenInAnalyze(item.id, 'global', 1995, 2024);
      } else {
        handleWorkbenchProtected();
      }
    } else if (item.type === 'case' && item.id) {
      if (onOpenCase) {
        onOpenCase(item.id);
      } else {
        handleNavClick('trend-cases');
      }
    } else if (item.type === 'mission' && item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  // NASA.gov Explore Categories
  const exploreCategories = [
    { id: 'earth', name: 'Earth Science & Climate', count: '8 Topics' },
    { id: 'missions', name: 'NASA Missions', count: '10 Portals' },
    { id: 'humans', name: 'Humans in Space', count: '6 Programs' },
    { id: 'solar', name: 'The Solar System', count: '14 Worlds' },
    { id: 'universe', name: 'The Universe', count: '8 Realms' },
    { id: 'science', name: 'Science & Discovery', count: '9 Directorates' },
    { id: 'aeronautics', name: 'Aeronautics & X-Planes', count: '7 Hubs' },
    { id: 'technology', name: 'Technology & Spinoffs', count: '8 Fields' },
    { id: 'learning', name: 'Learning Resources', count: 'STEM & Educators' },
    { id: 'about', name: 'About NASA', count: 'Centers & Legacy' },
  ];

  return (
    <>
      {/* Official NASA Black-White-Red Header Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#000000]/95 backdrop-blur-md border-b border-[rgba(246,65,55,0.3)] shadow-[0_4px_30px_rgba(0,0,0,0.85)]' 
            : 'bg-[#000000] border-b border-[rgba(255,255,255,0.14)]'
        }`}
      >
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-[74px] flex items-center justify-between gap-4">
          
          {/* LEFT: Explore Mega Trigger & NASA Search Input */}
          <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
            {/* Explore Button */}
            <div className="relative" ref={exploreRef}>
              <button
                onClick={() => {
                  setIsExploreOpen(!isExploreOpen);
                  setIsNewsOpen(false);
                  setIsMediaOpen(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isExploreOpen
                    ? 'bg-[#f64137] text-[#ffffff] shadow-[0_0_15px_rgba(246,65,55,0.5)] border border-[#f64137]'
                    : 'bg-[#000000] text-[#ffffff] hover:bg-[#f64137] border-2 border-[#f64137] shadow-[0_0_10px_rgba(246,65,55,0.2)]'
                }`}
                aria-expanded={isExploreOpen}
                aria-label="Explore NASA and TrendLens Mega Menu"
              >
                <span>Explore</span>
                <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-transform duration-200 ${
                  isExploreOpen ? 'rotate-180 border-[#ffffff]' : 'border-current'
                }`}>
                  <ChevronDown size={11} strokeWidth={2.5} />
                </div>
              </button>
            </div>

            {/* Desktop Search Input */}
            <div className="relative hidden md:block w-48 lg:w-64" ref={searchRef}>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!isSearchOpen) setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search the universe..."
                  className="w-full h-9 pl-8 pr-3 bg-[#0d0d12] border border-[rgba(255,255,255,0.16)] rounded-md text-xs text-[#ffffff] placeholder-[#8e8e99] focus:outline-none focus:border-[#f64137] focus:ring-1 focus:ring-[#f64137] transition-all"
                />
                <Search size={14} className="absolute left-2.5 text-[#8e8e99] pointer-events-none" />
                {searchQuery && (
                  <button 
                    onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                    className="absolute right-2 text-[#8e8e99] hover:text-[#ffffff] text-xs cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-11 left-0 w-80 lg:w-96 bg-[#000000] border border-[rgba(246,65,55,0.4)] rounded-lg shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-mono text-[#f64137] uppercase tracking-wider mb-2 flex items-center justify-between font-bold">
                    <span>{searchQuery ? 'Search Results' : 'Suggested Inquiries'}</span>
                    <span className="text-[#8e8e99] lowercase text-[10px]">press ESC to close</span>
                  </div>

                  {searchQuery ? (
                    filteredSearchResults.length > 0 ? (
                      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                        {filteredSearchResults.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSearchResultClick(item)}
                            className="w-full text-left p-2 rounded bg-[#0d0d12] hover:bg-[rgba(246,65,55,0.18)] border border-transparent hover:border-[rgba(246,65,55,0.4)] transition-all flex items-center justify-between group cursor-pointer"
                          >
                            <div>
                              <div className="text-xs font-semibold text-[#ffffff] group-hover:text-[#f64137]">{item.title}</div>
                              <div className="text-[10px] text-[#d1d1d6] font-mono">{item.category} · {item.type.toUpperCase()}</div>
                            </div>
                            <ArrowUpRight size={13} className="text-[#8e8e99] group-hover:text-[#f64137]" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-[#d1d1d6] py-3 text-center">
                        No results for "{searchQuery}". Try searching for <span className="text-[#f64137]">temperature</span>, <span className="text-[#f64137]">sea ice</span>, or <span className="text-[#f64137]">Artemis</span>.
                      </div>
                    )
                  ) : (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {['Artemis', 'ISS', 'James Webb', 'Global Temp', 'Sea Ice Extent', 'Sahel Greening', 'Groundwater'].map(tag => (
                          <button
                            key={tag}
                            onClick={() => { setSearchQuery(tag); }}
                            className="px-2 py-1 rounded bg-[#0d0d12] hover:bg-[rgba(246,65,55,0.2)] text-[11px] text-[#ffffff] hover:text-[#f64137] border border-[rgba(255,255,255,0.1)] transition-colors cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-[rgba(255,255,255,0.12)] text-[11px] text-[#d1d1d6]">
                        Looking for scientific analysis? Open the{' '}
                        <button onClick={handleWorkbenchProtected} className="text-[#f64137] underline font-semibold cursor-pointer">
                          Trend Workbench
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Official NASA Meatball Insignia & TrendLens Brand */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group text-left select-none"
              title="Return to NASA TrendLens Home"
            >
              {/* NASA Meatball Logo */}
              <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <NasaMeatballSvg className="w-[54px] h-[44px] filter drop-shadow-[0_0_12px_rgba(246,65,55,0.3)]" />
              </div>

              {/* Brand Title */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base lg:text-lg tracking-tight text-[#ffffff] font-heading group-hover:text-[#f64137] transition-colors duration-200">
                    TrendLens
                  </span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[rgba(246,65,55,0.15)] text-[#f64137] border border-[rgba(246,65,55,0.4)] font-bold">
                    EARTH
                  </span>
                </div>
                <p className="text-[10px] text-[#d1d1d6] font-mono leading-none tracking-wide">
                  NASA Space Apps Challenge
                </p>
              </div>
            </button>
          </div>

          {/* RIGHT: Navigation Links, NASA Dropdowns & Auth Button */}
          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
            
            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'features', label: 'Features' },
                { id: 'trend-cases', label: 'Cases' },
              ].map(item => {
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative py-1.5 text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                      isActive ? 'text-[#ffffff] font-bold' : 'text-[#d1d1d6] hover:text-[#f64137]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f64137] rounded-full shadow-[0_0_8px_#f64137]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* NASA News, Multimedia & NASA+ (Only shown when viewing the Dashboard) */}
            {currentRoute === 'dashboard' && (
              <>
                {/* Official News & Events Dropdown */}
                <div className="relative hidden lg:block" ref={newsRef}>
                  <button
                    onClick={() => {
                      setIsNewsOpen(!isNewsOpen);
                      setIsMediaOpen(false);
                      setIsExploreOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#d1d1d6] hover:text-[#f64137] transition-colors cursor-pointer py-1.5"
                  >
                    <span>News & Events</span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${isNewsOpen ? 'rotate-180 text-[#f64137]' : ''}`} />
                  </button>

                  {isNewsOpen && (
                    <div className="absolute right-0 top-9 w-64 bg-[#000000] border border-[rgba(246,65,55,0.4)] rounded-lg shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.12)] mb-1">
                        <span className="text-[11px] font-mono text-[#f64137] uppercase font-bold tracking-wider">NASA Press & Events</span>
                      </div>
                      <div className="space-y-1">
                        {[
                          { label: 'News Releases', url: 'https://www.nasa.gov/news-release/' },
                          { label: 'Recently Published', url: 'https://www.nasa.gov/news/recently-published/' },
                          { label: 'NASA+ Video Series', url: 'https://plus.nasa.gov/series/' },
                          { label: 'Podcasts & Audio', url: 'https://www.nasa.gov/podcasts-and-audio/' },
                          { label: 'Upcoming Launches & Landings', url: 'https://www.nasa.gov/event-type/launch-schedule/' },
                          { label: 'NASA Virtual Guest Program', url: 'https://www.nasa.gov/nasa-virtual-guest-program/' },
                        ].map((item, idx) => (
                          <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2 rounded text-xs text-[#d1d1d6] hover:text-[#ffffff] hover:bg-[#121218] transition-colors group"
                          >
                            <span>{item.label}</span>
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-[#f64137] transition-opacity" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Official Multimedia Dropdown */}
                <div className="relative hidden lg:block" ref={mediaRef}>
                  <button
                    onClick={() => {
                      setIsMediaOpen(!isMediaOpen);
                      setIsNewsOpen(false);
                      setIsExploreOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#d1d1d6] hover:text-[#f64137] transition-colors cursor-pointer py-1.5"
                  >
                    <span>Multimedia</span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${isMediaOpen ? 'rotate-180 text-[#f64137]' : ''}`} />
                  </button>

                  {isMediaOpen && (
                    <div className="absolute right-0 top-9 w-60 bg-[#000000] border border-[rgba(246,65,55,0.4)] rounded-lg shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-[rgba(255,255,255,0.12)] mb-1">
                        <span className="text-[11px] font-mono text-[#f64137] uppercase font-bold tracking-wider">Multimedia & Visuals</span>
                      </div>
                      <div className="space-y-1">
                        {[
                          { label: 'NASA+ Streaming', url: 'https://plus.nasa.gov/' },
                          { label: 'Image of the Day', url: 'https://www.nasa.gov/image-of-the-day/' },
                          { label: 'NASA Live 24/7', url: 'https://www.nasa.gov/live' },
                          { label: '3D Science Resources', url: 'https://science.nasa.gov/3d-resources/' },
                          { label: 'NASA Interactive Globes', url: 'https://www.nasa.gov/interactives/' },
                        ].map((item, idx) => (
                          <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-3 py-2 rounded text-xs text-[#d1d1d6] hover:text-[#ffffff] hover:bg-[#121218] transition-colors group"
                          >
                            <span>{item.label}</span>
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-[#f64137] transition-opacity" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* NASA+ Streaming Link */}
                <a
                  href="https://plus.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[rgba(246,65,55,0.15)] hover:bg-[#f64137] border border-[rgba(246,65,55,0.4)] text-xs font-bold text-[#ffffff] transition-all hover:scale-105"
                >
                  <Tv size={12} className="text-[#ffffff]" />
                  <span>NASA+</span>
                </a>
              </>
            )}

            {/* Authentication / Dashboard Area */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md border text-xs font-mono transition-all duration-200 cursor-pointer ${
                      currentRoute === 'dashboard'
                        ? 'bg-[rgba(246,65,55,0.2)] border-[#f64137] text-[#ffffff] shadow-[0_0_12px_rgba(246,65,55,0.4)]'
                        : 'bg-[#0d0d12] border-[rgba(255,255,255,0.2)] hover:border-[#f64137] text-[#ffffff]'
                    }`}
                    title="Open Detective Dashboard"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-[rgba(246,65,55,0.3)] text-[#f64137] flex items-center justify-center text-[9px] font-bold">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold">{user.displayName.split(' ')[0]}</span>
                    <span className="hidden sm:inline text-[10px] text-[#f64137]">(Dashboard)</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-[#d1d1d6] hover:text-[#f64137] hover:bg-[#0d0d12] rounded transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="px-4 py-2 bg-gradient-to-r from-[#f64137] to-[#d62828] hover:from-[#ff4d42] hover:to-[#b60109] text-[#ffffff] font-bold text-xs rounded-md shadow-[0_0_15px_rgba(246,65,55,0.4)] hover:shadow-[0_0_25px_rgba(246,65,55,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <User size={13} />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex xl:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#d1d1d6] hover:text-[#f64137] hover:bg-[#0d0d12] rounded-lg transition-colors cursor-pointer"
                aria-label="Toggle Navigation Drawer"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* FULL-WIDTH NASA.GOV "EXPLORE" MEGA-MENU OVERLAY */}
        {isExploreOpen && (
          <div className="w-full bg-[#050508] border-b border-[rgba(246,65,55,0.35)] shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* COLUMN 1: Category Directory List (3 cols) */}
                <div className="lg:col-span-3 border-r border-[rgba(255,255,255,0.12)] pr-6 space-y-1">
                  <div className="text-[11px] font-mono text-[#f64137] uppercase tracking-wider font-bold mb-3 flex items-center justify-between">
                    <span>Explore Portals</span>
                    <span className="text-[10px] text-[#8e8e99]">12 Directorates</span>
                  </div>
                  {exploreCategories.map(cat => {
                    const isSelected = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onMouseEnter={() => setActiveCategory(cat.id)}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-center justify-between group cursor-pointer ${
                          isSelected
                            ? 'bg-[#121218] text-[#f64137] font-semibold border border-[rgba(246,65,55,0.4)] shadow-[0_0_12px_rgba(246,65,55,0.15)]'
                            : 'text-[#d1d1d6] hover:text-[#ffffff] hover:bg-[#0d0d12]'
                        }`}
                      >
                        <span className="text-xs">{cat.name}</span>
                        <ChevronRight size={13} className={`transition-transform duration-200 ${isSelected ? 'text-[#f64137] translate-x-1' : 'opacity-40 group-hover:opacity-80'}`} />
                      </button>
                    );
                  })}
                </div>

                {/* COLUMN 2: Sub-Topics for Active Category (5 cols) */}
                <div className="lg:col-span-5 pr-6 border-r border-[rgba(255,255,255,0.12)]">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[rgba(255,255,255,0.12)]">
                    <h3 className="text-sm font-bold text-[#ffffff] font-heading flex items-center gap-2">
                      <Sparkles size={14} className="text-[#f64137]" />
                      <span>{exploreCategories.find(c => c.id === activeCategory)?.name}</span>
                    </h3>
                    <span className="text-[11px] font-mono text-[#f64137] font-bold">DIRECT DIRECTORY ACCESS</span>
                  </div>

                  {activeCategory === 'earth' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[#0d0d12] border border-[rgba(255,255,255,0.12)] hover:border-[#f64137] transition-all group">
                        <div className="text-xs font-bold text-[#ffffff] group-hover:text-[#f64137] mb-1">
                          TrendLens Workbench
                        </div>
                        <p className="text-[11px] text-[#d1d1d6] mb-2 leading-relaxed">
                          Test statistical significance across 6 Earth system variables with Sen's slope.
                        </p>
                        <button
                          onClick={handleWorkbenchProtected}
                          className="text-[11px] font-bold text-[#f64137] flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          Launch Workbench <ArrowUpRight size={12} />
                        </button>
                      </div>

                      <div className="p-3 rounded-lg bg-[#0d0d12] border border-[rgba(255,255,255,0.12)] hover:border-[#f64137] transition-all group">
                        <div className="text-xs font-bold text-[#ffffff] group-hover:text-[#f64137] mb-1">
                          Opposite Trend Cases
                        </div>
                        <p className="text-[11px] text-[#d1d1d6] mb-2 leading-relaxed">
                          Explore Sahel vs Mediterranean, Arctic vs Antarctic, and India Groundwater.
                        </p>
                        <button
                          onClick={() => handleNavClick('trend-cases')}
                          className="text-[11px] font-bold text-[#f64137] flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          View 6 Cases <ArrowUpRight size={12} />
                        </button>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2 pt-2">
                        {[
                          { title: 'NASA Climate Change & Global Warming', url: 'https://science.nasa.gov/climate-change/' },
                          { title: 'Earth Science in Action & Satellite Sensors', url: 'https://science.nasa.gov/earth/in-action/' },
                          { title: 'NASA Earthdata Open Archive Portal', url: 'https://science.nasa.gov/earth/data/' },
                          { title: 'NASA GIBS Global Imagery Browse Services', url: 'https://www.earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs' },
                        ].map((lnk, idx) => (
                          <a
                            key={idx}
                            href={lnk.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 rounded text-xs text-[#d1d1d6] hover:text-[#ffffff] hover:bg-[#121218] transition-all group"
                          >
                            <span>{lnk.title}</span>
                            <ExternalLink size={12} className="text-[#f64137] opacity-0 group-hover:opacity-100" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCategory === 'missions' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { name: 'Artemis Moon Mission', url: 'https://www.nasa.gov/humans-in-space/artemis/' },
                          { name: 'James Webb (JWST)', url: 'https://science.nasa.gov/mission/webb/' },
                          { name: 'Hubble Space Telescope', url: 'https://science.nasa.gov/mission/hubble/' },
                          { name: 'International Space Station', url: 'https://www.nasa.gov/international-space-station/' },
                          { name: 'SPHEREx Infrared Survey', url: 'https://www.nasa.gov/missions/spherex/' },
                          { name: 'GRACE-FO Gravity & Water', url: 'https://gracefo.jpl.nasa.gov/' },
                          { name: 'PACE Ocean Ecology', url: 'https://pace.oceansciences.org/' },
                          { name: 'SWOT Surface Water', url: 'https://swot.jpl.nasa.gov/' },
                        ].map((m, idx) => (
                          <a
                            key={idx}
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded bg-[#0d0d12] hover:bg-[rgba(246,65,55,0.15)] text-[#d1d1d6] hover:text-[#f64137] border border-[rgba(255,255,255,0.12)] transition-all flex items-center justify-between"
                          >
                            <span>{m.name}</span>
                            <ArrowUpRight size={12} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCategory !== 'earth' && activeCategory !== 'missions' && (
                    <div className="space-y-2.5">
                      <p className="text-xs text-[#d1d1d6] leading-relaxed">
                        Access direct research documentation and space agency assets for {exploreCategories.find(c => c.id === activeCategory)?.name}.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <a
                          href="https://science.nasa.gov/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded bg-[#0d0d12] text-[#ffffff] hover:text-[#f64137] border border-[rgba(255,255,255,0.15)] flex items-center justify-between"
                        >
                          <span>Science Directorates</span>
                          <ExternalLink size={12} />
                        </a>
                        <a
                          href="https://www.nasa.gov/learning-resources/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded bg-[#0d0d12] text-[#ffffff] hover:text-[#f64137] border border-[rgba(255,255,255,0.15)] flex items-center justify-between"
                        >
                          <span>Open Learning Resources</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                      <div className="p-3 rounded bg-[rgba(246,65,55,0.1)] border border-[rgba(246,65,55,0.3)] text-xs text-[#ffffff]">
                        NASA TrendLens connects Earth System science with Space Apps data challenge requirements.
                      </div>
                    </div>
                  )}
                </div>

                {/* COLUMN 3: Featured Stories from NASA.gov HTML (4 cols) */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="text-[11px] font-mono text-[#f64137] uppercase tracking-wider font-bold mb-1 flex items-center justify-between">
                    <span>Featured NASA Missions</span>
                    <span className="text-[10px] text-[#8e8e99]">NASA.GOV FEED</span>
                  </div>

                  {/* Feature Card 1: SPHEREx */}
                  <a
                    href="https://www.nasa.gov/missions/spherex/nasas-spherex-telescope-sees-menagerie-of-brown-dwarfs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 p-2.5 rounded-lg bg-[#0d0d12] hover:bg-[rgba(246,65,55,0.12)] border border-[rgba(255,255,255,0.12)] hover:border-[#f64137] transition-all group"
                  >
                    <div className="w-20 h-16 rounded overflow-hidden flex-shrink-0 bg-[#000000]">
                      <img
                        src="https://www.nasa.gov/wp-content/uploads/2026/10/e1-pia23684.jpg?resize=300,169"
                        alt="SPHEREx Telescope"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-[#f64137] uppercase font-bold">5 MIN READ · ASTROPHYSICS</div>
                      <div className="text-xs font-semibold text-[#ffffff] group-hover:text-[#f64137] line-clamp-2">
                        NASA’s SPHEREx Telescope Sees Menagerie of Brown Dwarfs
                      </div>
                    </div>
                  </a>

                  {/* Feature Card 2: SpaceX 35th */}
                  <a
                    href="https://www.nasa.gov/news-release/nasa-sets-coverage-for-spacex-35th-station-resupply-launch-arrival/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 p-2.5 rounded-lg bg-[#0d0d12] hover:bg-[rgba(246,65,55,0.12)] border border-[rgba(255,255,255,0.12)] hover:border-[#f64137] transition-all group"
                  >
                    <div className="w-20 h-16 rounded overflow-hidden flex-shrink-0 bg-[#000000]">
                      <img
                        src="https://www.nasa.gov/wp-content/uploads/2026/10/spacex-35.jpg?resize=300,169"
                        alt="SpaceX Resupply"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517976487508-b118b6fc8e5c?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-[#f64137] uppercase font-bold">4 MIN READ · LAUNCH COVERAGE</div>
                      <div className="text-xs font-semibold text-[#ffffff] group-hover:text-[#f64137] line-clamp-2">
                        NASA Sets Coverage for SpaceX 35th Station Resupply Launch
                      </div>
                    </div>
                  </a>

                  {/* Close Explore Button */}
                  <div className="pt-2 text-right">
                    <button
                      onClick={() => setIsExploreOpen(false)}
                      className="text-xs text-[#d1d1d6] hover:text-[#f64137] underline cursor-pointer"
                    >
                      Close Explore Menu
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </header>

      {/* MOBILE FULL DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[74px] bg-[#000000]/98 backdrop-blur-xl z-40 overflow-y-auto px-5 py-6 space-y-6 border-b border-[rgba(246,65,55,0.3)] animate-in slide-in-from-top duration-200">
          
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NASA variables, missions..."
              className="w-full h-11 pl-9 pr-3 bg-[#0d0d12] border border-[rgba(255,255,255,0.16)] rounded-lg text-sm text-[#ffffff] placeholder-[#8e8e99] focus:outline-none focus:border-[#f64137]"
            />
            <Search size={16} className="absolute left-3 top-3 text-[#8e8e99]" />
          </div>

          {searchQuery && filteredSearchResults.length > 0 && (
            <div className="p-3 rounded-lg bg-[#0d0d12] border border-[rgba(246,65,55,0.35)] space-y-2">
              <div className="text-xs font-mono text-[#f64137] uppercase font-bold">Matching Results</div>
              {filteredSearchResults.slice(0, 5).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSearchResultClick(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-1.5 border-b border-[rgba(255,255,255,0.1)] text-xs text-[#ffffff] hover:text-[#f64137] flex items-center justify-between"
                >
                  <span>{item.title}</span>
                  <ArrowUpRight size={12} className="text-[#f64137]" />
                </button>
              ))}
            </div>
          )}

          {/* Primary TrendLens Route Links */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-[#f64137] uppercase tracking-wider mb-2 font-bold">TrendLens Navigation</div>
            {[
              { id: 'home', label: 'Platform Home' },
              { id: 'about', label: 'Scientific Methodology' },
              { id: 'features', label: 'Analytical Capabilities' },
              { id: 'trend-cases', label: 'Guided Case Studies' },
              ...(user ? [{ id: 'dashboard', label: 'Detective Dashboard' }] : [])
            ].map(item => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#121218] text-[#ffffff] border border-[rgba(246,65,55,0.4)] font-bold'
                      : 'text-[#d1d1d6] hover:text-[#f64137] hover:bg-[#0d0d12]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#f64137] shadow-[0_0_8px_#f64137]" />}
                </button>
              );
            })}
          </div>

          {/* NASA External Quick Hubs (Only shown on Dashboard) */}
          {currentRoute === 'dashboard' && (
            <div className="pt-4 border-t border-[rgba(255,255,255,0.12)] space-y-2">
              <div className="text-[11px] font-mono text-[#f64137] uppercase tracking-wider font-bold">NASA.gov Portals</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a 
                  href="https://www.nasa.gov/news-release/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 rounded bg-[#0d0d12] text-[#d1d1d6] hover:text-[#ffffff] flex items-center justify-between border border-[rgba(255,255,255,0.1)]"
                >
                  <span>News & Events</span>
                  <ExternalLink size={12} />
                </a>
                <a 
                  href="https://plus.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 rounded bg-[#0d0d12] text-[#d1d1d6] hover:text-[#ffffff] flex items-center justify-between border border-[rgba(255,255,255,0.1)]"
                >
                  <span>NASA+ Video</span>
                  <ExternalLink size={12} />
                </a>
                <a 
                  href="https://science.nasa.gov/climate-change/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 rounded bg-[#0d0d12] text-[#d1d1d6] hover:text-[#ffffff] flex items-center justify-between border border-[rgba(255,255,255,0.1)]"
                >
                  <span>Climate Science</span>
                  <ExternalLink size={12} />
                </a>
                <a 
                  href="https://www.nasa.gov/image-of-the-day/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 rounded bg-[#0d0d12] text-[#d1d1d6] hover:text-[#ffffff] flex items-center justify-between border border-[rgba(255,255,255,0.1)]"
                >
                  <span>Image of Day</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

          {/* Mobile Auth Button */}
          <div className="pt-4 border-t border-[rgba(255,255,255,0.12)]">
            {user ? (
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#0d0d12] border border-[rgba(246,65,55,0.3)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[rgba(246,65,55,0.2)] text-[#f64137] flex items-center justify-center font-bold text-xs">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#ffffff]">{user.displayName}</div>
                    <div className="text-[10px] text-[#8e8e99] font-mono">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-[#d1d1d6] hover:text-[#f64137]"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLoginModal();
                }}
                className="w-full py-3 bg-gradient-to-r from-[#f64137] to-[#d62828] text-[#ffffff] font-bold text-sm rounded-lg text-center shadow-[0_0_20px_rgba(246,65,55,0.4)] cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>

        </div>
      )}
    </>
  );
};
