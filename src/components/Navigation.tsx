import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Target, TrendingUp, Users, BarChart3, HelpCircle } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Target },
    { path: '/fights', label: 'Fight Analytics', icon: TrendingUp },
    { path: '/accuracy', label: 'AI Accuracy', icon: BarChart3 },
    { path: '/how-it-works', label: 'How It Works', icon: HelpCircle },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 w-full z-50 h-16 bg-bg-near-black/90 backdrop-blur-md border-b border-border-subtle ${className}`}>
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src="/images/ufc_belt.png" 
                alt="UFC AI" 
                className="h-8 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <span className="text-xl font-display font-bold text-text-white">
                UFC AI Predictions
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-150 ${
                    isActivePath(path)
                      ? 'text-text-primary border-b-2 border-red-primary pb-1'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button className="btn-primary h-10 px-6 text-sm">
                Get Premium
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden btn-icon"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-bg-pure-black/95 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-bg-near-black border-b border-border-subtle p-6">
            <div className="space-y-4">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-150 ${
                    isActivePath(path)
                      ? 'bg-bg-hover text-text-primary border border-border-moderate'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-border-subtle">
                <button className="btn-primary w-full">
                  Get Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;