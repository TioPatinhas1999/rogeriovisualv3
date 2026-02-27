/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronUp, 
  MessageCircle, 
  Image as ImageIcon, 
  Send, 
  X, 
  Layout, 
  Home, 
  Truck, 
  Flag, 
  Square,
  Loader2,
  Sparkles,
  Bot
} from 'lucide-react';
import { cn } from './lib/utils';
import { chatWithGemini, generateImage } from './services/aiService';
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
  const [showChat, setShowChat] = useState(false);
  const [showImageGen, setShowImageGen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      let botResponse = '';
      setChatMessages(prev => [...prev, { role: 'bot', text: '' }]);
      
      const stream = chatWithGemini(userMsg, []);
      for await (const chunk of stream) {
        botResponse += chunk;
        setChatMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].text = botResponse;
          return newMsgs;
        });
      }
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [...prev, { role: 'bot', text: 'Desculpe, tive um problema ao processar sua mensagem.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImageUrl(null);
    try {
      const url = await generateImage(imagePrompt, imageSize);
      setGeneratedImageUrl(url);
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar imagem. Verifique sua chave de API.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Premium Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-800/10 blur-[100px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={scrollToTop}>
            <div className="relative w-14 h-14 flex items-center justify-center">
              {/* SVG Recreation of the 3D Cube Logo */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl transform-gpu transition-transform group-hover:scale-110">
                <defs>
                  <linearGradient id="cube-top" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="cube-front" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                  <linearGradient id="cube-side" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1d4ed8" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </linearGradient>
                </defs>
                {/* 3D Cube Shape */}
                <path d="M50 20 L80 35 L50 50 L20 35 Z" fill="url(#cube-top)" />
                <path d="M20 35 L50 50 L50 85 L20 70 Z" fill="url(#cube-front)" />
                <path d="M50 50 L80 35 L80 70 L50 85 Z" fill="url(#cube-side)" />
                {/* The "tail" shadow effect */}
                <path d="M45 85 Q50 95 55 85 L50 80 Z" fill="#1e3a8a" opacity="0.6" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold tracking-tight text-[#0f172a] dark:text-white leading-none">
                RogérioVisual
              </h1>
              <div className="h-0.5 w-full bg-blue-600 mt-1 opacity-80" />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={scrollToTop} className="hover:text-blue-400 transition-colors text-sm font-medium">Início</button>
            <button onClick={() => scrollToSection('servicos')} className="hover:text-blue-400 transition-colors text-sm font-medium">Serviços</button>
            <button onClick={() => scrollToSection('duvidas')} className="hover:text-blue-400 transition-colors text-sm font-medium">Dúvidas</button>
            <a 
              href="https://wa.me/5519992219448" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              Contato
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              Líder em São João da Boa Vista
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.1]">
              Comunicação visual de <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">alto impacto</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Projetos modernos que elevam sua marca ao próximo nível. Transformamos sua visão em realidade com precisão e sofisticação.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => scrollToSection('servicos')}
                className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-all shadow-xl"
              >
                Ver Serviços
              </button>
              <button 
                onClick={() => setShowImageGen(true)}
                className="px-8 py-4 bg-blue-600/10 text-blue-400 border border-blue-500/30 rounded-full font-bold hover:bg-blue-500/20 transition-all"
              >
                Simular Projeto (IA)
              </button>
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

      {/* AI Chat Bot */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-80 md:w-96 h-[500px] bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-4 bg-blue-600 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Bot size={20} />
                  <span className="font-bold">Assistente RogérioVisual</span>
                </div>
                <button onClick={() => setShowChat(false)} className="text-white/80 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                {chatMessages.length === 0 && (
                  <div className="text-center py-10 text-slate-500 text-sm">
                    Olá! Como posso ajudar você hoje com seus projetos de comunicação visual?
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn(
                    "max-w-[85%] p-3 rounded-2xl text-sm",
                    msg.role === 'user' 
                      ? "bg-blue-600 text-white ml-auto rounded-tr-none" 
                      : "bg-slate-800 text-slate-200 mr-auto rounded-tl-none"
                  )}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ))}
                {isTyping && (
                  <div className="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none w-12 flex justify-center">
                    <Loader2 className="animate-spin" size={16} />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-white/5 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua dúvida..."
                  className="flex-1 bg-slate-800 border border-white/5 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500/50"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isTyping}
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setShowChat(!showChat)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
        >
          {showChat ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Image Generation Modal */}
      <AnimatePresence>
        {showImageGen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-2xl bg-[#0f172a] rounded-3xl overflow-hidden border border-white/10 p-8">
              <button 
                onClick={() => setShowImageGen(false)}
                className="absolute top-6 right-6 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <ImageIcon className="text-indigo-400" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">Simulador de Projetos IA</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Descreva seu projeto</label>
                  <textarea 
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Ex: Uma fachada moderna para loja de roupas com letreiro em ACM azul e iluminação LED..."
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 text-sm min-h-[100px] focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Qualidade da Imagem</label>
                    <div className="flex gap-2">
                      {(['1K', '2K', '4K'] as const).map(size => (
                        <button
                          key={size}
                          onClick={() => setImageSize(size)}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-xs font-bold transition-all border",
                            imageSize === size 
                              ? "bg-indigo-600 border-indigo-500 text-white" 
                              : "bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerateImage}
                    disabled={isGenerating || !imagePrompt.trim()}
                    className="mt-7 px-8 py-2 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    Gerar
                  </button>
                </div>

                {generatedImageUrl && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="aspect-square w-full bg-slate-800 rounded-2xl overflow-hidden border border-white/5"
                  >
                    <img src={generatedImageUrl} alt="Generated" className="w-full h-full object-cover" />
                  </motion.div>
                )}
                
                {isGenerating && (
                  <div className="aspect-square w-full bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center gap-4 border border-dashed border-white/10">
                    <Loader2 className="animate-spin text-indigo-500" size={40} />
                    <p className="text-slate-400 text-sm animate-pulse">Criando seu projeto visual...</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
