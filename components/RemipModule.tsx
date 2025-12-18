
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Search, Globe, AlertCircle, ArrowUpRight, TrendingDown, Filter, RefreshCw, CheckCircle, Bell, TrendingUp, Lock, Sparkles, Loader2, ExternalLink, Users, Mail } from 'lucide-react';
import { COMMODITY_DATA, BUYERS, FORECAST_DATA } from '../constants';
import { UserRole } from '../types';
import { GoogleGenAI } from "@google/genai";

interface RemipProps {
  onShowToast: (msg: string, type: 'success' | 'info' | 'error') => void;
  connectedBuyers: string[];
  onConnect: (name: string) => void;
  userRole: UserRole;
}

export const RemipModule: React.FC<RemipProps> = ({ onShowToast, connectedBuyers, onConnect, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [alertSubs, setAlertSubs] = useState<boolean>(false);
  const [showForecast, setShowForecast] = useState(false);
  
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiSources, setAiSources] = useState<{web: {uri: string, title: string}}[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const toggleAlerts = () => {
    setAlertSubs(!alertSubs);
    onShowToast(alertSubs ? 'Alerts deactivated' : 'Subscribed to price alerts', 'success');
  };

  const handleAiAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);
    setAiSources([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Market analysis for: ${aiQuery}. Focus on news and real-time trends.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      setAiResponse(response.text || "No insights found.");
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        setAiSources(chunks as any);
      }
    } catch (err) {
      onShowToast("Service error. Using fallback.", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredBuyers = BUYERS.filter(buyer => 
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const chartData = showForecast ? [...COMMODITY_DATA, ...FORECAST_DATA] : COMMODITY_DATA;

  return (
    <div className="space-y-6 pb-20 animate-fade-in transition-colors">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-jungle dark:text-white tracking-tighter uppercase transition-colors">Market Intelligence</h2>
          <p className="text-brand-hooker dark:text-brand-lightgray/60 mt-1 font-medium transition-colors">Real-time trade data and analysis.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={toggleAlerts}
            className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-brand border ${alertSubs ? 'bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle border-brand-jungle dark:border-brand-pistachio' : 'bg-white dark:bg-brand-darksurface text-brand-jungle dark:text-white border-brand-lightgray/30 dark:border-white/10 hover:bg-brand-lightgray/5 dark:hover:bg-white/5'}`}
          >
            <Bell size={16} /> {alertSubs ? 'Active' : 'Subscribe'}
          </button>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="bg-white dark:bg-brand-darksurface p-8 rounded-[2rem] border border-brand-lightgray/30 dark:border-white/10 shadow-brand overflow-hidden relative transition-colors">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-brand-jungle dark:bg-brand-pistachio text-brand-pistachio dark:text-brand-jungle rounded-2xl flex items-center justify-center shadow-lg transition-colors">
               <Sparkles size={24} />
            </div>
            <div>
               <h3 className="font-black text-lg text-brand-jungle dark:text-white uppercase tracking-tight transition-colors">AI Market Assistant</h3>
               <p className="text-brand-hooker dark:text-brand-lightgray/40 text-[10px] font-black uppercase tracking-widest opacity-40 transition-colors">Online</p>
            </div>
          </div>
          
          <form onSubmit={handleAiAnalysis} className="flex flex-col sm:flex-row gap-3">
             <input 
               type="text" 
               value={aiQuery}
               onChange={(e) => setAiQuery(e.target.value)}
               placeholder="Inquire about global demand..."
               className="flex-1 bg-brand-lightgray/10 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl h-14 px-6 text-sm font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio focus:bg-white dark:focus:bg-white/10 transition-all text-brand-jungle dark:text-white"
             />
             <button 
               disabled={isAiLoading}
               className="bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle px-8 h-14 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-hooker dark:hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-brand"
             >
               {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <TrendingUp size={18} />}
               Analyze
             </button>
          </form>

          {aiResponse && (
            <div className="mt-8 p-8 bg-brand-lightgray/5 dark:bg-white/5 rounded-3xl border border-brand-lightgray/20 dark:border-white/10 animate-slide-up">
               <div className="prose prose-sm max-w-none text-brand-jungle dark:text-white whitespace-pre-wrap leading-relaxed font-medium">
                 {aiResponse}
               </div>
               {aiSources.length > 0 && (
                 <div className="mt-8 pt-6 border-t border-brand-lightgray/20 dark:border-white/10">
                    <h4 className="text-[10px] font-black text-brand-hooker dark:text-brand-lightgray/40 uppercase tracking-widest mb-4">Sources</h4>
                    <div className="flex flex-wrap gap-2">
                       {aiSources.map((source, idx) => source.web && (
                         <a 
                           key={idx} 
                           href={source.web.uri} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 border border-brand-lightgray/30 dark:border-white/20 rounded-full text-[10px] font-black text-brand-hooker dark:text-brand-lightgray hover:text-brand-pistachio hover:border-brand-pistachio transition-all shadow-sm uppercase tracking-widest"
                         >
                           <Globe size={12} /> {source.web.title}
                         </a>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Pulse and Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-brand-darksurface p-8 rounded-[2rem] shadow-brand border border-brand-lightgray/30 dark:border-white/10 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <h3 className="font-black text-brand-jungle dark:text-white text-lg uppercase tracking-tight flex items-center gap-3 transition-colors">
                <div className="w-2 h-2 bg-brand-pistachio rounded-full shadow-pistachio-glow"></div>
                Price Trends
            </h3>
            <button onClick={() => setShowForecast(!showForecast)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${showForecast ? 'bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle border-brand-jungle dark:border-brand-pistachio shadow-brand' : 'bg-brand-lightgray/10 dark:bg-white/5 text-brand-hooker dark:text-brand-lightgray/60 border-brand-lightgray/30 dark:border-white/10 hover:text-brand-jungle dark:hover:text-white'}`}>
              {showForecast ? 'Historical Only' : 'Forecast'}
            </button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(18, 43, 29, 0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CC97F', fontSize: 10, fontWeight: 900}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CC97F', fontSize: 10, fontWeight: 900}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: '#122B1D', boxShadow: '0 10px 25px rgba(18, 43, 29, 0.1)', fontSize: '12px', fontWeight: 'bold', color: '#fff'}} 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9CC97F' }} />
                <Line type="monotone" dataKey="cocoa" stroke="#9CC97F" strokeWidth={4} dot={false} name="Cocoa" activeDot={{r: 8, strokeWidth: 0, fill: '#fff'}} />
                <Line type="monotone" dataKey="cashew" stroke="#CDDECB" strokeWidth={4} dot={false} name="Cashew" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-brand-darksurface p-8 rounded-[2rem] shadow-brand border border-brand-lightgray/30 dark:border-white/10 flex flex-col h-full transition-colors">
          <div className="flex items-center justify-between mb-8">
             <h3 className="font-black text-brand-jungle dark:text-white text-lg uppercase tracking-tight transition-colors">Buyer Directory</h3>
             <div className="p-2 bg-brand-pistachio/10 text-brand-pistachio rounded-xl"><Globe size={20} /></div>
          </div>

          <div className="relative mb-8">
             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-hooker/40 dark:text-white/20 transition-colors" />
             <input 
               type="text"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Filter directory..."
               className="w-full pl-11 pr-4 h-12 bg-brand-lightgray/10 dark:bg-white/5 border-2 border-brand-lightgray/20 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:border-brand-jungle dark:focus:border-brand-pistachio transition-all text-brand-jungle dark:text-white"
             />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
             {filteredBuyers.map(buyer => (
               <div key={buyer.id} className="p-5 rounded-3xl border border-brand-lightgray/20 dark:border-white/10 bg-brand-lightgray/5 dark:bg-white/5 hover:bg-white dark:hover:bg-brand-jungle/50 hover:border-brand-pistachio transition-all group">
                  <div className="flex justify-between items-start mb-2 gap-2">
                     <h4 className="font-black text-brand-jungle dark:text-white text-sm uppercase tracking-tight transition-colors break-words flex-1">{buyer.name}</h4>
                     <span className="text-[9px] font-black uppercase text-brand-hooker dark:text-brand-lightgray/60 tracking-widest transition-colors shrink-0">{buyer.country}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                     {buyer.products.map(p => (
                       <span key={p} className="text-[8px] font-black px-2 py-0.5 bg-brand-jungle/5 dark:bg-white/10 text-brand-jungle dark:text-brand-pistachio rounded-full uppercase tracking-widest transition-colors">{p}</span>
                     ))}
                  </div>
                  <button 
                    onClick={() => { if (!connectedBuyers.includes(buyer.name)) onConnect(buyer.name); }}
                    className={`w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      connectedBuyers.includes(buyer.name) 
                        ? 'bg-brand-lightgray/20 dark:bg-white/10 text-brand-hooker dark:text-brand-lightgray/40 cursor-default' 
                        : 'bg-brand-jungle dark:bg-brand-pistachio text-white dark:text-brand-jungle hover:bg-brand-hooker dark:hover:bg-white shadow-brand transition-colors'
                    }`}
                  >
                    {connectedBuyers.includes(buyer.name) ? <CheckCircle size={14} /> : <Mail size={14} />}
                    {connectedBuyers.includes(buyer.name) ? 'Contacted' : 'Connect'}
                  </button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
