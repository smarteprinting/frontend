import React from 'react';


const SelectHero = () => {
  return (
    <section
      className="flex flex-col items-center justify-center text-center min-h-[480px] pb-16 w-full px-2 relative overflow-hidden"
      style={{ width: '100%' }}
    >
      <picture>
        <source srcSet="/hero_background_image.webp" type="image/webp" />
        <img
          src="/hero_background_image.webp"
          alt="123.hp.com/setup | HP Printer Setup, Offline Fix & Troubleshooting"
          width="1920"
          height="380"
          fetchpriority="high"
          decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />
      </picture>
      <h2 className="relative z-10 text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-8 mb-4 drop-shadow leading-tight px-4">
        Smart Printer Setup & Troubleshooting
      </h2>
      <p className="relative z-10 text-gray-200 text-base sm:text-lg md:text-xl mb-4 sm:mb-6 max-w-xl mx-auto">
        Set Up & Troubleshoot Your Printer in Minutes
      </p>
      <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center mt-2 w-full max-w-xs sm:max-w-none mx-auto">
        <span className="flex items-center justify-center text-green-600 font-bold text-base sm:text-lg">
          <i className="fa-solid fa-bolt mr-2"></i> Quick Setup
        </span>
        <span className="flex items-center justify-center text-green-600 font-bold text-base sm:text-lg mt-2 sm:mt-0">
          <i className="fa-solid fa-screwdriver-wrench mr-2"></i> Easy Troubleshooting
        </span>
      </div>
    </section>
  );
};

export default SelectHero;
