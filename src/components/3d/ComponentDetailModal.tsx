import React from 'react';
import { CarComponent3DInfo } from '../../types/vehicle';
import { 
  X, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  Coins, 
  Activity, 
  ShieldCheck,
  ChevronRight,
  Clock
} from 'lucide-react';

interface ComponentDetailModalProps {
  component: CarComponent3DInfo | null;
  onClose: () => void;
  onSchedule?: (componentName: string) => void;
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({
  component,
  onClose,
  onSchedule
}) => {
  if (!component) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="bg-[#161617] border border-white/[0.12] rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Apple Sheet Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/[0.08] text-[#86868b] border border-white/[0.06]">
                {component.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-tight ${
                component.urgency === 'critical'
                  ? 'bg-[#ff453a]/15 text-[#ff453a] border border-[#ff453a]/30'
                  : component.urgency === 'warning'
                  ? 'bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/30'
                  : 'bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30'
              }`}>
                Saúde: {component.healthPercent}%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#f5f5f7] tracking-tight">
              {component.name}
            </h2>
          </div>

          <button
            id="btn-close-component-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-[#86868b] hover:text-[#f5f5f7] flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-xs text-[#f5f5f7]">
          {/* How It Works */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1.5">
            <h4 className="font-semibold text-xs text-[#f5f5f7] flex items-center gap-2 tracking-tight">
              <Activity className="w-3.5 h-3.5 text-[#2997ff]" />
              Princípio de Funcionamento Mecânico
            </h4>
            <p className="text-[#86868b] leading-relaxed text-xs">
              {component.howItWorks}
            </p>
          </div>

          {/* Symptoms of Wear & Failure */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
            <h4 className="font-semibold text-xs text-[#f5f5f7] flex items-center gap-2 tracking-tight">
              <AlertTriangle className="w-3.5 h-3.5 text-[#ff9f0a]" />
              Sintomas Comuns de Desgaste ou Falha
            </h4>
            <ul className="space-y-1.5">
              {component.symptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[#86868b] text-xs leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff9f0a] mt-1.5 shrink-0" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Maintenance & Care Tip */}
          <div className="p-4 rounded-2xl bg-[#2997ff]/[0.06] border border-[#2997ff]/20 space-y-1.5">
            <h4 className="font-semibold text-xs text-[#2997ff] flex items-center gap-2 tracking-tight">
              <Lightbulb className="w-3.5 h-3.5" />
              Recomendação do Especialista
            </h4>
            <p className="text-[#f5f5f7] leading-relaxed text-xs">
              {component.maintenanceTip}
            </p>
          </div>

          {/* Estimated Cost & Replacement Interval */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-medium text-[#86868b] block mb-1">Custo Médio de Substituição</span>
              <span className="font-mono text-base font-semibold text-[#30d158]">{component.estimatedCost}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-medium text-[#86868b] block mb-1">Intervalo Preventivo</span>
              <span className="font-mono text-base font-semibold text-[#f5f5f7]">{component.replacementIntervalKm.toLocaleString()} km</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-medium text-[#86868b] hover:text-white transition-colors cursor-pointer"
          >
            Fechar
          </button>

          <button
            type="button"
            id="btn-modal-schedule"
            onClick={() => {
              onSchedule?.(component.name);
              onClose();
            }}
            className="px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold tracking-tight shadow-md shadow-[#0071e3]/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            Agendar em Oficina Credenciada
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
