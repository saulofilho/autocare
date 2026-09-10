import React, { useState } from 'react';
import { initialMaintenanceTips } from '../../data/mockData';
import { MaintenanceTipItem } from '../../types/vehicle';
import { 
  Lightbulb, 
  Search, 
  Fuel, 
  Gauge, 
  AlertTriangle, 
  ShieldAlert, 
  Droplet, 
  Wind, 
  CheckCircle, 
  Coins, 
  ChevronDown, 
  ChevronUp,
  AlertCircle
} from 'lucide-react';

export const MaintenanceTips: React.FC = () => {
  const [tips] = useState<MaintenanceTipItem[]>(initialMaintenanceTips);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [expandedTipId, setExpandedTipId] = useState<string | null>('tip-01');

  const dashboardLights = [
    {
      name: 'Injeção Eletrônica',
      color: 'amber',
      action: 'Diagnóstico OBD-II',
      urgency: 'Média/Alta',
      explanation: 'Indica falha no sistema de queima, sensores, velas ou combustível adulterado. Se piscar, pare o carro imediatamente para evitar danificar o catalisador.'
    },
    {
      name: 'Pressão do Óleo',
      color: 'red',
      action: 'Pare Imediatamente',
      urgency: 'Crítica',
      explanation: 'A pressão de lubrificação caiu abaixo do limite seguro. Desligue o motor de imediato; operar com essa luz acesa funde o motor em menos de 2 minutos.'
    },
    {
      name: 'Temperatura do Motor',
      color: 'red',
      action: 'Pare o Veículo',
      urgency: 'Crítica',
      explanation: 'Superaquecimento do arrefecimento (acima de 110°C). Deixe o motor esfriar completamente antes de abrir o reservatório ou verificar o fluido.'
    },
    {
      name: 'Sistema de Freios',
      color: 'red',
      action: 'Atenção Total',
      urgency: 'Alta',
      explanation: 'Freio de mão acionado ou nível de fluido de freio baixo (indicando pastilhas no fim da vida útil ou vazamento hidráulico no circuito).'
    },
    {
      name: 'Sistema ABS & ESC',
      color: 'amber',
      action: 'Manutenção Preventiva',
      urgency: 'Média',
      explanation: 'O freio convencional opera normalmente, porém o controle de estabilidade e o antibloqueio foram desativados por falha de sensor de rotação.'
    },
    {
      name: 'Bateria & Alternador',
      color: 'red',
      action: 'Verifique Carga',
      urgency: 'Alta',
      explanation: 'O alternador não está recarregando a bateria. O carro funcionará apenas enquanto houver carga residual na bateria (cerca de 15 a 30 minutos).'
    }
  ];

  const filteredTips = tips.filter(tip => {
    const matchCat = activeCategory === 'all' || tip.category === activeCategory;
    const matchSearch = tip.title.toLowerCase().includes(search.toLowerCase()) ||
                        tip.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'Gauge': return <Gauge className="w-4 h-4 text-[#2997ff]" />;
      case 'AlertTriangle': return <AlertTriangle className="w-4 h-4 text-[#ff9f0a]" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-[#ff453a]" />;
      case 'Fuel': return <Fuel className="w-4 h-4 text-[#30d158]" />;
      case 'Droplet': return <Droplet className="w-4 h-4 text-[#2997ff]" />;
      case 'Wind': return <Wind className="w-4 h-4 text-[#30d158]" />;
      default: return <Lightbulb className="w-4 h-4 text-[#ff9f0a]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-[#f5f5f7] tracking-tight flex items-center gap-2.5">
          <Lightbulb className="w-5 h-5 text-[#ff9f0a]" />
          Guias Especializados de Manutenção
        </h2>
        <p className="text-xs text-[#86868b] mt-1 tracking-tight">
          Práticas preventivas e diagnósticos rápidos para maximizar a durabilidade e o valor do seu automóvel.
        </p>
      </div>

      {/* Apple Support Dashboard Lights Panel */}
      <div className="p-6 rounded-3xl bg-[#161617] border border-white/[0.08]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-[#ff453a]/10 text-[#ff453a] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#f5f5f7] tracking-tight">Guia Rápido: Luzes Espias do Painel</h3>
            <p className="text-xs text-[#86868b]">
              Luzes vermelhas indicam emergência e parada imediata; luzes amarelas alertam para verificação em oficina.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {dashboardLights.map((light, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      light.color === 'red' ? 'bg-[#ff453a] animate-pulse' : 'bg-[#ff9f0a]'
                    }`} />
                    <h4 className="font-semibold text-[#f5f5f7] text-xs tracking-tight">{light.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase ${
                    light.urgency === 'Crítica' ? 'bg-[#ff453a]/15 text-[#ff453a] border border-[#ff453a]/30' : 'bg-[#ff9f0a]/15 text-[#ff9f0a]'
                  }`}>
                    {light.action}
                  </span>
                </div>
                <p className="text-[11px] text-[#86868b] leading-relaxed">
                  {light.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-[#161617] rounded-2xl border border-white/[0.08]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-2.5" />
          <input
            id="input-search-tips"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar dicas (ex: óleo, freios, etanol, pneus)..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full pl-8 pr-3 py-1.5 text-xs text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none placeholder:text-[#86868b]"
          />
        </div>

        <div className="inline-flex p-1 bg-white/[0.04] rounded-full overflow-x-auto">
          {['all', 'Economia', 'Motor', 'Freios', 'Luzes do Painel'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs rounded-full font-medium tracking-tight transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Cards */}
      <div className="space-y-3">
        {filteredTips.map((tip) => {
          const isExpanded = expandedTipId === tip.id;
          return (
            <div 
              key={tip.id}
              className="rounded-3xl bg-[#161617] border border-white/[0.08] overflow-hidden transition-all hover:border-white/[0.14]"
            >
              <div 
                onClick={() => setExpandedTipId(isExpanded ? null : tip.id)}
                className="p-5 cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mt-0.5 shrink-0">
                    {getIcon(tip.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/[0.06] text-[#86868b]">
                        {tip.category}
                      </span>
                      <span className="text-[10px] text-[#86868b]">Nível: {tip.difficulty}</span>
                    </div>
                    <h3 className="font-semibold text-[#f5f5f7] text-sm tracking-tight">{tip.title}</h3>
                    <p className="text-xs text-[#86868b] mt-1 line-clamp-1 leading-relaxed">{tip.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#30d158]/10 border border-[#30d158]/20 text-[#30d158] text-xs font-semibold">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{tip.potentialSavings}</span>
                  </div>
                  <button className="text-[#86868b] hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 bg-white/[0.02] border-t border-white/[0.06] text-xs space-y-4 animate-in fade-in duration-150">
                  <p className="leading-relaxed text-[#f5f5f7] text-sm">
                    {tip.content}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#30d158]/[0.06] border border-[#30d158]/20 flex items-center justify-between text-xs">
                    <span className="text-[#86868b] font-medium">Impacto financeiro estimado:</span>
                    <span className="font-semibold text-[#30d158] font-mono">{tip.potentialSavings}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
