import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, onSnapshot, collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';
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
  Zap,
  QrCode,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
interface ProductOption {
  name: string;
  image: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  options?: ProductOption[];
}

interface CartItem {
  id: string;
  name: string;
  kuah: string;
  price: number;
  image: string;
  quantity: number;
}

interface FallingCilok {
  id: number;
  x: number;
  size: number;
  rotation: number;
  duration: number;
}

// --- Data ---
const ISI_OPTIONS: Product[] = [
  {
    id: 'Keju',
    name: 'Cheelok Isi Keju',
    price: 15000,
    description: 'Keju lumer di dalam cilok kenyal. Cocok untuk pecinta gurih manis! 🧀',
    image: 'https://images.unsplash.com/photo-1548345680-f5475aa5114a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'Ayam',
    name: 'Cheelok Isi Ayam',
    price: 15000,
    description: 'Daging ayam cincang gurih nendang di setiap gigitan 🍗',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'Tamago',
    name: 'Cheelok Isi Tamago',
    price: 15000,
    description: 'Telur gurih ala Jepang tersembunyi di dalam tekstur chewy 🥚',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=800'
  }
];

const KUAH_OPTIONS = [
  "Saos Kacang",
  "Kuah Seblak"
];

const TESTIMONIALS = [
  { name: 'Salsa', role: 'Mahasiswa Psikologi', comment: 'Ciloknya empuk banget, bumbu kacangnya ga pelit. Cocok banget buat nemenin nugas malam!' },
  { name: 'Putri', role: 'Mahasiswa FEB', comment: 'Cilok Mozzarella-nya juuuuara! Kejunya beneran lumer. Packaging-nya cakep pula.' },
  { name: 'Indah', role: 'Mahasiswa Kedokteran', comment: 'Udah langganan dari semester 1. Rasanya konsisten enak dan pengirimannya cepet!' }
];

const PO_TIMES = [
  "Pagi (10:00 WIB)",
  "Siang (13:00 WIB)",
  "Sore (16:00 WIB)"
];

const PAYMENT_METHODS = [
  "Bayar di Tempat (Cash/TF)",
  "Bayar Sekarang (Transfer)"
];

function ProductCard({ item, onAdd }: { key?: string, item: Product, onAdd: (product: Product, kuah: string) => void }) {
  const options = item.options && item.options.length > 0 ? item.options : KUAH_OPTIONS.map(opt => ({ name: opt, price: Number(item.price), image: item.image }));
  const [selectedName, setSelectedName] = useState(options[0].name);

  // Sync state if item changes
  useEffect(() => {
    const newOptions = item.options && item.options.length > 0 ? item.options : KUAH_OPTIONS.map(opt => ({ name: opt, price: Number(item.price), image: item.image }));
    if (!newOptions.find(o => o.name === selectedName)) {
      setSelectedName(newOptions[0].name);
    }
  }, [item]);

  const selectedOption = options.find(o => o.name === selectedName) || options[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="card-vibrant group flex flex-col items-center text-center p-6 border border-pink-50"
    >
      <div className="w-40 h-40 bg-pink-50 rounded-full mb-6 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500 border border-pink-100 shrink-0">
        <img 
          src={selectedOption.image || item.image} 
          alt={item.name}
          className="w-full h-full object-cover opacity-90"
        />
      </div>
      
      <h3 className="font-display font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
      <p className="text-gray-400 text-xs mb-4 px-2 italic font-medium leading-relaxed">{item.description}</p>
      
      <div className="w-full mt-auto mb-4 text-left">
        <label className="block text-[10px] font-bold text-brand-pink uppercase tracking-widest mb-1.5 ml-1">Pilihan Kuah/Saos</label>
        <select 
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          className="w-full text-xs font-bold text-gray-700 p-2.5 rounded-xl bg-brand-bg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-brand-pink appearance-none cursor-pointer text-center"
        >
          {options.map(opt => (
            <option key={opt.name} value={opt.name}>{opt.name}</option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center justify-between w-full pt-4 border-t border-pink-100">
        <span className="font-black text-xl text-brand-pink tracking-tight">
          Rp{selectedOption.price.toLocaleString('id-ID')}
        </span>
        <button 
          onClick={() => onAdd({ ...item, price: selectedOption.price, image: selectedOption.image || item.image }, selectedName)}
          className="w-10 h-10 bg-brand-pink hover:bg-brand-deep-pink rounded-xl text-white font-bold text-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all font-display"
        >
          +
        </button>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [poDate, setPODate] = useState(new Date().toISOString().split('T')[0]);
  const [poTime, setPOTime] = useState(PO_TIMES[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [fallingCiloks, setFallingCiloks] = useState<FallingCilok[]>([]);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "pengaturan", "pengaturan_toko"), 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStoreSettings(data);
          if (data.openPoDates && data.openPoDates.length > 0) {
            const initialDate = data.openPoDates[0];
            setPODate(initialDate);
            let initialTimes = data.poDatesConfig?.[initialDate]?.times || data.poTimes || [];
            if (initialTimes.length > 0) {
              setPOTime(initialTimes[0]);
            }
          } else if (data.poTimes && data.poTimes.length > 0) {
            setPOTime(data.poTimes[0]);
          }
        }
      },
      (error) => {
        console.error("Gagal mengambil pengaturan toko dari Firebase:", error);
      }
    );
    return () => unsub();
  }, []);

  const handleLogoClick = () => {
    const newCiloks = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 90, // 0 to 90vw
      size: Math.random() * 40 + 30, // 30px to 70px
      rotation: Math.random() * 360,
      duration: Math.random() * 2 + 1.5, // 1.5s to 3.5s
    }));
    setFallingCiloks(prev => [...prev, ...newCiloks]);
    
    // Cleanup after animation completes
    setTimeout(() => {
      setFallingCiloks(prev => prev.filter(c => !newCiloks.find(nc => nc.id === c.id)));
    }, 4000);
  };

  // --- Handlers ---
  const addToCart = (product: Product, kuah: string) => {
    if (storeSettings) {
      const isBuka = storeSettings.menerimaPesanan !== false;
      const openTime = storeSettings.openTime || "00:00";
      const closeTime = storeSettings.closeTime || "23:59";
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
      let isOpenHour = openTime <= closeTime ? (currentTime >= openTime && currentTime <= closeTime) : (currentTime >= openTime || currentTime <= closeTime);
      if (!isBuka || !isOpenHour) {
        alert("Mohon maaf, pemesanan online saat ini sedang tutup.\n" + 
             (!isBuka ? "Toko sedang tidak menerima pesanan." : ("Jam operasional: " + openTime + " - " + closeTime)));
        return;
      }
    }

    const cartId = `${product.id}-${kuah}`;
    setCart(prev => {
      const existing = prev.find(item => item.id === cartId);
      if (existing) {
        return prev.map(item => 
          item.id === cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: cartId, name: product.name, kuah, price: product.price, image: product.image, quantity: 1 }];
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

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      alert('Tulis nama panggilan kamu dulu ya, Bestie! 💖');
      return;
    }

    if (storeSettings) {
      const isBuka = storeSettings.menerimaPesanan !== false;
      const openTime = storeSettings.openTime || "00:00";
      const closeTime = storeSettings.closeTime || "23:59";
      
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
      
      let isOpenHour = false;
      if (openTime <= closeTime) {
        isOpenHour = currentTime >= openTime && currentTime <= closeTime;
      } else {
        isOpenHour = currentTime >= openTime || currentTime <= closeTime;
      }
      
      if (!isBuka || !isOpenHour) {
        alert("Mohon maaf, pemesanan online saat ini sedang tutup.\n" + 
             (!isBuka ? "Toko sedang tidak menerima pesanan." : ("Jam operasional: " + openTime + " - " + closeTime)));
        return;
      }
    }

    // Cek batas pcs!
      let currentTimes: string[] = [];
      let currentLimits: number[] = [];

      if (storeSettings.poDatesConfig && storeSettings.poDatesConfig[poDate]) {
        currentTimes = storeSettings.poDatesConfig[poDate].times || [];
        currentLimits = storeSettings.poDatesConfig[poDate].limits || [];
      } else if (storeSettings.poTimes && storeSettings.poLimits) {
        currentTimes = storeSettings.poTimes || [];
        currentLimits = storeSettings.poLimits || [];
      }

      if (currentTimes.length > 0 && currentLimits.length > 0) {
        const idx = currentTimes.indexOf(poTime);
        if (idx !== -1) {
          let batasMaksimals = currentLimits[idx];
          // handle both array string or int
          if (typeof batasMaksimals === 'object' && batasMaksimals !== null) {
            // just in case it's firestore API object format, though here it should be just the data from SDK
            batasMaksimals = parseInt((batasMaksimals as any).integerValue || (batasMaksimals as any).doubleValue || (batasMaksimals as any).stringValue || 0);
          } else {
            batasMaksimals = parseInt(batasMaksimals as any) || 0;
          }

          if (batasMaksimals > 0) {
            try {
              const resPesanan = await fetch('https://firestore.googleapis.com/v1/projects/gen-lang-client-0151673203/databases/ai-studio-0f662e5f-e75c-43b6-802f-9de8794d2bcf/documents/pesanan?pageSize=1000');
              if (resPesanan.ok) {
                const pesananData = await resPesanan.json();
                let totalPcsSudahDipesan = 0;
                if (pesananData.documents) {
                  for (const doc of pesananData.documents) {
                    const docFields = doc.fields;
                    if (!docFields || docFields.status?.stringValue === 'Dibatalkan') continue;
                    
                    if (docFields.tanggal_po?.stringValue === poDate && docFields.waktu_po?.stringValue === poTime) {
                      let orderQty = 0;
                      if (docFields.items) {
                        if (docFields.items.arrayValue && docFields.items.arrayValue.values) {
                          docFields.items.arrayValue.values.forEach((it: any) => {
                             const obj = it.mapValue?.fields;
                             if (obj) orderQty += parseInt(obj.quantity?.integerValue || obj.quantity?.stringValue || obj.jumlah?.integerValue || obj.jumlah?.stringValue || '1');
                          });
                        } else if (docFields.items.stringValue) {
                          const parts = docFields.items.stringValue.split(/[\n,;+]+/);
                          parts.forEach((part: string) => {
                             if (!part.trim()) return;
                             let qty = 1;
                             const matchEnd = part.match(/^(.*?)\s*\(?(?:x\s*(\d+)|(\d+)\s*x)\)?$/i);
                             if (matchEnd) {
                                qty = parseInt(matchEnd[2] || matchEnd[3]);
                             } else {
                                const matchStart = part.match(/^\(?(?:x\s*(\d+)|(\d+)\s*x)\)?\s*(.*)$/i);
                                if (matchStart) {
                                   qty = parseInt(matchStart[1] || matchStart[2]);
                                }
                             }
                             orderQty += qty;
                          });
                        }
                      }
                      if (orderQty === 0 && docFields.totalPcs) {
                         orderQty = parseInt(docFields.totalPcs.integerValue || docFields.totalPcs.stringValue || '1');
                      }
                      if (orderQty === 0) orderQty = 1;
                      totalPcsSudahDipesan += orderQty;
                    }
                  }
                }
                
                if (totalPcsSudahDipesan + totalItems > batasMaksimals) {
                  const sisa = Math.max(0, batasMaksimals - totalPcsSudahDipesan);
                  alert(`Maaf, waktu tersebut sudah penuh. Sisa slot: ${sisa} pcs. Mohon pilih waktu lain yang tersedia.`);
                  return;
                }
              }
            } catch (e) {
              console.error("Gagal cek batas pcs:", e);
            }
          }
        }
      }

    try {
      const finalPrice = totalPrice - 5000;
      const itemsString = cart.map(item => `${item.name} (${item.kuah}) x${item.quantity}`).join(', ');
      
      const payload = {
        fields: {
          ownerId: { stringValue: "eBRihF6EyxfvMOlNSoPV6wSHzny2" },
          status: { stringValue: "Baru" },
          createdAt: { stringValue: new Date().toISOString() },
          customerName: { stringValue: customerName },
          items: { stringValue: itemsString },
          tanggal_po: { stringValue: poDate },
          waktu_po: { stringValue: poTime },
          totalHarga: { integerValue: finalPrice.toString() },
          totalPcs: { integerValue: totalItems.toString() },
          paymentMethod: { stringValue: paymentMethod }
        }
      };

      const response = await fetch("https://firestore.googleapis.com/v1/projects/gen-lang-client-0151673203/databases/ai-studio-0f662e5f-e75c-43b6-802f-9de8794d2bcf/documents/pesanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Firebase REST API Error:", response.status, errorText);
        throw new Error(`Gagal mengirim pesanan: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      const docId = result.name ? result.name.split('/').pop() : 'UNKNOWN';
      const orderId = docId.slice(-5).toUpperCase();

      alert("Pesanan kamu telah berhasil diproses! 💖");
      
      const message = `Halo Kak! Saya mau pesan CHEELOK :\n\n` +
        `Order ID: #${orderId}\n` +
        `Nama: ${customerName}\n` +
        `Ambil PO: ${poDate} - ${poTime}\n` +
        `Metode Pembayaran: ${paymentMethod}\n\n` +
        `Pesanan:\n` +
        cart.map(item => `- ${item.name} (${item.kuah}) x${item.quantity}`).join('\n') +
        `\n\nTotal Bayar: Rp${finalPrice.toLocaleString('id-ID')}\n`;
      
      window.open(`https://wa.me/6289691223205?text=${encodeURIComponent(message)}`, '_blank');
      
      setCart([]);
      setIsCartOpen(false);
      setCustomerName('');
    } catch (error) {
      console.error("Gagal membuat pesanan:", error);
      alert("Ups, terjadi kesalahan saat memesan!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F5] via-white to-[#FFF0E5] pb-12 overflow-x-hidden selection:bg-brand-pink selection:text-white">
      {/* --- Falling Cilok Animation --- */}
      {fallingCiloks.map(cilok => (
        <motion.div
          key={cilok.id}
          initial={{ top: -100, x: `${cilok.x}vw`, rotate: 0 }}
          animate={{ top: '120vh', rotate: cilok.rotation }}
          transition={{ duration: cilok.duration, ease: "easeIn" }}
          className="fixed pointer-events-none z-50 drop-shadow-xl"
          style={{ width: cilok.size, height: cilok.size }}
        >
          <img src="/logo.png" alt="cilok jatuh" className="w-full h-full object-contain" />
        </motion.div>
      ))}

      {/* --- Store Status Banner --- */}
      {storeSettings && (() => {
        const isBuka = storeSettings.menerimaPesanan !== false;
        const openTime = storeSettings.openTime || "00:00";
        const closeTime = storeSettings.closeTime || "23:59";
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        let isOpenHour = false;
        if (openTime <= closeTime) {
          isOpenHour = currentTime >= openTime && currentTime <= closeTime;
        } else {
          isOpenHour = currentTime >= openTime || currentTime <= closeTime;
        }
        if (!isBuka || !isOpenHour) {
          return (
            <div className="bg-red-50 border-b border-red-100 text-red-600 px-4 py-3 text-center font-bold text-sm sticky top-0 z-50">
              ⚠️ Maaf, Toko Sedang Tutup ({!isBuka ? "Tidak Terima Order" : `Buka ${openTime}-${closeTime}`}).
            </div>
          );
        }
        return null;
      })()}

      {/* --- Sticky Header --- */}
      <header className={cn("sticky z-40 bg-white border-b border-pink-100 shadow-sm", (() => {
        if (!storeSettings) return "top-0";
        const isBuka = storeSettings.menerimaPesanan !== false;
        const openTime = storeSettings.openTime || "00:00";
        const closeTime = storeSettings.closeTime || "23:59";
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        let isOpenHour = openTime <= closeTime ? (currentTime >= openTime && currentTime <= closeTime) : (currentTime >= openTime || currentTime <= closeTime);
        return (!isBuka || !isOpenHour) ? "top-[44px]" : "top-0";
      })())}>
        <div className="max-w-6xl mx-auto px-4 h-24 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleLogoClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.img 
              src="/logo.png" 
              alt="Cheelok Logo" 
              className="h-16 md:h-20 w-auto object-contain hidden drop-shadow-md"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              onLoad={(e) => {
                e.currentTarget.style.display = 'block';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'none';
              }}
            />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-brand-accent shadow-sm overflow-hidden flex-shrink-0">
                <span className="font-display font-black text-brand-accent" style={{ WebkitTextStroke: '0.5px white' }}>C</span>
              </div>
              <h1 className="text-2xl font-display font-black tracking-tighter text-brand-pink italic drop-shadow-sm uppercase" style={{ WebkitTextStroke: '1px var(--color-brand-accent)' }}>
                CHEELOK
              </h1>
            </div>
          </motion.div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#menu" className="text-brand-pink font-semibold border-b-2 border-brand-pink pb-1">Menu</a>
              <a href="#testimonials" className="hover:text-brand-pink transition-colors">Testimoni</a>
              <a href="#about" className="hover:text-brand-pink transition-colors">Tentang Kami</a>
              <a href="https://wa.me/6289691223205" target="_blank" rel="noreferrer" className="hover:text-brand-pink transition-colors">Kritik & Saran</a>
            </nav>
            
            <button 
              onClick={toggleAudio}
              className="px-3 py-2 md:px-4 md:py-2.5 rounded-full border-2 border-pink-100 bg-pink-50 text-brand-pink hover:bg-brand-pink hover:text-white transition-all shadow-sm flex items-center gap-2"
              aria-label="Toggle Background Music"
              title="Toggle Music"
            >
              {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-xs font-bold uppercase tracking-widest">Song</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- Background Audio --- */}
      <audio 
        ref={audioRef} 
        src="https://www.image2url.com/r2/default/audio/1778738447768-22a170dc-effb-4bbb-bc20-14ba2092094d.mp3" 
        loop
      />

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
            <span className="inline-block px-4 py-1.5 bg-brand-pink text-white rounded-full text-xs font-bold mb-6 shadow-soft uppercase tracking-wider">
              🌸 Teman Nyemil Mahasiswi
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-black text-gray-800 leading-[1.1] mb-4">
              Chill Perutnya, <br className="hidden md:block"/> <span className="text-brand-pink relative whitespace-nowrap">
                Hemat Harganya!
                <svg className="absolute w-full h-4 -bottom-1 left-0 text-brand-orange" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </h2>
            <p className="font-handwriting text-3xl text-brand-orange mb-6 -rotate-2">
              Spesial buat bestie-bestie kampus ✨
            </p>
            <p className="text-gray-500 text-lg mb-8 max-w-md font-medium leading-relaxed">
              {storeSettings?.heroDescription || "Jajanan cilok estetik dengan bumbu kacang lumer. Bikin mood nugas & gibah naik, kantong tetap aman 💖"}
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#menu" className="px-8 py-4 bg-brand-pink text-white rounded-full font-black shadow-xl shadow-brand-pink/30 hover:bg-brand-deep-pink transition-all flex items-center gap-2 border-b-4 border-brand-deep-pink active:border-b-0 active:translate-y-1">
                JAJAN SEKARANG <ChevronRight className="w-5 h-5 stroke-[3px]" />
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
                src={storeSettings?.heroImage || "https://images.unsplash.com/photo-1541544741938-0af808871cc0"} 
                alt="Delicious Cilok" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decoration Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-100 rounded-full -z-10 animate-pulse" />
            <div className="absolute -top-4 -left-4 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>✨</div>
            <div className="absolute bottom-10 -right-8 text-5xl">🌸</div>
          </motion.div>
        </div>
      </section>

      {/* --- Menu Section --- */}
      <section id="menu" className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative">
          <div className="absolute -top-10 -left-4 text-4xl opacity-50 rotate-12">🍓</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-gray-800">Pilihan Menu <span className="text-brand-pink">Estetik</span></h2>
            <p className="text-gray-500 font-medium mt-2">Pilih bestie cilokmu dengan kuah / saos favorit! ✨</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {(storeSettings?.products && storeSettings.products.length > 0
                ? storeSettings.products.map((prod: any, index: number) => {
                    const isObj = typeof prod === 'object' && prod !== null;
                    const prodName = isObj ? prod.name : prod;
                    const prodImage = isObj && prod.image ? prod.image : 'https://images.unsplash.com/photo-1548345680-f5475aa5114a?auto=format&fit=crop&q=80&w=800';
                    const prodPrice = isObj && prod.price ? Number(prod.price) : 15000;
                    
                    const safeOptions = isObj && Array.isArray(prod.options) ? prod.options.map((opt: any) => ({
                      ...opt,
                      price: Number(opt.price || 0)
                    })) : undefined;

                    const existing = ISI_OPTIONS.find(p => p.name === prodName);
                    if (existing) {
                      return { ...existing, image: isObj && prod.image ? prod.image : existing.image, price: isObj && prod.price ? Number(prod.price) : existing.price, options: safeOptions || existing.options };
                    }
                    return {
                      id: `dynamic-${index}`,
                      name: prodName || 'Produk Baru',
                      price: prodPrice,
                      description: 'Menu spesial Cheelok yang bikin nagih! 💖',
                      image: prodImage,
                      options: safeOptions
                    };
                  })
                : ISI_OPTIONS
            ).map((product: Product) => (
              <ProductCard key={product.id} item={product} onAdd={addToCart} />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* --- Super Cute Marquee Separator --- */}
      <div className="w-full mt-12 py-4 bg-brand-pink relative overflow-hidden border-y border-pink-200/30 flex items-center shadow-inner">
        <div className="absolute inset-0 opacity-10 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-6 items-center w-max z-10"
        >
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-white font-display font-black tracking-widest uppercase text-base flex items-center gap-2 drop-shadow-sm">
                 Cheelok_Chill
              </span>
              <span className="text-2xl animate-spin-slow" style={{ animationDuration: '4s' }}>🌸</span>
              <span className="text-pink-100 font-display font-bold tracking-wider uppercase text-sm">
                 Teman Nyemil
              </span>
              <span className="text-2xl opacity-80 animate-pulse">💖</span>
              <span className="text-white font-display font-black tracking-widest uppercase text-base drop-shadow-sm">
                 Estetik & Lumer
              </span>
              <span className="text-lg opacity-80 animate-bounce text-brand-orange">✨</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* --- Testimonials --- */}
      <section id="testimonials" className="py-24 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 relative">
             <div className="absolute text-5xl opacity-40 top-0 left-10 hidden md:block -rotate-12">💖</div>
             <div className="absolute text-4xl opacity-40 bottom-0 right-10 hidden md:block rotate-12">✨</div>
             <h2 className="text-4xl font-handwriting text-brand-pink mb-2">Kata Bestie-bestie...</h2>
             <h3 className="text-3xl font-display font-black text-gray-800 mb-2">Review Jujur Mahasiswi</h3>
             <p className="text-gray-400 text-sm font-medium">Bukan endorse, aseli dari hati 🌸</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {(storeSettings?.reviews && storeSettings.reviews.length > 0 ? storeSettings.reviews : TESTIMONIALS).map((t: any, i: number) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-pink-50 relative"
            >
              <div className="flex items-center gap-1 text-brand-pink mb-4">
                {[1,2,3,4,5].map(star => <Star key={star} className="w-3 h-3 fill-current" />)}
              </div>
              <p className="text-gray-600 mb-8 italic text-sm font-medium leading-relaxed">"{t.comment || t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-pink rounded-full overflow-hidden shadow-md">
                  <img src={t.image || `https://i.pravatar.cc/100?u=${t.name}`} alt={t.name} />
                </div>
                <div>
                  <p className="font-display font-bold text-gray-800 text-sm leading-none mb-1">{t.name}</p>
                  <p className="text-[10px] text-brand-pink font-bold uppercase tracking-tighter">{t.role || 'Pelanggan Setia'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Tentang Kami --- */}
      <section id="about" className="px-4 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-black text-gray-800">Tentang <span className="text-brand-pink">Kami</span></h2>
          <p className="text-gray-500 font-medium mt-2">Berawal dari keisengan, jadi kesayangan perut netizen ✨</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="bg-pink-50 p-6 rounded-[2rem] border border-pink-100 relative h-full">
              <div className="absolute top-4 right-4 text-3xl opacity-50">👩‍🍳</div>
              <h3 className="font-display font-bold text-xl text-gray-800 mb-2">Tujuan Bisnis</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                Cheelok hadir untuk menjadi "teman nyemil" utama semua orang, terutama para mahasiswa. Kami ingin menyajikan cilok berkualitas dengan bumbu dan isian yang ga pelit, bikin perut kenyang dan mood naik lagi pas lagi beraktivitas.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-[3rem] border border-pink-200 text-center relative overflow-hidden flex flex-col items-center justify-center h-full">
             <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 rotate-12">💖</div>
             <motion.img 
               src="/logo.png" 
               alt="Cheelok Logo" 
               className="w-32 h-32 mx-auto mb-6 object-contain drop-shadow-md" 
               animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               onError={(e) => (e.currentTarget.style.display = 'none')} 
             />
             <h4 className="font-display font-black text-2xl text-gray-800 mb-2">Cheelok_Chill</h4>
             <p className="text-brand-pink font-bold text-sm mb-6 uppercase tracking-widest">Sejak 2026</p>
             <p className="text-gray-600 text-sm italic font-medium leading-relaxed max-w-sm mx-auto">"Cilok kita mungkin bentuknya nggak sempurna, tapi rasanya dijamin bikin bahagia."</p>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-pink-100 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center mb-8">
            <h1 className="text-4xl font-display font-black tracking-tighter text-brand-pink italic drop-shadow-sm uppercase mb-4" style={{ WebkitTextStroke: '1px var(--color-brand-accent)' }}>
              CHEELOK
            </h1>
            <p className="font-handwriting text-3xl text-brand-pink mt-2 -rotate-2">Chill Perutnya, Hemat Harganya 🌸</p>
          </div>
          <div className="flex gap-4 mb-8">
             <a href="https://instagram.com/cheelok_chill" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-xl bg-pink-50 flex items-center justify-center gap-2 text-brand-pink hover:bg-brand-pink hover:text-white transition-all transform hover:scale-105 font-bold text-sm tracking-wider uppercase">
                <Instagram className="w-5 h-5" /> Instagram
             </a>
             <a href="https://wa.me/6289691223205" target="_blank" rel="noreferrer" className="px-5 py-3 rounded-xl bg-pink-50 flex items-center justify-center gap-2 text-brand-pink hover:bg-brand-pink hover:text-white transition-all transform hover:scale-105 font-bold text-sm tracking-wider uppercase">
                <Phone className="w-5 h-5" /> WhatsApp
             </a>
          </div>
          <p className="font-medium text-gray-400 text-xs tracking-widest font-display text-center">
            © 2026 CHEELOK INDONESIA • CHILL PERUTNYA, HEMAT HARGANYA
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
              className="fixed right-0 top-0 h-[100dvh] w-full max-w-md bg-white z-[60] shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col border-l border-pink-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-pink text-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(255,107,139,0.3)]">
                     <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-display font-black uppercase tracking-widest text-gray-800">Tas Belanja 🌸</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-pink-50 text-brand-pink rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 pr-2 scrollbar-thin scrollbar-thumb-pink-100 pb-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                       <ShoppingBag className="w-10 h-10 text-brand-pink" />
                    </div>
                    <p className="font-black uppercase tracking-widest text-sm">Masih Kosong, Sis!</p>
                    <p className="text-xs font-medium italic mt-2 text-brand-pink">Yuk isi bensin nugasmu sekarang~</p>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4 bg-brand-bg p-4 rounded-[2rem] border border-pink-50">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border-2 border-white">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-0.5">
                               <p className="font-display font-black text-gray-700 leading-tight text-sm uppercase">{item.name}</p>
                               <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-400">
                                 <X className="w-4 h-4" />
                               </button>
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium mb-1 truncate">{item.kuah}</p>
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
                      
                      <div className="mt-8 p-4 bg-pink-50 rounded-2xl border border-dashed border-pink-200 relative overflow-hidden">
                        <div className="absolute -right-2 -bottom-2 text-4xl opacity-20">🎀</div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📝</span>
                          <p className="text-xs font-bold text-brand-deep-pink uppercase leading-relaxed">"Sumpah ini cheelok terenak yang pernah aku makan pas nugas! Kuahnya the best!" - Anisa, Mahasiswi 💖</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-pink-100 space-y-4">
                      <h4 className="font-display font-bold text-gray-800 text-sm">Info Pengambilan PO 🌸</h4>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-brand-pink uppercase tracking-widest mb-2">Nama Panggilan</label>
                        <input 
                          type="text" 
                          placeholder="Misal: Siska"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-4 py-3 bg-brand-bg border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink text-sm font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-brand-pink uppercase tracking-widest mb-2">Pilih Hari</label>
                          {storeSettings?.openPoDates && storeSettings.openPoDates.length > 0 ? (
                            <select 
                              value={poDate}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPODate(val);
                                let newTimes = storeSettings?.poDatesConfig?.[val]?.times || storeSettings?.poTimes || [];
                                if (newTimes.length === 0) newTimes = PO_TIMES;
                                if (newTimes.length > 0 && !newTimes.includes(poTime)) {
                                  setPOTime(newTimes[0]);
                                }
                              }}
                              className="w-full px-4 py-3 bg-brand-bg border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink text-sm font-medium"
                            >
                              {storeSettings.openPoDates.map((dateStr: string) => (
                                <option key={dateStr} value={dateStr}>
                                  {new Date(dateStr).toLocaleDateString('id-ID', { 
                                    weekday: 'long', day: 'numeric', month: 'long' 
                                  })}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input 
                              type="date"
                              value={poDate}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPODate(val);
                                let newTimes = storeSettings?.poDatesConfig?.[val]?.times || storeSettings?.poTimes || [];
                                if (newTimes.length === 0) newTimes = PO_TIMES;
                                if (newTimes.length > 0 && !newTimes.includes(poTime)) {
                                  setPOTime(newTimes[0]);
                                }
                              }}
                              className="w-full px-4 py-3 bg-brand-bg border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink text-sm text-gray-700 font-medium"
                            />
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-brand-pink uppercase tracking-widest mb-2">Pilih Jam</label>
                            <select 
                              value={poTime}
                              onChange={(e) => setPOTime(e.target.value)}
                              className="w-full px-4 py-3 bg-brand-bg border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink text-sm font-medium"
                            >
                              {(() => {
                                let times = (storeSettings?.poTimes && storeSettings.poTimes.length > 0) ? storeSettings.poTimes : PO_TIMES;
                                if (storeSettings?.poDatesConfig && storeSettings.poDatesConfig[poDate] && storeSettings.poDatesConfig[poDate].times) {
                                  times = storeSettings.poDatesConfig[poDate].times;
                                }
                                return times.map((time: string) => <option key={time} value={time}>{time}</option>);
                              })()}
                            </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-brand-pink uppercase tracking-widest mb-2">Metode Pembayaran</label>
                        <select 
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full px-4 py-3 bg-brand-bg border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink text-sm font-medium"
                        >
                          {PAYMENT_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
                        </select>
                      </div>

                      <AnimatePresence>
                        {paymentMethod === "Bayar Sekarang (Transfer)" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-white border border-pink-100 rounded-2xl flex flex-col items-center text-center">
                              <p className="text-sm font-bold text-gray-800 mb-3">Scan QRIS untuk Bayar</p>
                              <div className="w-full flex justify-center mb-3">
                                <img 
                                  src="/qris.jpg" 
                                  alt="QRIS Code" 
                                  className="w-48 h-auto object-contain rounded-xl border border-pink-100 shadow-sm"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                    if(fallback) fallback.style.display = 'flex';
                                  }}
                                />
                                <div className="hidden w-40 h-40 bg-brand-bg rounded-xl items-center justify-center border-2 border-dashed border-pink-200 flex-col text-center p-2">
                                  <QrCode className="w-10 h-10 text-brand-pink opacity-50 mb-2" />
                                  <span className="text-[10px] font-bold text-brand-pink">Upload file QRIS ke folder public/ dengan nama qris.jpg</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-gray-500 font-medium mb-1">Atau transfer manual ke:</p>
                              <div className="bg-pink-50 w-full py-4 rounded-lg space-y-1">
                                <p className="text-xl font-bold text-gray-800">Aplikasi DANA</p>
                                <p className="text-lg font-black text-brand-pink tracking-wider">081379104922</p>
                              </div>
                              <p className="text-[10px] text-gray-400 font-medium mt-3 italic">* Jangan lupa kirim bukti transfer ke mimin ya! 🌸</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-6 mt-4 border-t border-pink-100 space-y-4 flex-shrink-0 bg-white">

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

      {/* Floating Cart Button */}
      {totalItems > 0 && !isCartOpen && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-30 flex items-center gap-3 p-4 md:px-6 md:py-4 bg-brand-pink hover:bg-brand-deep-pink text-white rounded-full shadow-2xl shadow-brand-pink/40 transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" />
            <span className="absolute -top-2 -right-2 md:hidden w-5 h-5 bg-white text-brand-pink text-[10px] font-bold rounded-full flex items-center justify-center border border-brand-pink">
              {totalItems}
            </span>
          </div>
          <div className="hidden md:flex flex-col items-start px-2 border-l border-white/30 ml-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-pink-100">Tas Belanja ({totalItems})</span>
            <span className="text-sm font-black">Rp{totalPrice.toLocaleString('id-ID')}</span>
          </div>
        </motion.button>
      )}
    </div>
  );
}
