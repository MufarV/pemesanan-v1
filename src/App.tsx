import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  ChevronRight, 
  Star, 
  Instagram, 
  MapPin, 
  Phone,
  Heart,
  Flame,
  Zap
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Popular' | 'Classic' | 'Special';
  spicy?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Data ---
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cilok Original Premium',
    price: 15000,
    description: 'Cilok kenyal dengan isian daging sapi dan bumbu kacang rahasia yang gurih.',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800',
    category: 'Classic'
  },
  {
    id: '2',
    name: 'Cilok Mercon Luber',
    price: 18000,
    description: 'Rasa pedas nampol dengan isian cabai rawit yang bikin melek pas nugas.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=800',
    category: 'Popular',
    spicy: true
  },
  {
    id: '3',
    name: 'Cilok Mozzarella Melt',
    price: 22000,
    description: 'Sensasi keju mozzarella yang lumer di mulut. Favorit banget buat temen nonton drakor!',
    image: 'https://images.unsplash.com/photo-1548345680-f5475aa5114a?auto=format&fit=crop&q=80&w=800',
    category: 'Special'
  },
  {
    id: '4',
    name: 'Cilok Kuah Goang',
    price: 20000,
    description: 'Kuah bening pedas segar dengan perasan jeruk limau. Seger pol!',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b52c67ad5?auto=format&fit=crop&q=80&w=800',
    category: 'Popular'
  }
];

const TESTIMONIALS = [
  { name: 'Salsa', role: 'Mahasiswa Psikologi', comment: 'Ciloknya empuk banget, bumbu kacangnya ga pelit. Cocok banget buat nemenin nugas malam!' },
  { name: 'Putri', role: 'Mahasiswa FEB', comment: 'Cilok Mozzarella-nya juuuuara! Kejunya beneran lumer. Packaging-nya cakep pula.' },
  { name: 'Indah', role: 'Mahasiswa Kedokteran', comment: 'Udah langganan dari semester 1. Rasanya konsisten enak dan pengirimannya cepet!' }
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // --- Handlers ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    const message = `Halo Kak! Saya mau pesan Cilok Aestetik:\n\n` +
      cart.map(item => `- ${item.name} x${item.quantity}`).join('\n') +
      `\n\nTotal: Rp${totalPrice.toLocaleString('id-ID')}\n` +
      `Alamat & Nama: `;
    
    window.open(`https://wa.me/6289691223205?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-12 overflow-x-hidden selection:bg-brand-pink selection:text-brand-accent">
      {/* --- Sticky Header --- */}
      <header className="sticky top-0 z-40 bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center text-white font-bold text-xl">
              C
            </div>
            <h1 className="text-2xl font-display font-black tracking-tighter text-brand-pink italic">
              CilokHits<span className="text-brand-orange font-medium">.id</span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#menu" className="text-brand-pink font-semibold border-b-2 border-brand-pink pb-1">Menu</a>
              <a href="#testimonials" className="hover:text-brand-pink transition-colors">Promo Kampus</a>
              <a href="#" className="hover:text-brand-pink transition-colors">Tentang Kami</a>
            </nav>
            
            <div className="hidden sm:block px-4 py-2 bg-pink-100 text-brand-pink rounded-full font-bold text-sm cursor-pointer whitespace-nowrap">
              Saldo: Rp 50.000
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 hover:bg-brand-pink/10 rounded-full transition-all group"
            >
              <ShoppingBag className={cn("w-6 h-6 text-brand-text group-hover:text-brand-pink transition-colors", totalItems > 0 && "text-brand-pink")} />
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-brand-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-brand-pink/40"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="relative px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 -z-10 opacity-10 pointer-events-none">
          <div className="w-[500px] h-[500px] bg-brand-pink rounded-full blur-[100px]" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-white border border-pink-200 rounded-full text-brand-pink text-xs font-bold mb-6 shadow-soft uppercase tracking-wider">
              ✨ Snack Terlaris Se-Kampus
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black text-gray-800 leading-[1.1] mb-6">
              Mau Cilok Apa Hari Ini, <span className="text-brand-pink underline decoration-brand-pink decoration-4 underline-offset-4">Sis?</span>
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md font-medium italic leading-relaxed">
              Snack favorit mahasiswi hits se-Indonesia. Teman setia nugas, gibah, dan istirahat!
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#menu" className="px-8 py-4 bg-brand-pink text-white rounded-2xl font-black shadow-xl shadow-brand-pink/30 hover:bg-brand-deep-pink transition-all flex items-center gap-2">
                CEK MENU HITS <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white bg-white">
              <img 
                src="https://images.unsplash.com/photo-1541544741938-0af808871cc0" 
                alt="Delicious Cilok" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decoration Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-100 rounded-full -z-10 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl z-20 flex items-center gap-4 border border-pink-50">
               <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-brand-orange">
                  <Flame className="w-6 h-6 fill-current" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">HOT SELLER</p>
                  <p className="font-display font-bold text-lg">Cilok Bumbu Kacang</p>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Menu Section --- */}
      <section id="menu" className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-display font-black text-gray-800">Cilok Pilihan <span className="text-brand-pink">Mahasiswi</span></h2>
            <p className="text-gray-400 font-medium italic mt-1">Sesuaikan dengan mood-mu hari ini ✨</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Popular', 'Classic', 'Special'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border-2",
                  activeCategory === cat 
                    ? "bg-brand-pink text-white border-brand-pink shadow-md" 
                    : "bg-white text-gray-400 border-gray-100 hover:border-pink-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {PRODUCTS
              .filter(p => activeCategory === 'All' || p.category === activeCategory)
              .map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card-vibrant group flex flex-col items-center text-center"
              >
                <div className="w-40 h-40 bg-pink-50 rounded-full mb-6 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500 border border-pink-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover opacity-90"
                  />
                  {product.spicy && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md z-10">
                      PEDAS MAMPUS
                    </div>
                  )}
                  {product.category === 'Popular' && (
                    <div className="absolute top-2 left-2 bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md z-10">
                      MOST WANTED
                    </div>
                  )}
                </div>
                
                <h3 className="font-display font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-400 text-xs mb-6 px-2 italic font-medium leading-relaxed">{product.description}</p>
                
                <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-pink-100">
                  <span className="font-black text-xl text-brand-pink tracking-tight">
                    Rp{product.price.toLocaleString('id-ID')}
                  </span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-10 h-10 bg-brand-pink hover:bg-brand-deep-pink rounded-xl text-white font-bold text-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
                  >
                    +
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* --- Campus Info Bar --- */}
      <div className="h-12 bg-brand-pink flex items-center px-8 gap-10 overflow-hidden mt-12">
        <div className="flex items-center gap-2 whitespace-nowrap text-white text-[10px] font-bold uppercase tracking-widest">
          <span className="bg-white text-brand-pink px-2 py-0.5 rounded">INFO</span>
          GRATIS ONGKIR SE-AREA KAMPUS UNPAD & ITB (MIN 15RB)
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap text-white text-[10px] font-bold uppercase tracking-widest">
          <span className="bg-white text-brand-pink px-2 py-0.5 rounded">OPEN</span>
          ORDER HARI INI SAMPAI JAM 21.00 WIB
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap text-white text-[10px] font-bold uppercase tracking-widest">
          <span className="bg-white text-brand-pink px-2 py-0.5 rounded">IG</span>
          @CILOKHITS.CAMPUS
        </div>
      </div>

      {/* --- Testimonials --- */}
      <section id="testimonials" className="py-24 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
             <h2 className="text-3xl font-display font-black text-gray-800 mb-2 italic">Mending tanyain mereka...</h2>
             <p className="text-brand-pink-500 uppercase tracking-[0.2em] text-[10px] font-black">REVIEW JUJUR MAHASISWA HITS</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-pink-50 relative"
            >
              <div className="flex items-center gap-1 text-brand-pink mb-4">
                {[1,2,3,4,5].map(star => <Star key={star} className="w-3 h-3 fill-current" />)}
              </div>
              <p className="text-gray-600 mb-8 italic text-sm font-medium leading-relaxed">"{t.comment}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-pink rounded-full overflow-hidden shadow-md">
                  <img src={`https://i.pravatar.cc/100?u=${t.name}`} alt={t.name} />
                </div>
                <div>
                  <p className="font-display font-bold text-gray-800 text-sm leading-none mb-1">{t.name}</p>
                  <p className="text-[10px] text-brand-pink font-bold uppercase tracking-tighter">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-pink-100 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-pink rounded-full flex items-center justify-center text-white font-bold">C</div>
            <span className="text-xl font-black italic text-brand-pink">CilokHits<span className="text-brand-orange font-medium">.id</span></span>
          </div>
          <div className="flex gap-4 mb-8">
             <button className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-pink hover:bg-brand-pink hover:text-white transition-all transform hover:scale-110">
                <Instagram className="w-5 h-5" />
             </button>
             <a href="https://wa.me/6289691223205" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-pink hover:bg-brand-pink hover:text-white transition-all transform hover:scale-110">
                <Phone className="w-5 h-5" />
             </a>
             <button className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-pink hover:bg-brand-pink hover:text-white transition-all transform hover:scale-110">
                <MapPin className="w-5 h-5" />
             </button>
          </div>
          <p className="font-medium text-gray-400 text-xs tracking-widest font-display text-center">
            © 2024 CILOKHITS INDONESIA • FOR THE HITS GENERATION
          </p>
        </div>
      </footer>

      {/* --- Cart Drawer --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-brand-pink/20 backdrop-blur-[2px] z-[50]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[60] shadow-2xl p-8 flex flex-col border-l border-pink-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-orange text-white rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-display font-black uppercase tracking-widest text-gray-800">Tas Belanja</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-pink-50 text-brand-pink rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink-100">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                       <ShoppingBag className="w-10 h-10 text-brand-pink" />
                    </div>
                    <p className="font-black uppercase tracking-widest text-sm">Masih Kosong, Sis!</p>
                    <p className="text-xs font-medium italic mt-2 text-brand-pink">Yuk isi bensin nugasmu sekarang~</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 bg-brand-bg p-4 rounded-[2rem] border border-pink-50">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border-2 border-white">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                             <p className="font-display font-black text-gray-700 leading-tight text-sm uppercase">{item.name}</p>
                             <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-400">
                               <X className="w-4 h-4" />
                             </button>
                          </div>
                          <p className="text-brand-pink font-black text-sm mb-3">Rp{item.price.toLocaleString('id-ID')}</p>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 bg-white border border-pink-100 rounded-lg flex items-center justify-center text-brand-pink active:scale-90 shadow-sm"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-black text-xs w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 bg-white border border-pink-100 rounded-lg flex items-center justify-center text-brand-pink active:scale-90 shadow-sm"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-dashed border-orange-300">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎓</span>
                        <p className="text-[10px] font-bold text-orange-700 uppercase leading-relaxed">Voucher Siswa Hits Terdeteksi! Hemat Rp 5.000 otomatis.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-8 pt-8 border-t border-pink-100 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="font-bold text-gray-700">Rp{totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Diskon Siswa</span>
                    <span className="font-bold text-green-500">- Rp 5.000</span>
                  </div>
                  <div className="h-[1px] bg-pink-50 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-display font-black text-gray-800 uppercase tracking-widest">Total</span>
                    <span className="font-display font-black text-3xl text-brand-pink tracking-tight">Rp{(totalPrice - 5000).toLocaleString('id-ID')}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-5 bg-brand-pink hover:bg-brand-deep-pink text-white rounded-[2rem] font-black text-lg shadow-xl shadow-brand-pink/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    BELI SEKARANG <ChevronRight className="w-6 h-6 stroke-[3px]" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Cart Button (Mobile) */}
      {totalItems > 0 && !isCartOpen && (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-30 p-5 bg-brand-pink text-white rounded-full shadow-2xl shadow-brand-pink/40 md:hidden"
        >
          <ShoppingBag className="w-7 h-7" />
          <span className="absolute top-0 right-0 w-6 h-6 bg-white text-brand-pink text-xs font-bold rounded-full flex items-center justify-center border-2 border-brand-pink">
            {totalItems}
          </span>
        </motion.button>
      )}
    </div>
  );
}
