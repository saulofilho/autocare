import React, { useState } from 'react';
import { FuelLog, MaintenanceRecord, Vehicle } from '../../types/vehicle';
import { initialCostBreakdowns, initialOptimizationTips } from '../../data/mockData';
import { 
  BarChart3, 
  TrendingDown, 
  PieChart, 
  DollarSign, 
  Coins, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  Car,
  Lightbulb,
  ChevronRight
} from 'lucide-react';

interface CostReportsProps {
  vehicle: Vehicle;
  fuelLogs: FuelLog[];
  maintenanceRecords: MaintenanceRecord[];
}

export const CostReports: React.FC<CostReportsProps> = ({
  vehicle,
  fuelLogs,
  maintenanceRecords
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('Mar/2026');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const currentMonthData = initialCostBreakdowns.find(b => b.month === selectedMonth) || initialCostBreakdowns[0];

  // Calculate annual potential savings
  const totalPotentialAnnualSavings = initialOptimizationTips.reduce((acc, curr) => acc + curr.estimatedSavingsYearly, 0);

  // Maximum monthly total for proportional bar scaling
  const maxTotal = Math.max(...initialCostBreakdowns.map(b => b.total));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#f5f5f7] tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-[#2997ff]" />
            Relatórios Financeiros & Otimização de Custos
          </h2>
          <p className="text-xs text-[#86868b] mt-1 tracking-tight">
            Análise detalhada de despesas operacionais e recomendações inteligentes para reduzir o custo por quilômetro.
          </p>
        </div>

        {/* Apple-style month selector pills */}
        <div className="inline-flex p-1 bg-white/[0.04] rounded-full border border-white/[0.08]">
          {initialCostBreakdowns.map(b => (
            <button
              key={b.month}
              onClick={() => setSelectedMonth(b.month)}
              className={`px-3 py-1 text-xs rounded-full font-medium tracking-tight transition-all cursor-pointer ${
                selectedMonth === b.month
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-[#86868b] hover:text-[#f5f5f7]'
              }`}
            >
              {b.month}
            </button>
          ))}
        </div>
      </div>

      {/* Apple-style Bento Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex flex-col justify-between">
          <span className="text-[11px] font-medium text-[#86868b] tracking-tight">Gasto Total ({selectedMonth})</span>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-semibold text-[#f5f5f7] font-mono tracking-tight">
              R$ {currentMonthData.total.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-[#86868b]">Combustível, manutenção e fixos</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex flex-col justify-between">
          <span className="text-[11px] font-medium text-[#86868b] tracking-tight">Gasto com Combustível</span>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-semibold text-[#2997ff] font-mono tracking-tight">
              R$ {currentMonthData.fuel.toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-[#86868b]">
            {Math.round((currentMonthData.fuel / currentMonthData.total) * 100)}% do orçamento total
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex flex-col justify-between">
          <span className="text-[11px] font-medium text-[#86868b] tracking-tight">Manutenções do Mês</span>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-semibold text-[#ff9f0a] font-mono tracking-tight">
              R$ {currentMonthData.maintenance.toFixed(2)}
            </span>
          </div>
          <span className="text-[11px] text-[#86868b]">
            {currentMonthData.maintenance > 0 ? 'Revisão periódica programada' : 'Nenhuma corretiva necessária'}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex flex-col justify-between">
          <span className="text-[11px] font-medium text-[#86868b] tracking-tight">Potencial de Economia</span>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-semibold text-[#30d158] font-mono tracking-tight">
              R$ {totalPotentialAnnualSavings.toLocaleString()}
            </span>
            <span className="text-xs text-[#30d158] font-medium">/ano</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#30d158]">
            <TrendingDown className="w-3 h-3" />
            <span>Aplicando as dicas de otimização</span>
          </div>
        </div>
      </div>

      {/* Monthly Comparative Apple-Card Chart */}
      <div className="p-6 rounded-3xl bg-[#161617] border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#f5f5f7] tracking-tight">
              Evolução Mensal de Despesas
            </h3>
            <p className="text-xs text-[#86868b] mt-0.5">
              Comparativo detalhado de gastos operacionais nos últimos 4 meses.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#86868b]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2997ff]" />
              <span>Combustível</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff9f0a]" />
              <span>Manutenção</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
              <span>Custos Fixos</span>
            </div>
          </div>
        </div>

        {/* Stacked Bars */}
        <div className="space-y-4">
          {initialCostBreakdowns.map(b => {
            const isCurrent = b.month === selectedMonth;
            const barWidthPercent = Math.max(20, (b.total / maxTotal) * 100);
            const fuelPercent = (b.fuel / b.total) * 100;
            const maintPercent = (b.maintenance / b.total) * 100;
            const fixedPercent = (b.fixedCosts / b.total) * 100;

            return (
              <div 
                key={b.month}
                onClick={() => setSelectedMonth(b.month)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-white/[0.06] border border-white/[0.14]' 
                    : 'bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`font-semibold tracking-tight ${isCurrent ? 'text-white' : 'text-[#86868b]'}`}>
                    {b.month} {isCurrent && '• Selecionado'}
                  </span>
                  <span className="font-mono font-semibold text-[#f5f5f7]">
                    R$ {b.total.toFixed(2)}
                  </span>
                </div>

                <div className="w-full h-3 bg-white/[0.06] rounded-full overflow-hidden flex">
                  <div 
                    title={`Combustível: R$ ${b.fuel}`}
                    className="h-full bg-[#2997ff] transition-all duration-500" 
                    style={{ width: `${fuelPercent}%` }} 
                  />
                  <div 
                    title={`Manutenção: R$ ${b.maintenance}`}
                    className="h-full bg-[#ff9f0a] transition-all duration-500" 
                    style={{ width: `${maintPercent}%` }} 
                  />
                  <div 
                    title={`Fixos: R$ ${b.fixedCosts}`}
                    className="h-full bg-white/20 transition-all duration-500" 
                    style={{ width: `${fixedPercent}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optimization Action Plans - Apple Feature Style */}
      <div className="space-y-3.5">
        <div>
          <h3 className="text-lg font-semibold text-[#f5f5f7] tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#30d158]" />
            Planos Práticos para Otimização de Custos
          </h3>
          <p className="text-xs text-[#86868b] mt-0.5">
            Ajustes comportamentais e preventivos calculados especificamente para o perfil do seu veículo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {initialOptimizationTips.map((tip, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30">
                    {tip.category}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-sm font-semibold text-[#30d158]">
                    <span>+ R$ {tip.estimatedSavingsYearly}/ano</span>
                  </div>
                </div>

                <h4 className="font-semibold text-base text-[#f5f5f7] tracking-tight mb-1.5">
                  {tip.title}
                </h4>
                <p className="text-xs text-[#86868b] leading-relaxed mb-4">
                  {tip.description}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs">
                <span className="text-[#86868b]">Impacto no Veículo:</span>
                <span className="font-medium text-[#f5f5f7]">{tip.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
