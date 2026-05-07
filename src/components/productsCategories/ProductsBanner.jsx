import React from 'react';
import PropTypes from 'prop-types';

function ProductsBanner({ desktopImage, mobileImage, altText = "Products Banner" }) {
    return (
        <div className="w-full relative mb-8">
            {/* Desktop Image: Hidden on mobile, block on md and up */}
            <img
                src={desktopImage || "/assets/printerforsmallbusiness.png"}
                alt={altText}
                className="hidden md:block w-full h-auto"
            />

            {/* Mobile Image: Block on mobile, hidden on md and up */}
            <img
                src={mobileImage || "/assets/printer.webp"}
                alt={altText}
                className="block md:hidden w-full h-auto"
            />
        </div>
    );
}

ProductsBanner.propTypes = {
    desktopImage: PropTypes.string,
    mobileImage: PropTypes.string,
    altText: PropTypes.string,
};

export default ProductsBanner;