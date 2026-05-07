import { lazy, Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { prefetchAllProducts } from './redux/actions/productActions';


import { ImagePreloadProvider } from './lib/ImagePreloadContext';
import TrailingSlashRedirect from './components/common/TrailingSlashRedirect';
import { isBot } from './lib/botUtils';


import Header from './components/Header';
import Footer from './components/Footer';
import HomeMain from './components/home/HomeMain';
import ScrollToTop from './components/ScrollToTop';

// Lazy-loaded routes
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));
const UnderConstruction = lazy(() => import('./components/common/UnderConstruction'));
const AboutMain = lazy(() => import('./components/about/AboutMain'));
const PrivacyPolicy = lazy(() => import('./components/privacyPolicy/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./components/TermsAndConditions'));

// Admin Imports (lazy)
const AdminLogin = lazy(() => import('./components/admin/Auth/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/Layout/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/admin/Pages/AdminDashboard'));
const AdminCategories = lazy(() => import('./components/admin/Pages/AdminCategories'));
const AdminProducts = lazy(() => import('./components/admin/Pages/AdminProducts'));
const AdminOrders = lazy(() => import('./components/admin/Pages/AdminOrders'));
const AdminCustomers = lazy(() => import('./components/admin/Pages/AdminCustomers'));
const AdminChat = lazy(() => import('./components/admin/Pages/AdminChat'));
const AdminAnalytics = lazy(() => import('./components/admin/Pages/AdminAnalytics'));
const AdminSettings = lazy(() => import('./components/admin/Pages/AdminSettings'));

// Product Category Imports (lazy)
const AllInOne = lazy(() => import('./components/productsCategories/all_InOne/AllInOne'));
const LargeFormat = lazy(() => import('./components/productsCategories/largeFormat/LargeFormat'));
const InkjetPrinters = lazy(() => import('./components/productsCategories/inkjetPrinters/InkjetPrinters'));
const LedPrinters = lazy(() => import('./components/productsCategories/ledPrinters/LedPrinters'));
const InkToner = lazy(() => import('./components/productsCategories/inkToner/InkToner'));
const CustomerService = lazy(() => import('./components/customerService/CustomerService1'));
const LaserPrinters = lazy(() => import('./components/productsCategories/laserPrinters/LaserPrinters'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./components/Checkout'));
const ProductDetails = lazy(() => import('./components/productsCategories/ProductDetails'));
const OrderDetails = lazy(() => import('./components/order/OrderDetails'));
const TrackOrder = lazy(() => import('./components/order/TrackOrder'));
const ReturnsAndExchanges = lazy(() => import('./components/order/ReturnsAndExchanges'));
const FAQMain = lazy(() => import('./components/faq/FAQMain'));
const CustomerMain = lazy(() => import('./components/customerService/CustomerMain'));
const RefundReturnPolicy = lazy(() => import('./components/privacyPolicy/RefundReturnPolicy'));
const ReturnExchangePolicy = lazy(() => import('./components/privacyPolicy/ReturnExchangePolicy'));
const ShippingPolicy = lazy(() => import('./components/privacyPolicy/ShippingPolicy'));
const CookiePolicy = lazy(() => import('./components/privacyPolicy/CookiePolicy'));
const CCPAPrivacyPolicy = lazy(() => import('./components/privacyPolicy/CCPAPrivacyPolicy'));
const AccessibilityStatement = lazy(() => import('./components/privacyPolicy/AccessibilityStatement'));
const Disclaimer = lazy(() => import('./components/privacyPolicy/Disclaimer'));

// Blog Imports (lazy)
const BlogsMain = lazy(() => import('./components/blogs/BlogsMain'));

const ChoosingPrinterGuide = lazy(() => import('./components/blogs/posts/ChoosingPrinterGuide'));
const PrinterMaintenanceGuide = lazy(() => import('./components/blogs/posts/PrinterMaintenanceGuide'));
const SavePrintingCostsGuide = lazy(() => import('./components/blogs/posts/SavePrintingCostsGuide'));
const PrintingMistakesGuide = lazy(() => import('./components/blogs/posts/PrintingMistakesGuide'));
const SmallBusinessPrintingGuide = lazy(() => import('./components/blogs/posts/SmallBusinessPrintingGuide'));

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

function App() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const dispatch = useDispatch();

    const normalizedPathname = location.pathname.replace(/\/+$/, '') || '/';



    useEffect(() => {
        const prefetch = () => dispatch(prefetchAllProducts());
        if ('requestIdleCallback' in window) {
            const id = requestIdleCallback(prefetch);
            return () => cancelIdleCallback(id);
        } else {
            const id = setTimeout(prefetch, 200);
            return () => clearTimeout(id);
        }
    }, [dispatch]);

    return (
        <ImagePreloadProvider>
            <TrailingSlashRedirect />
            <div className="flex flex-col min-h-screen">

                <Header />

                <ScrollToTop />

                <main className={`flex-grow ${isAdminRoute ? 'h-screen overflow-hidden' : ''}`}>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>


                            {/* Public Routes */}
                            <Route path="/" element={<HomeMain />} />
                            <Route path="/product-category/all-in-one-printers" element={<AllInOne />} />
                            <Route path="/product-category/large-format-printers" element={<LargeFormat />} />
                            <Route path="/product-category/inkjet-printers" element={<InkjetPrinters />} />
                            <Route path="/product-category/laser-printers" element={<LaserPrinters />} />
                            <Route path="/product-category/led-printers" element={<LedPrinters />} />
                            <Route path="/product-category/ink-toner" element={<InkToner />} />
                            <Route path="/customer-service" element={<CustomerMain />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/order/:id" element={<OrderDetails />} />
                            <Route path="/profile" element={<ProfilePage />} />

                            {/* Blogs */}
                            <Route path="/blogs" element={<BlogsMain />} />
                            <Route path="/blogs/choosing-right-printer-home-office" element={<ChoosingPrinterGuide />} />
                            <Route path="/blogs/printer-maintenance-guide" element={<PrinterMaintenanceGuide />} />
                            <Route path="/blogs/top-7-printing-mistakes" element={<PrintingMistakesGuide />} />
                            <Route path="/blogs/save-printing-costs-guide" element={<SavePrintingCostsGuide />} />
                            <Route path="/blogs/small-business-printing-essential-tools" element={<SmallBusinessPrintingGuide />} />

                            <Route path="/product/:productSlug" element={<ProductDetails />} />

                            {/*order*/}
                            <Route path="/track-order" element={<TrackOrder />} />
                            <Route path="/returns-exchanges" element={<ReturnsAndExchanges />} />
                            <Route path="/faq" element={<FAQMain />} />


                            {/* other static routes */}
                            <Route path="/about" element={<AboutMain />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                            <Route path="/refund-return-policy" element={<RefundReturnPolicy />} />
                            <Route path="/return-exchange-policy" element={<ReturnExchangePolicy />} />
                            <Route path="/shipping-policy" element={<ShippingPolicy />} />
                            <Route path="/cookie-policy" element={<CookiePolicy />} />
                            <Route path="/customer-service" element={<CustomerService />} />
                            <Route path="/ccpa-privacy-policy" element={<CCPAPrivacyPolicy />} />
                            <Route path="/accessibility-statement" element={<AccessibilityStatement />} />
                            <Route path="/disclaimer" element={<Disclaimer />} />

                            {/* Admin Routes */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="categories" element={<AdminCategories />} />
                                <Route path="products" element={<AdminProducts />} />
                                <Route path="orders" element={<AdminOrders />} />
                                <Route path="customers" element={<AdminCustomers />} />
                                <Route path="chat" element={<AdminChat />} />
                                <Route path="analytics" element={<AdminAnalytics />} />
                                <Route path="settings" element={<AdminSettings />} />
                                <Route path="*" element={<UnderConstruction />} />
                            </Route>

                            {/* Placeholder Routes for Public Site */}
                            <Route path="/shop" element={<UnderConstruction />} />
                            <Route path="/about" element={<UnderConstruction />} />
                            <Route path="/support" element={<UnderConstruction />} />
                            <Route path="/account" element={<UnderConstruction />} />
                            <Route path="/cart" element={<UnderConstruction />} />

                            {/* Catch-all */}
                            <Route path="*" element={<UnderConstruction />} />
                        </Routes>
                    </Suspense>
                </main>

                <Footer />
            </div>
        </ImagePreloadProvider>
    );
}

export default App;
