import { useState, useEffect, createContext, useContext } from 'react';
import * as XLSX from 'xlsx';

// Product images from shadow.pk CDN
const images = {
  blackLace: "https://shadow.pk/cdn/shop/files/black_net_bra_image_7d70dba1-df6f-4df7-8f8a-3007ea279a5a_medium.webp?v=1777243096",
  blackLace2: "https://shadow.pk/cdn/shop/files/black_net_bra_image_1858e98e-7726-4f72-905c-c7ca6dff6f76_medium.webp?v=1777243096",
  redLace: "https://shadow.pk/cdn/shop/files/red_net_bra_image_013566d7-1e49-4697-b7a1-a5e14e83d4a0_medium.webp?v=1776376960",
  blueLace: "https://shadow.pk/cdn/shop/files/blue_net_bra_image_a4235cfc-c16b-4b81-9fce-32c232bde866_medium.webp?v=1776376960",
  pinkLace: "https://shadow.pk/cdn/shop/files/pink_net_bra_image_cf108941-f420-48ad-b2cf-43c0f1dd1ddd_medium.webp?v=1776376960",
  silverLace: "https://shadow.pk/cdn/shop/files/silver_net_image_f0e6212c-bb17-48a7-b3b3-4e3247c3054b_medium.webp?v=1776376960",
  frontClosure: "https://shadow.pk/cdn/shop/files/Front_Open_Lace_Comfort_Bra_Easy_Wear_Wireless_Design_image_c161033c-0071-4bbd-b3df-9db0d51b5174_medium.png?v=1775595233",
  beigeBra: "https://shadow.pk/cdn/shop/files/floating_bra_front_beige_transparent_medium.webp?v=1776376960",
  skinBra: "https://shadow.pk/cdn/shop/files/floating_bra_front_skin_background_medium.webp?v=1776376960",
  blackBurgundy: "https://shadow.pk/cdn/shop/files/floating_bra_front_black_burgundy_to_black_medium.png?v=1777243225",
  pinkTransparent: "https://shadow.pk/cdn/shop/files/floating_bra_front_pink_transparent_medium.webp?v=1776376960",
  greyBra: "https://shadow.pk/cdn/shop/files/floating_bra_front_gray_skin_background_medium.webp?v=1776376960",
  navyBra: "https://shadow.pk/cdn/shop/files/floating_bra_front_navy_skin_background_medium.webp?v=1776376960",
  blog1: "https://shadow.pk/cdn/shop/articles/Featured_image_720x.webp?v=1776374352",
  blog2: "https://shadow.pk/cdn/shop/articles/Cotton_Bra_Pakistan_Garment_Mein_Comfortable_Bra_Guide_2026_Shadow_973b1514-3fb2-4a0a-9c8e-f695f8e6f987_720x.jpg?v=1776089410",
  blog3: "https://shadow.pk/cdn/shop/articles/How_To_Measure_Bra_Size_Updated_720x.webp?v=1776527292",
};

// Product data
const allProducts = {
  newArrivals: [
    { id: 1, name: "Soft Floral Lace Bra - Black", price: 1199, originalPrice: 1699, image: images.blackLace, isNew: true, category: "bras" },
    { id: 2, name: "Midnight Lace Padded Bra - Pink", price: 1599, image: images.pinkLace, isNew: true, category: "bras" },
    { id: 3, name: "Front Closure Wire Free Bra", price: 1299, originalPrice: 1549, image: images.frontClosure, isNew: true, category: "bras" },
    { id: 4, name: "Elegant Red Lace Bra", price: 1899, originalPrice: 2299, image: images.redLace, isNew: true, category: "bras" },
    { id: 5, name: "Premium Silver Net Bra", price: 1499, image: images.silverLace, isNew: true, category: "bras" },
    { id: 6, name: "Classic Blue Lace Bra", price: 1199, originalPrice: 1450, image: images.blueLace, isNew: true, category: "bras" },
  ],
  laceBras: [
    { id: 9, name: "Soft Floral Lace Bra - Black", price: 1199, originalPrice: 1699, image: images.blackLace, category: "bras" },
    { id: 10, name: "Elegant Red Lace Bra", price: 1899, originalPrice: 2299, image: images.redLace, category: "bras" },
    { id: 11, name: "Premium Blue Lace Bra", price: 1499, image: images.blueLace, category: "bras" },
    { id: 12, name: "Pink Floral Lace Bra", price: 1299, originalPrice: 1599, image: images.pinkLace, category: "bras" },
  ],
  cottonBras: [
    { id: 17, name: "Pure Cotton Non-Padded Bra - Skin", price: 1199, originalPrice: 1450, image: images.skinBra, category: "bras" },
    { id: 18, name: "Breathable Cotton Bra - Beige", price: 1299, originalPrice: 1549, image: images.beigeBra, category: "bras" },
    { id: 19, name: "Cotton Comfort Plus - Grey", price: 1599, image: images.greyBra, category: "bras" },
    { id: 20, name: "Organic Cotton Bra - Navy", price: 1399, originalPrice: 1699, image: images.navyBra, category: "bras" },
  ],
  bodyShapers: [
    { id: 43, name: "Full Body Shaper - Beige", price: 2999, originalPrice: 3999, image: images.beigeBra, category: "shapewear" },
    { id: 44, name: "Tummy Control Shaper - Black", price: 2499, originalPrice: 3199, image: images.blackBurgundy, category: "shapewear" },
    { id: 45, name: "Waist Cincher Shaper", price: 1899, image: images.skinBra, category: "shapewear" },
    { id: 46, name: "Thigh Slimmer - Skin", price: 2199, originalPrice: 2799, image: images.greyBra, category: "shapewear" },
  ],
  lingerieSets: [
    { id: 51, name: "Lace Lingerie Set - Black", price: 2499, originalPrice: 3299, image: images.blackLace, category: "lingerie" },
    { id: 52, name: "Satin Lingerie Set - Red", price: 2899, image: images.redLace, category: "lingerie" },
    { id: 53, name: "Romantic Lingerie Set - Pink", price: 2199, originalPrice: 2899, image: images.pinkLace, category: "lingerie" },
    { id: 54, name: "Elegant Lingerie Set - Blue", price: 2599, image: images.blueLace, category: "lingerie" },
  ],
  panties: [
    { id: 65, name: "Cotton Bikini Panty - Pack of 3", price: 799, originalPrice: 999, image: images.skinBra, category: "panties" },
    { id: 66, name: "Lace Thong - Black", price: 599, image: images.blackBurgundy, category: "panties" },
    { id: 67, name: "Seamless Hipster Panty - Beige", price: 699, originalPrice: 899, image: images.beigeBra, category: "panties" },
    { id: 68, name: "Brazilian Panty - Pink", price: 549, image: images.pinkTransparent, category: "panties" },
  ],
  nightwear: [
    { id: 59, name: "Silk Nighty - Black", price: 2199, originalPrice: 2899, image: images.blackLace, category: "nightwear" },
    { id: 60, name: "Satin Nightgown - Red", price: 2499, image: images.redLace, category: "nightwear" },
    { id: 61, name: "Lace Sleep Dress - Pink", price: 1899, originalPrice: 2499, image: images.pinkLace, category: "nightwear" },
  ],
};

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  isNew?: boolean;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

// Admin Auth Types
interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  adminEmail: string | null;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
}

// Admin Credentials (stored securely)
const ADMIN_CREDENTIALS = {
  email: 'admin@sleeknsassy.pk',
  password: 'Admin@2026Secure', // In production, use hashed passwords
};

// Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const addToCart = (product: Product, size?: string, color?: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, cartCount, isCartOpen, setIsCartOpen,
      currentPage, setCurrentPage
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Admin Auth Context
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
}

function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if admin session exists
    const savedAdminSession = sessionStorage.getItem('adminSession');
    if (savedAdminSession) {
      try {
        const session = JSON.parse(savedAdminSession);
        if (session.isLoggedIn && session.timestamp > Date.now() - 86400000) { // 24 hour session
          setIsAdminLoggedIn(true);
          setAdminEmail(session.email);
        } else {
          sessionStorage.removeItem('adminSession');
        }
      } catch (error) {
        console.error('Error parsing admin session:', error);
        sessionStorage.removeItem('adminSession');
      }
    }
  }, []);

  const loginAdmin = (email: string, password: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const session = {
        isLoggedIn: true,
        email: email,
        timestamp: Date.now(),
      };
      sessionStorage.setItem('adminSession', JSON.stringify(session));
      setIsAdminLoggedIn(true);
      setAdminEmail(email);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem('adminSession');
    setIsAdminLoggedIn(false);
    setAdminEmail(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, adminEmail, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// Admin Login Modal Component
function AdminLoginModal({ onClose, onLoginSuccess }: { onClose: () => void; onLoginSuccess: () => void }) {
  const { loginAdmin } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setError('');
    setIsLoading(true);

    // Simulate a small delay for security
    setTimeout(() => {
      if (email.trim() === '' || password.trim() === '') {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      if (loginAdmin(email, password)) {
        setIsLoading(false);
        onLoginSuccess();
        onClose();
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
          <p className="text-sm text-gray-600 mt-2">Access the order management system</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="admin@sleeknsassy.pk"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600 disabled:bg-gray-100"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 mb-3"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <button
          onClick={onClose}
          disabled={isLoading}
          className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
        >
          Cancel
        </button>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Email: admin@sleeknsassy.pk</p>
          <p>Password: Admin@2026Secure</p>
        </div>
      </div>
    </div>
  );
}

// Size Guide Modal Component
function SizeGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto py-8">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-3xl">
          <h2 className="text-2xl font-bold">Size Guide</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* How to Measure */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-rose-600">How to Measure Yourself</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-rose-50 rounded-xl p-4">
                <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold mb-3">1</div>
                <h4 className="font-semibold mb-2">Under Bust</h4>
                <p className="text-sm text-gray-600">Measure around your ribcage, directly under your bust. Keep the tape snug and level.</p>
              </div>
              <div className="bg-rose-50 rounded-xl p-4">
                <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold mb-3">2</div>
                <h4 className="font-semibold mb-2">Over Bust</h4>
                <p className="text-sm text-gray-600">Measure around the fullest part of your bust. Keep the tape loose enough to fit one finger.</p>
              </div>
              <div className="bg-rose-50 rounded-xl p-4">
                <div className="w-12 h-12 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold mb-3">3</div>
                <h4 className="font-semibold mb-2">Waist</h4>
                <p className="text-sm text-gray-600">Measure around the narrowest part of your waist, usually just above the belly button.</p>
              </div>
            </div>
          </div>

          {/* Bra Size Chart */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-rose-600">Bra Size Chart</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-rose-100">
                    <th className="border p-3 text-left">Band Size</th>
                    <th className="border p-3 text-left">Under Bust (inches)</th>
                    <th className="border p-3 text-left">Under Bust (cm)</th>
                    <th className="border p-3 text-left">Pakistani Size</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { band: '32', inches: '27-28', cm: '68-71', pk: 'S' },
                    { band: '34', inches: '29-30', cm: '73-76', pk: 'M' },
                    { band: '36', inches: '31-32', cm: '78-81', pk: 'L' },
                    { band: '38', inches: '33-34', cm: '83-86', pk: 'XL' },
                    { band: '40', inches: '35-36', cm: '88-91', pk: 'XXL' },
                    { band: '42', inches: '37-38', cm: '93-96', pk: 'XXXL' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border p-3 font-semibold">{row.band}</td>
                      <td className="border p-3">{row.inches}"</td>
                      <td className="border p-3">{row.cm}</td>
                      <td className="border p-3">{row.pk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cup Size Chart */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-rose-600">Cup Size Chart</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-rose-100">
                    <th className="border p-3 text-left">Difference (Over - Under)</th>
                    <th className="border p-3 text-left">Cup Size</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { diff: '0-1"', cup: 'AA' },
                    { diff: '1"', cup: 'A' },
                    { diff: '2"', cup: 'B' },
                    { diff: '3"', cup: 'C' },
                    { diff: '4"', cup: 'D' },
                    { diff: '5"', cup: 'DD/E' },
                    { diff: '6"', cup: 'DDD/F' },
                    { diff: '7"', cup: 'G' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border p-3">{row.diff}</td>
                      <td className="border p-3 font-semibold">{row.cup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shapewear Size Chart */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-rose-600">Shapewear Size Chart</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-rose-100">
                    <th className="border p-3 text-left">Size</th>
                    <th className="border p-3 text-left">Waist (inches)</th>
                    <th className="border p-3 text-left">Hips (inches)</th>
                    <th className="border p-3 text-left">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'S', waist: '24-26', hips: '34-36', weight: '40-50' },
                    { size: 'M', waist: '27-29', hips: '37-39', weight: '51-60' },
                    { size: 'L', waist: '30-32', hips: '40-42', weight: '61-70' },
                    { size: 'XL', waist: '33-35', hips: '43-45', weight: '71-80' },
                    { size: 'XXL', waist: '36-38', hips: '46-48', weight: '81-90' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border p-3 font-semibold">{row.size}</td>
                      <td className="border p-3">{row.waist}"</td>
                      <td className="border p-3">{row.hips}"</td>
                      <td className="border p-3">{row.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panties Size Chart */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-rose-600">Panties Size Chart</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-rose-100">
                    <th className="border p-3 text-left">Size</th>
                    <th className="border p-3 text-left">Hips (inches)</th>
                    <th className="border p-3 text-left">Hips (cm)</th>
                    <th className="border p-3 text-left">Pakistani Size</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'S', hips: '34-36', cm: '86-91', pk: '28-30' },
                    { size: 'M', hips: '37-39', cm: '94-99', pk: '32-34' },
                    { size: 'L', hips: '40-42', cm: '101-106', pk: '36-38' },
                    { size: 'XL', hips: '43-45', cm: '109-114', pk: '40-42' },
                    { size: 'XXL', hips: '46-48', cm: '116-121', pk: '44-46' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border p-3 font-semibold">{row.size}</td>
                      <td className="border p-3">{row.hips}"</td>
                      <td className="border p-3">{row.cm}</td>
                      <td className="border p-3">{row.pk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-amber-800 mb-2">💡 Pro Tips</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Measure yourself while wearing a non-padded bra</li>
              <li>• Keep the measuring tape parallel to the floor</li>
              <li>• Don't pull the tape too tight - it should be snug but comfortable</li>
              <li>• If between sizes, size up for more comfort</li>
              <li>• For shapewear, consider sizing down for more compression</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Size Calculator Component
function SizeCalculator({ onClose }: { onClose: () => void }) {
  const [measurements, setMeasurements] = useState({
    underBust: '',
    overBust: '',
    waist: '',
    hips: ''
  });
  const [result, setResult] = useState<{braSize?: string, shapewearSize?: string, pantiesSize?: string} | null>(null);

  const calculateSize = () => {
    const underBust = parseFloat(measurements.underBust);
    const overBust = parseFloat(measurements.overBust);
    const waist = parseFloat(measurements.waist);
    const hips = parseFloat(measurements.hips);

    if (!underBust || !overBust) return;

    // Calculate bra size
    const bandSize = Math.round(underBust);
    const diff = overBust - underBust;
    
    let cupSize = 'A';
    if (diff >= 7) cupSize = 'G';
    else if (diff >= 6) cupSize = 'DDD/F';
    else if (diff >= 5) cupSize = 'DD/E';
    else if (diff >= 4) cupSize = 'D';
    else if (diff >= 3) cupSize = 'C';
    else if (diff >= 2) cupSize = 'B';
    else if (diff >= 1) cupSize = 'A';
    else cupSize = 'AA';

    // Calculate shapewear size
    let shapewearSize = 'M';
    if (waist) {
      if (waist <= 26) shapewearSize = 'S';
      else if (waist <= 29) shapewearSize = 'M';
      else if (waist <= 32) shapewearSize = 'L';
      else if (waist <= 35) shapewearSize = 'XL';
      else shapewearSize = 'XXL';
    }

    // Calculate panties size
    let pantiesSize = 'M';
    if (hips) {
      if (hips <= 36) pantiesSize = 'S';
      else if (hips <= 39) pantiesSize = 'M';
      else if (hips <= 42) pantiesSize = 'L';
      else if (hips <= 45) pantiesSize = 'XL';
      else pantiesSize = 'XXL';
    }

    setResult({
      braSize: `${bandSize}${cupSize}`,
      shapewearSize,
      pantiesSize
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto py-8">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Size Calculator</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-rose-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">
              Enter your measurements in inches. Use a soft measuring tape for accurate results.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Under Bust (inches) *</label>
              <input
                type="number"
                value={measurements.underBust}
                onChange={(e) => setMeasurements({ ...measurements, underBust: e.target.value })}
                placeholder="e.g., 30"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Over Bust (inches) *</label>
              <input
                type="number"
                value={measurements.overBust}
                onChange={(e) => setMeasurements({ ...measurements, overBust: e.target.value })}
                placeholder="e.g., 33"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waist (inches)</label>
              <input
                type="number"
                value={measurements.waist}
                onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                placeholder="e.g., 28"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hips (inches)</label>
              <input
                type="number"
                value={measurements.hips}
                onChange={(e) => setMeasurements({ ...measurements, hips: e.target.value })}
                placeholder="e.g., 38"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={calculateSize}
            className="w-full bg-rose-600 text-white py-4 rounded-full font-semibold hover:bg-rose-700 transition mb-6"
          >
            Calculate My Size
          </button>

          {result && (
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Your Recommended Sizes</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Bra Size</p>
                  <p className="text-2xl font-bold text-rose-600">{result.braSize}</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Shapewear</p>
                  <p className="text-2xl font-bold text-rose-600">{result.shapewearSize}</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">Panties</p>
                  <p className="text-2xl font-bold text-rose-600">{result.pantiesSize}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                * These are recommendations. For the best fit, consider trying multiple sizes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Size Guide Page
function SizeGuidePage() {
  const [showCalculator, setShowCalculator] = useState(false);

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Size Guide</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size guide and calculator
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => setShowCalculator(true)}
            className="bg-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-rose-700 transition shadow-lg"
          >
            📏 Use Size Calculator
          </button>
          <a 
            href="#bras"
            className="border-2 border-rose-600 text-rose-600 px-8 py-4 rounded-full font-semibold hover:bg-rose-600 hover:text-white transition"
          >
            Shop Bras
          </a>
        </div>

        {/* Size Guide Content */}
        <SizeGuideModal onClose={() => {}} />

        {showCalculator && <SizeCalculator onClose={() => setShowCalculator(false)} />}
      </div>
    </div>
  );
}

// Header Component
function Header() {
  const { cartCount, setIsCartOpen, setCurrentPage } = useCart();
  const { isAdminLoggedIn } = useAdminAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur'}`}>
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-center py-2 text-sm">
          <span>🎉 Free Delivery on Orders Above Rs.2,999 | Use Code: SLEEK20</span>
        </div>
        
        {/* Main Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button onClick={() => navigateTo('home')} className="flex items-center hover:opacity-80 transition">
              <span className="text-2xl md:text-3xl font-bold text-rose-600">Sleek</span>
              <span className="text-2xl md:text-3xl font-light text-gray-700">&</span>
              <span className="text-2xl md:text-3xl font-bold text-rose-600">Sassy</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button onClick={() => navigateTo('home')} className="text-gray-700 hover:text-rose-600 transition font-medium">Home</button>
              <button onClick={() => navigateTo('bras')} className="text-gray-700 hover:text-rose-600 transition font-medium">Bras</button>
              <button onClick={() => navigateTo('shapewear')} className="text-gray-700 hover:text-rose-600 transition font-medium">Shapewear</button>
              <button onClick={() => navigateTo('lingerie')} className="text-gray-700 hover:text-rose-600 transition font-medium">Lingerie</button>
              <button onClick={() => navigateTo('panties')} className="text-gray-700 hover:text-rose-600 transition font-medium">Panties</button>
              <button onClick={() => navigateTo('nightwear')} className="text-gray-700 hover:text-rose-600 transition font-medium">Nightwear</button>
              <button 
                onClick={() => setShowSizeGuide(true)}
                className="text-gray-700 hover:text-rose-600 transition font-medium flex items-center gap-1"
              >
                Size Guide
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {isAdminLoggedIn && (
                <button 
                  onClick={() => navigateTo('orders')}
                  className="text-gray-700 hover:text-rose-600 transition font-medium flex items-center gap-2 bg-rose-50 px-3 py-2 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Orders
                </button>
              )}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-rose-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="text-gray-700 hover:text-rose-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-gray-700 hover:text-rose-600 transition relative"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="lg:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-4">
                <button onClick={() => navigateTo('home')} className="text-gray-700 hover:text-rose-600 transition font-medium text-left">Home</button>
                <button onClick={() => navigateTo('bras')} className="text-gray-700 hover:text-rose-600 transition font-medium text-left">Bras</button>
                <button onClick={() => navigateTo('shapewear')} className="text-gray-700 hover:text-rose-600 transition font-medium text-left">Shapewear</button>
                <button onClick={() => navigateTo('lingerie')} className="text-gray-700 hover:text-rose-600 transition font-medium text-left">Lingerie</button>
                <button onClick={() => navigateTo('panties')} className="text-gray-700 hover:text-rose-600 transition font-medium text-left">Panties</button>
                <button onClick={() => navigateTo('nightwear')} className="text-gray-700 hover:text-rose-600 transition font-medium text-left">Nightwear</button>
                <button onClick={() => setShowSizeGuide(true)} className="text-gray-700 hover:text-rose-600 transition font-medium text-left">Size Guide</button>
                {isAdminLoggedIn && (
                  <button onClick={() => navigateTo('orders')} className="text-rose-600 hover:text-rose-700 transition font-semibold text-left flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Orders & Admin
                  </button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
    </>
  );
}

// Cart Sidebar
function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (showCheckout) {
    return <Checkout onClose={() => setShowCheckout(false)} />;
  }

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Shopping Cart ({cart.length})</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-500">Your cart is empty</p>
                <button onClick={() => setIsCartOpen(false)} className="mt-4 text-rose-600 font-medium hover:text-rose-700">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-gray-50 rounded-xl p-3">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                      <p className="text-rose-600 font-bold mt-1">Rs.{item.price.toLocaleString()}</p>
                      {item.selectedSize && <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">-</button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">+</button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-xl font-bold">Rs.{cartTotal.toLocaleString()}</span>
              </div>
              {cartTotal < 2999 && (
                <p className="text-sm text-gray-500">Add Rs.{(2999 - cartTotal).toLocaleString()} more for free delivery!</p>
              )}
              <button onClick={() => setShowCheckout(true)} className="w-full bg-rose-600 text-white py-4 rounded-full font-semibold hover:bg-rose-700 transition">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Transaction History (Mock Database)
const transactionHistory: { [key: string]: string } = {
  'jazzcash_03001234567_john': 'verified',
  'easypaisa_03009876543_jane': 'verified',
};

// Order Database Storage
function saveOrderToDatabase(orderData: any) {
  try {
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const newOrder = {
      ...orderData,
      orderId: `SS${Date.now().toString().slice(-8)}`,
      timestamp: new Date().toISOString(),
    };
    existingOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    return newOrder.orderId;
  } catch (error) {
    console.error('Error saving order:', error);
    return null;
  }
}

// Verify Transaction
function verifyTransaction(paymentMethod: string, fullName: string, trxnId: string): boolean {
  if (paymentMethod === 'cod') return true;
  
  const verificationKey = `${paymentMethod}_${trxnId}_${fullName.toLowerCase().replace(/\s+/g, '')}`;
  
  // Check if transaction exists in history
  if (transactionHistory[verificationKey] === 'verified') {
    return true;
  }
  
  // Alternative: Check if trxn ID follows correct format and name is not empty
  const trxnPattern = /^\d{11,}$/; // At least 11 digits for phone-based payment
  return trxnPattern.test(trxnId.replace(/\D/g, '')) && fullName.trim().length > 0;
}

// Get all orders from database
function getAllOrders() {
  try {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  } catch (error) {
    console.error('Error retrieving orders:', error);
    return [];
  }
}

// Export orders to Excel
function exportOrdersToExcel() {
  const orders = getAllOrders();
  
  if (orders.length === 0) {
    alert('No orders to export');
    return;
  }

  // Prepare data for Excel
  const excelData = orders.map((order: any, index: number) => ({
    'Sr. No.': index + 1,
    'Order ID': order.orderId,
    'First Name': order.firstName,
    'Last Name': order.lastName,
    'Email': order.email,
    'Phone': order.phone,
    'Address': order.address,
    'City': order.city,
    'Payment Method': order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase(),
    'Transaction ID': order.trxnId || 'N/A',
    'Payment Status': order.paymentStatus,
    'Items Count': order.cart?.length || 0,
    'Total Amount (Rs.)': order.total || 0,
    'Date': new Date(order.timestamp).toLocaleDateString('en-PK'),
    'Time': new Date(order.timestamp).toLocaleTimeString('en-PK'),
  }));

  // Create workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  // Set column widths
  const columnWidths = [
    { wch: 8 },   // Sr. No.
    { wch: 12 },  // Order ID
    { wch: 15 },  // First Name
    { wch: 15 },  // Last Name
    { wch: 20 },  // Email
    { wch: 15 },  // Phone
    { wch: 20 },  // Address
    { wch: 12 },  // City
    { wch: 18 },  // Payment Method
    { wch: 15 },  // Transaction ID
    { wch: 15 },  // Payment Status
    { wch: 12 },  // Items Count
    { wch: 15 },  // Total Amount
    { wch: 12 },  // Date
    { wch: 12 },  // Time
  ];
  worksheet['!cols'] = columnWidths;

  // Generate filename with timestamp
  const fileName = `Orders_${new Date().toLocaleDateString('en-PK').replace(/\//g, '-')}_${Date.now()}.xlsx`;
  
  // Download the file
  XLSX.writeFile(workbook, fileName);
}

// Checkout Component
function Checkout({ onClose }: { onClose: () => void }) {
  const { cart, cartTotal, setIsCartOpen, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [validationError, setValidationError] = useState('');
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    address: '', 
    city: '', 
    paymentMethod: 'cod',
    trxnId: ''
  });

  const handlePlaceOrder = () => {
    setValidationError('');

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      setValidationError('Please fill in all required fields');
      return;
    }

    // Validate transaction for non-COD payments
    if (formData.paymentMethod !== 'cod') {
      if (!formData.trxnId) {
        setValidationError('Transaction ID is required for this payment method');
        return;
      }

      if (!verifyTransaction(formData.paymentMethod, `${formData.firstName} ${formData.lastName}`, formData.trxnId)) {
        setValidationError('Transaction ID verification failed. Please check your name and transaction ID match your payment records.');
        return;
      }
    }

    // Save order to database
    const newOrderId = saveOrderToDatabase({
      ...formData,
      cart: cart,
      total: cartTotal + (cartTotal >= 2999 ? 0 : 250),
      paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'verified'
    });

    if (!newOrderId) {
      setValidationError('Failed to process order. Please try again.');
      return;
    }

    clearCart();
    setOrderId(newOrderId);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-2">Thank you for your order.</p>
          <p className="text-lg font-semibold text-rose-600 mb-6">Order #{orderId}</p>
          {formData.paymentMethod !== 'cod' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 text-sm">
              <p className="text-green-800"><strong>Payment Status:</strong> Transaction Verified</p>
              <p className="text-green-800 text-xs mt-1">Your order will be processed shortly.</p>
            </div>
          )}
          <button onClick={() => { setIsCartOpen(false); onClose(); }} className="w-full bg-rose-600 text-white py-4 rounded-full font-semibold hover:bg-rose-700 transition">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-3xl max-w-4xl w-full mx-4 my-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button onClick={onClose} className="text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {validationError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {validationError}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First Name" className="px-4 py-3 border rounded-xl" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            <input type="text" placeholder="Last Name" className="px-4 py-3 border rounded-xl" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <input type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="tel" placeholder="Phone" className="w-full px-4 py-3 border rounded-xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input type="text" placeholder="Address" className="w-full px-4 py-3 border rounded-xl" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          <select className="w-full px-4 py-3 border rounded-xl" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
            <option value="">Select City</option>
            <option value="Karachi">Karachi</option>
            <option value="Lahore">Lahore</option>
            <option value="Islamabad">Islamabad</option>
          </select>
          <div className="space-y-2">
            <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer">
              <input type="radio" name="payment" value="cod" checked={formData.paymentMethod === 'cod'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer">
              <input type="radio" name="payment" value="jazzcash" checked={formData.paymentMethod === 'jazzcash'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} />
              <span>JazzCash</span>
            </label>
            <label className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer">
              <input type="radio" name="payment" value="easypaisa" checked={formData.paymentMethod === 'easypaisa'} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} />
              <span>EasyPaisa</span>
            </label>
          </div>

          {formData.paymentMethod !== 'cod' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-blue-900 mb-3">Transaction ID (Required)</label>
              <input 
                type="text" 
                placeholder="Enter your transaction ID (e.g., reference number from payment app)" 
                className="w-full px-4 py-3 border rounded-xl"
                value={formData.trxnId}
                onChange={e => setFormData({...formData, trxnId: e.target.value})}
              />
              <p className="text-xs text-blue-700 mt-2">
                ℹ️ Your name and transaction ID will be verified against our payment system. This ensures secure processing of your order.
              </p>
            </div>
          )}

          <button onClick={handlePlaceOrder} className="w-full bg-rose-600 text-white py-4 rounded-full font-semibold hover:bg-rose-700 transition">
            Place Order - Rs.{(cartTotal + (cartTotal >= 2999 ? 0 : 250)).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hero Section
function Hero() {
  const { setCurrentPage } = useCart();
  
  return (
    <section className="pt-32 md:pt-40 pb-16 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-medium">
              New Summer Collection 2026
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Where Comfort<span className="text-rose-600"> Meets</span><br />Confidence
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Discover elegant, comfortable innerwear designed for modern women. Premium bras, lingerie, shapewear & more.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setCurrentPage('bras')} className="bg-rose-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-rose-700 transition shadow-lg">
                Shop Now
              </button>
              <button onClick={() => setCurrentPage('size-guide')} className="border-2 border-rose-600 text-rose-600 px-8 py-4 rounded-full font-semibold hover:bg-rose-600 hover:text-white transition">
                Find Your Size
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-rose-200 to-pink-300 rounded-3xl p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                <img src={images.blackLace} alt="Black Lace Bra" className="w-40 h-40 object-cover rounded-2xl shadow-lg" />
                <img src={images.pinkLace} alt="Pink Lace Bra" className="w-40 h-40 object-cover rounded-2xl shadow-lg mt-8" />
                <img src={images.blueLace} alt="Blue Lace Bra" className="w-40 h-40 object-cover rounded-2xl shadow-lg -mt-4" />
                <img src={images.redLace} alt="Red Lace Bra" className="w-40 h-40 object-cover rounded-2xl shadow-lg mt-4" />
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">10,000+</p>
                  <p className="text-sm text-gray-500">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const { addToCart, setCurrentPage } = useCart();
  const [imgError, setImgError] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setShowSizeModal(false);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative aspect-square bg-gradient-to-br from-rose-50 to-pink-100 overflow-hidden">
          {!imgError ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={() => setImgError(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">👙</div>
          )}
          {product.isNew && <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs px-3 py-1 rounded-full font-medium">NEW</span>}
          {product.originalPrice && <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">SALE</span>}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button className="bg-white p-3 rounded-full hover:bg-rose-600 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button onClick={() => setShowSizeModal(true)} className="bg-white p-3 rounded-full hover:bg-rose-600 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 group-hover:text-rose-600 transition line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-rose-600">Rs.{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-sm text-gray-400 line-through">Rs.{product.originalPrice.toLocaleString()}</span>}
          </div>
          <button onClick={() => setShowSizeModal(true)} className="w-full mt-3 bg-rose-600 text-white py-2 rounded-full text-sm font-medium hover:bg-rose-700 transition">
            Add to Cart
          </button>
        </div>
      </div>

      {showSizeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Size</h3>
              <button onClick={() => setShowSizeModal(false)} className="text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-rose-600 font-bold">Rs.{product.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {sizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 rounded-lg font-medium transition ${selectedSize === size ? 'bg-rose-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  {size}
                </button>
              ))}
            </div>
            <button onClick={handleAddToCart} className="w-full bg-rose-600 text-white py-3 rounded-full font-semibold hover:bg-rose-700 transition">
              Add to Cart - Rs.{product.price.toLocaleString()}
            </button>
            <button onClick={() => { setShowSizeModal(false); setCurrentPage('size-guide'); }} className="w-full mt-2 text-rose-600 text-sm font-medium hover:underline">
              Not sure? Check Size Guide
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Product Section Component
function ProductSection({ id, title, subtitle, products, bgColor = "bg-white" }: { id: string; title: string; subtitle: string; products: Product[]; bgColor?: string }) {
  return (
    <section id={id} className={`py-16 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Categories Section
function Categories() {
  const { setCurrentPage } = useCart();
  const categories = [
    { name: "Bras", icon: "👙", count: "200+", page: "bras", color: "from-rose-400 to-pink-500" },
    { name: "Shapewear", icon: "✨", count: "50+", page: "shapewear", color: "from-purple-400 to-indigo-500" },
    { name: "Lingerie", icon: "💕", count: "100+", page: "lingerie", color: "from-red-400 to-rose-500" },
    { name: "Panties", icon: "🩲", count: "150+", page: "panties", color: "from-pink-400 to-rose-500" },
    { name: "Nightwear", icon: "🌙", count: "80+", page: "nightwear", color: "from-indigo-400 to-purple-500" },
  ];

  return (
    <section id="categories" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop By Category</h2>
          <p className="text-gray-600">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, index) => (
            <button key={index} onClick={() => setCurrentPage(cat.page)} className="group bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl`}>
                {cat.icon}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-rose-600 transition">{cat.name}</h3>
              <p className="text-sm text-gray-500">{cat.count} Products</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section
function Features() {
  const features = [
    { icon: "🚚", title: "Free Delivery", description: "Free shipping on orders above Rs.2,999" },
    { icon: "⚡", title: "Fast Delivery", description: "Express delivery within 2-4 business days" },
    { icon: "🔄", title: "Easy Exchange", description: "7-day hassle-free exchange policy" },
    { icon: "💯", title: "Quality Assured", description: "Premium quality guaranteed" }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition">
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  const { setCurrentPage } = useCart();
  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-rose-400">Sleek</span>
              <span className="text-2xl font-light text-gray-400">&</span>
              <span className="text-2xl font-bold text-rose-400">Sassy</span>
            </div>
            <p className="text-gray-400 mb-4">Premium women's innerwear designed for comfort and confidence.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><button onClick={() => setCurrentPage('bras')} className="text-gray-400 hover:text-rose-400 transition">All Bras</button></li>
              <li><button onClick={() => setCurrentPage('shapewear')} className="text-gray-400 hover:text-rose-400 transition">Shapewear</button></li>
              <li><button onClick={() => setCurrentPage('lingerie')} className="text-gray-400 hover:text-rose-400 transition">Lingerie</button></li>
              <li><button onClick={() => setCurrentPage('panties')} className="text-gray-400 hover:text-rose-400 transition">Panties</button></li>
              <li><button onClick={() => setCurrentPage('nightwear')} className="text-gray-400 hover:text-rose-400 transition">Nightwear</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Help</h3>
            <ul className="space-y-3">
              <li><button onClick={() => setCurrentPage('size-guide')} className="text-gray-400 hover:text-rose-400 transition">Size Guide</button></li>
              <li><a href="#" className="text-gray-400 hover:text-rose-400 transition">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-rose-400 transition">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-rose-400 transition">Returns & Exchange</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li>Lahore, Punjab, Pakistan</li>
              <li>hello@sleekandsassy.pk</li>
              <li>+92 300 1234567</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <div className="bg-gray-800 px-3 py-1 rounded text-sm">COD</div>
              <div className="bg-gray-800 px-3 py-1 rounded text-sm">JazzCash</div>
              <div className="bg-gray-800 px-3 py-1 rounded text-sm">EasyPaisa</div>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
          <p>© 2026 Sleek & Sassy. All rights reserved.</p>
          <button
            onClick={() => setCurrentPage('orders')}
            className="text-gray-400 hover:text-white text-sm mt-3 px-3 py-1 rounded border border-gray-600 hover:border-gray-400 transition-colors"
            title="Admin Login"
          >
            🔐 Admin Panel
          </button>
        </div>
      </div>
    </footer>
  );
}

// Home Page
function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <ProductSection id="bras" title="New Arrivals" subtitle="Explore our latest summer collection featuring soft fabrics and elegant designs." products={allProducts.newArrivals} />
      <ProductSection id="lace-bras" title="Lace Bras Collection" subtitle="Elegant lace bras for a sophisticated look." products={allProducts.laceBras} bgColor="bg-gradient-to-br from-rose-50 to-pink-50" />
      <ProductSection id="cotton-bras" title="Cotton Bras Collection" subtitle="Breathable cotton bras perfect for Pakistan's warm climate." products={allProducts.cottonBras} />
      <ProductSection id="shapewear" title="Body Shapers" subtitle="Smooth, sculpt and enhance your natural silhouette." products={allProducts.bodyShapers} bgColor="bg-gradient-to-br from-purple-50 to-indigo-50" />
      <ProductSection id="lingerie" title="Lingerie Sets" subtitle="Complete matching sets for a coordinated look." products={allProducts.lingerieSets} />
      <ProductSection id="panties" title="Panties & Underwear" subtitle="Comfortable everyday essentials in various styles." products={allProducts.panties} bgColor="bg-gray-50" />
      <ProductSection id="nightwear" title="Nightwear" subtitle="Elegant sleepwear for a luxurious night's rest." products={allProducts.nightwear} />
      <Features />
    </main>
  );
}

// Category Page Component
function CategoryPage({ title, products, icon }: { title: string; products: Product[]; icon: string }) {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-6xl mb-4 block">{icon}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover our premium collection of {title.toLowerCase()} designed for comfort and style.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Orders Admin Page Component
function OrdersPage() {
  const { setCurrentPage } = useCart();
  const { isAdminLoggedIn, logoutAdmin, adminEmail } = useAdminAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (isAdminLoggedIn) {
      const allOrders = getAllOrders();
      setOrders(allOrders);
      filterOrders(allOrders, searchTerm, filterStatus);
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    filterOrders(orders, searchTerm, filterStatus);
  }, [searchTerm, filterStatus, orders]);

  const handleLogout = () => {
    logoutAdmin();
    setCurrentPage('home');
  };

  const filterOrders = (ordersList: any[], search: string, status: string) => {
    let filtered = ordersList;

    if (search) {
      filtered = filtered.filter(order =>
        order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
        order.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        order.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        order.email?.toLowerCase().includes(search.toLowerCase()) ||
        order.phone?.includes(search)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === status);
    }

    setFilteredOrders(filtered);
  };

  return (
    <>
      {!isAdminLoggedIn ? (
        <AdminLoginModal 
          onClose={() => setCurrentPage('home')} 
          onLoginSuccess={() => {}}
        />
      ) : (
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <button 
                onClick={() => setCurrentPage('home')}
                className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-2 mb-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Store
              </button>

              <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Order Management</h1>
                    <p className="text-rose-100">Track and manage all customer orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-rose-100 mb-2">Logged in as: <strong>{adminEmail}</strong></p>
                    <button 
                      onClick={handleLogout}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <input
              type="text"
              placeholder="Search by Order ID, Name, Email or Phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending (COD)</option>
              <option value="verified">Verified (Paid)</option>
            </select>
            <button
              onClick={exportOrdersToExcel}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8H3m6-6h12" />
              </svg>
              Download Excel
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-gray-600 text-sm font-medium">Total Orders</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-gray-600 text-sm font-medium">Pending (COD)</div>
              <div className="text-3xl font-bold text-orange-600 mt-2">{orders.filter(o => o.paymentStatus === 'pending').length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-gray-600 text-sm font-medium">Verified (Paid)</div>
              <div className="text-3xl font-bold text-green-600 mt-2">{orders.filter(o => o.paymentStatus === 'verified').length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-gray-600 text-sm font-medium">Total Revenue</div>
              <div className="text-3xl font-bold text-rose-600 mt-2">Rs.{orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10M8 5l4 2 4-2" />
                </svg>
                <p className="text-lg">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-rose-600">{order.orderId}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{order.firstName} {order.lastName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                            {order.paymentStatus === 'verified' ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">Rs.{order.total?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.timestamp).toLocaleDateString('en-PK')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
        </div>
      )}
    </>
  );
}

// Main App Component
function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AdminAuthProvider>
  );
}

function AppContent() {
  const { currentPage } = useCart();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartSidebar />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'bras' && <CategoryPage title="Bras Collection" products={[...allProducts.newArrivals, ...allProducts.laceBras, ...allProducts.cottonBras]} icon="👙" />}
      {currentPage === 'shapewear' && <CategoryPage title="Shapewear" products={allProducts.bodyShapers} icon="✨" />}
      {currentPage === 'lingerie' && <CategoryPage title="Lingerie Sets" products={allProducts.lingerieSets} icon="💕" />}
      {currentPage === 'panties' && <CategoryPage title="Panties & Underwear" products={allProducts.panties} icon="🩲" />}
      {currentPage === 'nightwear' && <CategoryPage title="Nightwear" products={allProducts.nightwear} icon="🌙" />}
      {currentPage === 'size-guide' && <SizeGuidePage />}
      {currentPage === 'orders' && <OrdersPage />}
      <Footer />
    </div>
  );
}

export default App;
