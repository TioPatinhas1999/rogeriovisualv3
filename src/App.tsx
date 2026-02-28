import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  ChevronUp, 
  X, 
  Send, 
  MapPin, 
  Truck, 
  Maximize, 
  ChevronDown,
  Image as ImageIcon,
  Phone
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
interface GalleryItem {
  id: string;
  title: string;
  images: string[];
}

// --- Constants ---
const WHATSAPP_NUMBER = "5519992219448";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'fachadas',
    title: 'Fachadas',
    images: [
      'https://picsum.photos/seed/fachada1/800/600',
      'https://picsum.photos/seed/fachada2/800/600',
      'https://picsum.photos/seed/fachada3/800/600',
      'https://picsum.photos/seed/fachada4/800/600',
    ]
  },
  {
    id: 'adesivagem',
    title: 'Adesivagem',
    images: [
      'https://picsum.photos/seed/adesivo1/800/600',
      'https://picsum.photos/seed/adesivo2/800/600',
      'https://picsum.photos/seed/adesivo3/800/600',
      'https://picsum.photos/seed/adesivo4/800/600',
    ]
  },
  {
    id: 'placas',
    title: 'Placas ACM e PVC',
    images: [
      'https://picsum.photos/seed/placa1/800/600',
      'https://picsum.photos/seed/placa2/800/600',
      'https://picsum.photos/seed/placa3/800/600',
      'https://picsum.photos/seed/placa4/800/600',
    ]
  },
  {
    id: 'banners',
    title: 'Banners e Faixas',
    images: [
      'https://picsum.photos/seed/banner1/800/600',
      'https://picsum.photos/seed/banner2/800/600',
      'https://picsum.photos/seed/banner3/800/600',
      'https://picsum.photos/seed/banner4/800/600',
    ]
  }
];

// --- Components ---

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Olá! Como posso ajudar você hoje com comunicação visual?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: messages })
      });
      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: `⚠️ ${data.error}` 
        }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: data.text || 'Desculpe, tive um problema.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Erro de conexão. Verifique se o servidor está rodando.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden flex flex-col border border-gray-200"
          >
            <div className="bg-blue-primary p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-semibold">Atendimento Rogério Visual</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
                <X size={20} />
              </button>
            </div>
            
            <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    m.role === 'user' ? "bg-blue-primary text-white rounded-tr-none" : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-white flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua dúvida..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary/50"
              />
              <button 
                onClick={handleSend}
                className="bg-blue-primary text-white p-2 rounded-full hover:bg-blue-800 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-primary text-white p-4 rounded-full shadow-xl flex items-center gap-2"
      >
        <MessageCircle size={24} />
        {!isOpen && <span className="hidden sm:inline font-medium">Falar com IA</span>}
      </motion.button>
    </div>
  );
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryItem | null>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-navy text-white font-sans selection:bg-blue-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-navy/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo Concept - stylized for premium feel */}
            <div className="relative w-12 h-12 bg-blue-primary rounded-lg flex items-center justify-center overflow-hidden border border-white/20">
               <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
               <ImageIcon className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tighter">ROGÉRIO VISUAL</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => scrollTo('inicio')} className="px-4 py-2 text-sm font-medium hover:text-blue-400 transition-colors">Início</button>
            <button onClick={() => scrollTo('duvidas')} className="px-4 py-2 text-sm font-medium hover:text-blue-400 transition-colors">Dúvidas</button>
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="bg-blue-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-primary/20">Contato</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-premium rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
              TRANSFORMANDO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">IDEIAS EM IMPACTO</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
              Soluções completas em comunicação visual para destacar sua marca com sofisticação e qualidade.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollTo('galeria')}
                className="bg-white text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                Ver Portfólio <ChevronDown size={20} />
              </button>
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
              >
                Solicitar Orçamento <Phone size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ / Dúvidas Section */}
      <section id="duvidas" className="py-24 bg-navy-light px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Dúvidas Frequentes</h2>
            <div className="h-1.5 w-24 bg-blue-primary mx-auto rounded-full" />
          </div>

          <div className="grid gap-6">
            {[
              { 
                q: "Quais os valores dos serviços?", 
                a: "Trabalhamos com valores por m², porém cada projeto é único. O valor final depende do material escolhido (ACM, PVC, Lona, etc) e da complexidade da instalação.",
                icon: <Maximize className="text-blue-400" />
              },
              { 
                q: "Onde vocês atendem?", 
                a: "Atuamos exclusivamente em São João da Boa Vista - SP, garantindo agilidade e foco total na qualidade para nossa região.",
                icon: <MapPin className="text-blue-400" />
              },
              { 
                q: "Possuem serviço de entrega?", 
                a: "Sim! Para seu melhor conforto, oferecemos o serviço de leva e traz. Retiramos o material ou fazemos a entrega técnica no seu local.",
                icon: <Truck className="text-blue-400" />
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-navy p-8 rounded-3xl border border-white/5 hover:border-blue-primary/50 transition-all group"
              >
                <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-blue-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.q}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-gray-400">Clique em uma categoria para ver exemplos reais de nosso trabalho.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GALLERY_ITEMS.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedCategory(item)}
                className="relative aspect-square rounded-3xl overflow-hidden group border border-white/5"
              >
                <img 
                  src={item.images[0]} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-8 text-left">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <span className="text-sm text-blue-400 font-medium flex items-center gap-2">
                    Ver Fotos <Maximize size={14} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Galeria */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy/95 backdrop-blur-xl"
          >
            <div className="relative max-w-6xl w-full">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors flex items-center gap-2 font-bold"
              >
                FECHAR <X size={24} />
              </button>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">{selectedCategory.title}</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedCategory.images.map((img, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="aspect-square rounded-2xl overflow-hidden border border-white/10"
                  >
                    <img src={img} alt={`${selectedCategory.title} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-20 bg-navy-light border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-primary rounded-lg flex items-center justify-center border border-white/20">
               <ImageIcon className="text-white" size={20} />
            </div>
            <span className="text-lg font-bold tracking-tighter">ROGÉRIO VISUAL</span>
          </div>

          <p className="text-gray-500 text-sm mb-8 text-center">
            © {new Date().getFullYear()} Rogério Visual. Todos os direitos reservados. <br />
            São João da Boa Vista - SP
          </p>

          <button 
            onClick={() => scrollTo('inicio')}
            className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-full transition-all border border-white/10"
          >
            <ChevronUp size={24} />
          </button>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
