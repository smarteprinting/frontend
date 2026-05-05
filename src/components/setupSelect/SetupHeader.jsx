import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { normalizeSetupBrand } from '../../lib/setupBrandUtils';

// ✅ Brand Logos
const brandLogos = {
  HP: '/hp-bg.png',
  Brother: '/brother-logo-bg.png',
  EPSON: '/epson-bg.png',
  Canon: '/canon-bg.png',
};

// ✅ Dynamic Nav Items per Brand
const brandNavItems = {
  HP: ['Home', 'Inkjet', 'Laser', 'Envy'],
  Brother: ['Home', 'Ink Tank', 'Laser', 'Mono'],
  Canon: ['Home', 'Inkjet', 'Laser', 'PIXMA'],
  EPSON: ['Home', 'Inkjet', 'Laser', 'Envy'],
};

const SetupHeader = ({ showLogo = true, showHeader = true }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // ✅ Extract brand from URL
  const brandMatch = location.pathname.match(
    /(?:complete-setup|model-search|installation-failed)\/([^/]+)/i
  );
  const rawBrand = brandMatch ? brandMatch[1] : null;

  const brandKey = normalizeSetupBrand(rawBrand);

  // ✅ Logo
  const logoSrc =
    brandKey && brandLogos[brandKey]
      ? brandLogos[brandKey]
      : '/hp-logo.svg';

  // ✅ Nav Items (fallback to HP)
  const navItems =
    brandKey && brandNavItems[brandKey]
      ? brandNavItems[brandKey]
      : brandNavItems['HP'];

  if (!showHeader) return null;

  return (
    <header className="w-full h-20 bg-white py-2 flex items-center px-[15vw] border-b border-gray-100 shadow-sm relative z-50">
      <nav className="w-full flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center">
          {showLogo && (
            <img
              src={logoSrc}
              alt="Brand Logo"
              style={{
                width: '120px',
                height: '48px',
                objectFit: 'contain',
              }}
            />
          )}
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex flex-row gap-10 items-center ml-auto">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={`#`}
                className="text-gray-800 text-lg font-normal hover:font-semibold transition"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center ml-auto">
          <button
            type="button"
            aria-label="Open menu"
            className="focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-7 h-7 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="absolute top-20 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 z-50 md:hidden animate-fadeIn">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={`#`}
                  className="text-gray-800 text-lg font-normal hover:font-semibold transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default SetupHeader;