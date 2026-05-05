import React from 'react';
import { useParams } from 'react-router-dom';
import ModelSearch from './ModelSearch';
import { normalizeSetupBrand } from '../../lib/setupBrandUtils';

const brandConfigs = {
  HP: {
    placeholder: 'e.g. "OfficeJet 9010"',
    bgImage: '/hero_background_image.jpg',
    searchButtonBgColor: 'bg-blue-600',
    searchButtonTextColor: 'text-white',
    searchButtonHoverColor: 'bg-blue-700',
  },
  Brother: {
    placeholder: 'e.g. "HL-L2350DW"',
    bgImage: '/brother-not-bg.png',
    searchButtonBgColor: 'bg-blue-900',
    searchButtonTextColor: 'text-white',
    searchButtonHoverColor: 'bg-blue-800',
  },
  EPSON: {
    placeholder: 'e.g. "EcoTank L3150"',
    bgImage: '/epson-blue-bg.png',
    searchButtonBgColor: 'bg-blue-950',
    searchButtonTextColor: 'text-white',
    searchButtonHoverColor: 'bg-blue-800',
  },
  Canon: {
    placeholder: 'e.g. "PIXMA G3000"',
    bgImage: '/canon-gemini2.jpeg',
    searchButtonBgColor: 'bg-red-700',
    searchButtonTextColor: 'text-white',
    searchButtonHoverColor: 'bg-red-600',
  },
};

export default function DynamicModelSearch() {
  const { brand: brandParam } = useParams();
  const brand = normalizeSetupBrand(brandParam);
  const config = (brand && brandConfigs[brand]) || brandConfigs.HP;

  return (
    <ModelSearch
      brand={brand || brandParam}
      placeholder={config.placeholder}
      bgImage={config.bgImage}
      searchButtonBgColor={config.searchButtonBgColor}
      searchButtonTextColor={config.searchButtonTextColor}
      searchButtonHoverColor={config.searchButtonHoverColor}
    />
  );
}
