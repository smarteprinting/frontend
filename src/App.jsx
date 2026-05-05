import { lazy, Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { prefetchAllProducts } from './redux/actions/productActions';


import { getAdminApiBase } from './lib/adminApiBase';
import { getInitialSetupVisibility, writeSetupSettingsCache, readSetupSettingsCache } from './lib/setupSettingsCache';
import { ImagePreloadProvider } from './lib/ImagePreloadContext';
import TrailingSlashRedirect from './components/common/TrailingSlashRedirect';
import { isBot } from './lib/botUtils';

import SelectYourBrand from './components/setupSelect/SelectYourBrand';
const SetupSelect = lazy(() => import('./components/setupSelect/SetupSelect'));
const DynamicModelSearch = lazy(() => import('./components/setupSelect/DynamicModelSearch'));
const CompleteSetup = lazy(() => import('./components/setupSelect/CompleteSetup'));
const InstallationFailedPage = lazy(() => import('./components/setupSelect/InstallationFailedPage'));
const SettingsManagement = lazy(() => import('./components/setupSelect/SettingsManagement'));
const SimpleAdminLogin = lazy(() => import('./components/setupSelect/SimpleAdminLogin'));
const SetupHeader = lazy(() => import('./components/setupSelect/SetupHeader'));

function ModelSearchTrailingSlashRedirect() {
    const { brand } = useParams();
    return <Navigate to={`/model-search/${brand}/`} replace />;
}

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

    // Setup flow states
    const isSelectYourBrandPage = normalizedPathname === '/select-your-brand' || normalizedPathname.startsWith('/select-your-brand/');
    const setupRoutePrefixes = [
        '/smart-printer-setup-guide',

        '/model-search',
        '/complete-setup',
        '/installation-failed',
    ];
    const isSetupRoute = setupRoutePrefixes.some(
        (prefix) => normalizedPathname === prefix || normalizedPathname.startsWith(`${prefix}/`)
    );

    const setupVisInit = useMemo(() => getInitialSetupVisibility(), []);
    const [showHeader, setShowHeader] = useState(setupVisInit.showHeader);
    const [showLogo, setShowLogo] = useState(setupVisInit.showLogo);
    const [allowModelSearch, setAllowModelSearch] = useState(setupVisInit.allowModelSearch);
    const [showInstallationFailed, setShowInstallationFailed] = useState(setupVisInit.showInstallationFailed);
    const [showCompleteSetup, setShowCompleteSetup] = useState(setupVisInit.showCompleteSetup);
    const [allowSelectYourBrandFlow, setAllowSelectYourBrandFlow] = useState(setupVisInit.allowSelectYourBrandFlow);
    const [adminStatus, setAdminStatus] = useState('');
    const [setupAdminInfo, setSetupAdminInfo] = useState(() => {
        const stored = localStorage.getItem('setupAdminInfo');
        return stored ? JSON.parse(stored) : null;
    });
    const [setupLoginError, setSetupLoginError] = useState('');
    const intervalRef = useRef();

    const handleSetupAdminLogin = (username, password) => {
        const apiUrl = getAdminApiBase();
        setSetupLoginError('');
        fetch(`${apiUrl}/admin/login-simple`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Login failed.');
                return data;
            })
            .then(data => {
                if (data.token) {
                    setSetupAdminInfo(data);
                    localStorage.setItem('setupAdminInfo', JSON.stringify(data));
                } else {
                    setSetupLoginError('Invalid credentials.');
                }
            })
            .catch((error) => setSetupLoginError(error?.message || 'Login failed.'));
    };

    useEffect(() => {
        if (!showInstallationFailed && location.pathname === '/installation-failed/') {
            // navigate placeholder
        }
    }, [showInstallationFailed, location.pathname]);

    useEffect(() => {
        const fetchHeader = () => {
            const apiUrl = getAdminApiBase();
            fetch(`${apiUrl}/admin/header-visibility`)
                .then(res => res.json())
                .then((data) => {
                    setShowHeader(Boolean(data.showHeader));
                    setShowLogo(Boolean(data.showLogo));
                    setAllowModelSearch(data.allowModelSearch !== false);
                    setShowInstallationFailed(data.showInstallationFailed !== false);
                    setShowCompleteSetup(data.showCompleteSetup !== false);
                    setAllowSelectYourBrandFlow(data.allowSelectYourBrandFlow !== false);
                    writeSetupSettingsCache(data);
                })
                .catch(() => {
                    const c = readSetupSettingsCache();
                    if (!c) return;
                    setShowHeader(c.showHeader);
                    setShowLogo(c.showLogo);
                    setAllowModelSearch(c.allowModelSearch);
                    setShowInstallationFailed(c.showInstallationFailed);
                    setShowCompleteSetup(c.showCompleteSetup);
                    setAllowSelectYourBrandFlow(c.allowSelectYourBrandFlow);
                });
        };
        fetchHeader();
        intervalRef.current = setInterval(fetchHeader, 10000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const updateHeaderSettings = (updatedFields) => {
        const apiUrl = getAdminApiBase();
        const token = setupAdminInfo?.token;
        if (!token) {
            setAdminStatus('Failed to update settings. Please login again.');
            return;
        }
        setAdminStatus('');
        fetch(`${apiUrl}/admin/header-visibility`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                showHeader,
                showLogo,
                allowModelSearch,
                showInstallationFailed,
                showCompleteSetup,
                allowSelectYourBrandFlow,
                ...updatedFields,
            })
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed to update settings.');
                return data;
            })
            .then((data) => {
                if (!data.success) {
                    setAdminStatus('Failed to update settings.');
                    return;
                }
                setAdminStatus('Settings updated successfully.');
                if (data.settings) {
                    const s = data.settings;
                    setShowHeader(Boolean(s.showHeader));
                    setShowLogo(Boolean(s.showLogo));
                    setAllowModelSearch(s.allowModelSearch !== false);
                    setShowInstallationFailed(s.showInstallationFailed !== false);
                    setShowCompleteSetup(s.showCompleteSetup !== false);
                    setAllowSelectYourBrandFlow(s.allowSelectYourBrandFlow !== false);
                    writeSetupSettingsCache(s);
                }
            })
            .catch((error) => setAdminStatus(error?.message || 'Failed to update settings.'));
    };


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

                {!isAdminRoute && !isSetupRoute && !isSelectYourBrandPage && <Header />}
                {isSetupRoute && (showHeader || isBot()) && normalizedPathname !== '/smart-printer-setup-guide' && normalizedPathname !== '/smart-printer-setup-guide/' && (
                    <SetupHeader showLogo={showLogo} showHeader={showHeader} />
                )}

                <ScrollToTop />

                <main className={`flex-grow ${isAdminRoute ? 'h-screen overflow-hidden' : ''}`}>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>

                            {/* Setup Routes */}
                            <Route path="/settings-management" element={
                                setupAdminInfo ? (
                                    <SettingsManagement
                                        showHeader={showHeader} setShowHeader={(val) => updateHeaderSettings({ showHeader: val })}
                                        showLogo={showLogo} setShowLogo={(val) => updateHeaderSettings({ showLogo: val })}
                                        allowModelSearch={allowModelSearch} setAllowModelSearch={(val) => updateHeaderSettings({ allowModelSearch: val })}
                                        showInstallationFailed={showInstallationFailed} setShowInstallationFailed={(val) => updateHeaderSettings({ showInstallationFailed: val })}
                                        showCompleteSetup={showCompleteSetup} setShowCompleteSetup={(val) => updateHeaderSettings({ showCompleteSetup: val })}
                                        allowSelectYourBrandFlow={allowSelectYourBrandFlow}
                                        setAllowSelectYourBrandFlow={(val) => updateHeaderSettings({ allowSelectYourBrandFlow: val })}
                                        adminStatus={adminStatus}
                                    />
                                ) : (
                                    <SimpleAdminLogin onLogin={handleSetupAdminLogin} error={setupLoginError} />
                                )
                            } />

                            <Route path="/smart-printer-setup-guide/" element={<SetupSelect />} />
                            <Route path="/smart-printer-setup-guide" element={<Navigate to="/smart-printer-setup-guide/" replace />} />
                            {/* <Route path="/printer-setup-guide/" element={<SetupSelect />} />
                            <Route path="/printer-setup-guide" element={<Navigate to="/printer-setup-guide/" replace />} /> */}
                            <Route path="/model-search/:brand/" element={<DynamicModelSearch />} />
                            <Route path="/model-search/:brand" element={<ModelSearchTrailingSlashRedirect />} />
                            <Route path="/complete-setup/:brand/" element={(showCompleteSetup || isBot()) ? <CompleteSetup /> : <Navigate to="/smart-printer-setup-guide/" replace />} />
                            <Route path="/select-your-brand/" element={<SelectYourBrand allowSelectYourBrandFlow={allowSelectYourBrandFlow} />} />
                            <Route path="/select-your-brand" element={<Navigate to="/select-your-brand/" replace />} />
                            <Route path="/complete-setup/" element={(showCompleteSetup || isBot()) ? <CompleteSetup showCompleteSetup={showCompleteSetup} /> : <Navigate to="/smart-printer-setup-guide/" replace />} />
                            <Route path="/complete-setup" element={<Navigate to="/complete-setup/" replace />} />
                            <Route path="/installation-failed/:brand/" element={(showInstallationFailed || isBot()) ? <InstallationFailedPage /> : <Navigate to="/smart-printer-setup-guide/" replace />} />
                            <Route path="/installation-failed/:brand" element={<Navigate to="/installation-failed/:brand/" replace />} />

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

                {!isAdminRoute && !isSetupRoute && !isSelectYourBrandPage && <Footer />}
            </div>
        </ImagePreloadProvider>
    );
}

export default App;
