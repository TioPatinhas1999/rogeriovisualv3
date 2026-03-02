/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronUp, 
  Send, 
  X, 
  Layout, 
  Home, 
  Truck, 
  Flag, 
  Square
} from 'lucide-react';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';

const SERVICES = [
  { id: 'fachadas', title: 'Fachadas', icon: Layout, image: 'https://picsum.photos/seed/fachada/800/600' },
  { id: 'residencial', title: 'Adesivagem Residencial', icon: Home, image: 'https://picsum.photos/seed/residencial/800/600' },
  { id: 'veiculos', title: 'Adesivagem de Veículos', icon: Truck, image: 'https://picsum.photos/seed/veiculos/800/600' },
  { id: 'banners', title: 'Banners e Faixas', icon: Flag, image: 'https://picsum.photos/seed/banners/800/600' },
  { id: 'placas', title: 'Placas PVC e ACM', icon: Square, image: 'https://picsum.photos/seed/placas/800/600' },
];

export default function App() {
  const [activeGallery, setActiveGallery] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<{ title: string, content: string } | null>(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Premium Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-800/10 blur-[100px] rounded-full" />
      </div>

      {/* Hero Section - Centered and Larger Logo */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Large Centered Logo */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                <defs>
                  <linearGradient id="cube-top-hero" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="cube-front-hero" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                  <linearGradient id="cube-side-hero" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1d4ed8" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </linearGradient>
                </defs>
                <path d="M50 20 L80 35 L50 50 L20 35 Z" fill="url(#cube-top-hero)" />
                <path d="M20 35 L50 50 L50 85 L20 70 Z" fill="url(#cube-front-hero)" />
                <path d="M50 50 L80 35 L80 70 L50 85 Z" fill="url(#cube-side-hero)" />
                <path d="M45 85 Q50 95 55 85 L50 80 Z" fill="#1e3a8a" opacity="0.6" />
              </svg>
            </div>

            <h1 className="text-6xl md:text-9xl font-black text-white mb-12 tracking-tighter leading-none">
              Rogério<span className="text-blue-500">Visual</span>
            </h1>

            {/* Navigation Buttons below Logo */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <button 
                onClick={scrollToTop}
                className="px-10 py-4 bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all text-lg"
              >
                Início
              </button>
              <button 
                onClick={() => scrollToSection('servicos')}
                className="px-10 py-4 bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all text-lg"
              >
                Serviços
              </button>
              <button 
                onClick={() => scrollToSection('duvidas')}
                className="px-10 py-4 bg-white/5 backdrop-blur-sm text-white border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all text-lg"
              >
                Dúvidas
              </button>
              <a 
                href="https://wa.me/5519992219448" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all text-lg shadow-xl shadow-blue-600/20"
              >
                Contato
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dúvidas Section */}
      <section id="duvidas" className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFAQ({ 
                title: 'Prestação de Serviços', 
                content: 'Atendemos exclusivamente a região de **São João da Boa Vista - SP**, garantindo agilidade e qualidade no suporte local.' 
              })}
              className="p-10 bg-blue-600 border border-blue-400/30 rounded-3xl text-left hover:bg-blue-500 transition-all group shadow-xl shadow-blue-900/20"
            >
              <h3 className="text-white text-xl font-bold mb-3 flex items-center justify-between">
                1. Prestação de Serviços
                <Send size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-blue-100 text-base">Clique para ver nossa área de atuação.</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFAQ({ 
                title: 'Valores', 
                content: 'Trabalhamos com preços competitivos e materiais de alta qualidade:\n\n' +
                         '• **Lona:** R$ 100/m²\n' +
                         '• **Adesivo:** R$ 100/m²\n' +
                         '• **PVC Adesivado:** R$ 100/m²\n' +
                         '• **ACM:** R$ 100/m²'
              })}
              className="p-10 bg-blue-600 border border-blue-400/30 rounded-3xl text-left hover:bg-blue-500 transition-all group shadow-xl shadow-blue-900/20"
            >
              <h3 className="text-white text-xl font-bold mb-3 flex items-center justify-between">
                2. Valores
                <Send size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-blue-100 text-base">Consulte nossa tabela de preços base.</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFAQ({ 
                title: 'Serviço Leva e Tráz', 
                content: 'Oferecemos comodidade para nossos clientes. Para o serviço de coleta e entrega, por favor **verificar disponibilidade** e taxas para sua localização específica.' 
              })}
              className="p-10 bg-blue-600 border border-blue-400/30 rounded-3xl text-left hover:bg-blue-500 transition-all group shadow-xl shadow-blue-900/20"
            >
              <h3 className="text-white text-xl font-bold mb-3 flex items-center justify-between">
                3. Serviço Leva e Tráz
                <Send size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-blue-100 text-base">Saiba mais sobre nossa logística.</p>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nossos Serviços</h2>
            <p className="text-slate-400">Soluções completas para todas as suas necessidades visuais.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-[#0f172a] border border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-all cursor-pointer overflow-hidden"
                onClick={() => setActiveGallery(service.id)}
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <service.icon size={80} />
                </div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                    <service.icon className="text-blue-500" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-slate-400 text-sm mb-6">Explore nossa galeria de projetos realizados nesta categoria.</p>
                  <button className="text-blue-500 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Ver Galeria <Send size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#020617]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-slate-500 text-sm">
            2026 RogérioVisual - São João da Boa Vista - SP
          </div>
        </div>
      </footer>

      {/* Gallery Modal */}
      <AnimatePresence>
        {activeGallery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-4xl bg-[#0f172a] rounded-3xl overflow-hidden border border-white/10">
              <button 
                onClick={() => setActiveGallery(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
              >
                <X size={24} />
              </button>
              
              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-8">
                  {SERVICES.find(s => s.id === activeGallery)?.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-video bg-slate-800 rounded-2xl overflow-hidden">
                      <img 
                        src={`https://picsum.photos/seed/${activeGallery}-${i}/800/600`} 
                        alt="Gallery item"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ Modal */}
      <AnimatePresence>
        {activeFAQ && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-lg bg-[#0f172a] rounded-3xl overflow-hidden border border-white/10 p-8">
              <button 
                onClick={() => setActiveFAQ(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-blue-400 mb-6">{activeFAQ.title}</h2>
              <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                <ReactMarkdown>{activeFAQ.content}</ReactMarkdown>
              </div>
              <button 
                onClick={() => setActiveFAQ(null)}
                className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 left-6 z-50">
        <button 
          onClick={scrollToTop}
          className="w-14 h-14 bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 text-white rounded-full flex items-center justify-center transition-all shadow-xl border border-white/10 hover:scale-110"
          title="Voltar ao topo"
        >
          <ChevronUp size={28} />
        </button>
      </div>
    </div>
  );
}
