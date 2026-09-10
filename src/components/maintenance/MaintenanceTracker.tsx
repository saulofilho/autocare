import React, { useState } from 'react';
import { MaintenanceItem, MaintenanceRecord, Vehicle } from '../../types/vehicle';
import { 
  Wrench, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Layers, 
  ChevronRight, 
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  Activity,
  History
} from 'lucide-react';

interface MaintenanceTrackerProps {
  vehicle: Vehicle;
  maintenanceItems: MaintenanceItem[];
  records: MaintenanceRecord[];
  onAddRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
  onUpdateKm: (newKm: number) => void;
  onScheduleItem?: (itemName: string) => void;
  onSelect3DComponent?: (componentKey: string) => void;
}

export const MaintenanceTracker: React.FC<MaintenanceTrackerProps> = ({
  vehicle,
  maintenanceItems,
  records,
  onAddRecord,
  onUpdateKm,
  onScheduleItem,
  onSelect3DComponent
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'history'>('schedule');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form states
  const [selectedItemId, setSelectedItemId] = useState<string>(maintenanceItems[0]?.id || '');
  const [serviceDate, setServiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [serviceKm, setServiceKm] = useState<number>(vehicle.currentKm);
  const [serviceCost, setServiceCost] = useState<number>(350);
  const [serviceWorkshop, setServiceWorkshop] = useState<string>('Oficina Bosch Service');
  const [serviceNotes, setServiceNotes] = useState<string>('Peças originais com garantia de 12 meses');

  // Filter items
  const filteredItems = maintenanceItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = filterUrgency === 'all' || item.urgency === filterUrgency;
    return matchesSearch && matchesUrgency;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = maintenanceItems.find(i => i.id === selectedItemId);
    const itemName = item ? item.name : 'Revisão Geral';

    onAddRecord({
      itemId: selectedItemId,
      itemName,
      date: serviceDate,
      odometerKm: serviceKm,
      cost: serviceCost,
      workshopName: serviceWorkshop,
      notes: serviceNotes,
      replacedParts: [itemName]
    });

    if (serviceKm > vehicle.currentKm) {
      onUpdateKm(serviceKm);
    }

    setShowAddModal(false);
  };

  const criticalCount = maintenanceItems.filter(i => i.urgency === 'critical').length;
  const warningCount = maintenanceItems.filter(i => i.urgency === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#f5f5f7] tracking-tight flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-[#2997ff]" />
            Cronograma de Manutenções Preventivas
          </h2>
          <p className="text-xs text-[#86868b] mt-1 tracking-tight">
            Monitoramento de vida útil de peças mecânicas sincronizado em tempo real com o odômetro ({vehicle.currentKm.toLocaleString()} km).
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <button
            id="btn-open-add-record"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold tracking-tight shadow-md shadow-[#0071e3]/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Registrar Serviço Feito
          </button>
        </div>
      </div>

      {/* Apple-style Bento Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#86868b] tracking-tight block">Itens em Dia</span>
            <span className="text-2xl font-semibold text-[#30d158] tracking-tight mt-1 block">
              {maintenanceItems.filter(i => i.urgency === 'ok').length}
            </span>
            <span className="text-[11px] text-[#86868b]">Funcionamento ideal</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#30d158]/10 text-[#30d158] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#86868b] tracking-tight block">Atenção Recomendada</span>
            <span className="text-2xl font-semibold text-[#ff9f0a] tracking-tight mt-1 block">
              {warningCount}
            </span>
            <span className="text-[11px] text-[#86868b]">Revisão nos próximos 2.000 km</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#ff9f0a]/10 text-[#ff9f0a] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-[#86868b] tracking-tight block">Substituição Imediata</span>
            <span className="text-2xl font-semibold text-[#ff453a] tracking-tight mt-1 block">
              {criticalCount}
            </span>
            <span className="text-[11px] text-[#86868b]">Limite de desgaste atingido</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#ff453a]/10 text-[#ff453a] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-[#161617] rounded-2xl border border-white/[0.08]">
        <div className="inline-flex p-1 bg-white/[0.04] rounded-full">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#86868b] hover:text-white'
            }`}
          >
            Plano Preventivo ({maintenanceItems.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#86868b] hover:text-white'
            }`}
          >
            Histórico de Serviços ({records.length})
          </button>
        </div>

        {activeTab === 'schedule' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar item ou peça..."
                className="bg-white/[0.04] border border-white/[0.08] rounded-full pl-8 pr-3 py-1.5 text-xs text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none placeholder:text-[#86868b]"
              />
            </div>

            <div className="inline-flex p-1 bg-white/[0.04] rounded-full">
              {(['all', 'warning', 'critical'] as const).map(urg => (
                <button
                  key={urg}
                  onClick={() => setFilterUrgency(urg)}
                  className={`px-2.5 py-1 text-[11px] rounded-full font-medium transition-all ${
                    filterUrgency === urg ? 'bg-white/15 text-white font-semibold' : 'text-[#86868b]'
                  }`}
                >
                  {urg === 'all' ? 'Todos' : urg === 'warning' ? 'Atenção' : 'Crítico'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'schedule' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map(item => {
            const remainingKm = Math.max(0, item.nextServiceKm - vehicle.currentKm);
            return (
              <div 
                key={item.id}
                className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">
                        {item.category}
                      </span>
                      <h3 className="font-semibold text-base text-[#f5f5f7] tracking-tight mt-0.5">
                        {item.name}
                      </h3>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-tight ${
                      item.urgency === 'critical'
                        ? 'bg-[#ff453a]/15 text-[#ff453a] border border-[#ff453a]/30'
                        : item.urgency === 'warning'
                        ? 'bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/30'
                        : 'bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30'
                    }`}>
                      {item.urgency === 'critical' ? 'Troca Imediata' : item.urgency === 'warning' ? 'Atenção' : 'Em Dia'}
                    </span>
                  </div>

                  <p className="text-xs text-[#86868b] leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Apple-style Health Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#86868b]">Vida Útil Restante</span>
                      <span className="font-mono font-semibold text-[#f5f5f7]">{item.healthPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.healthPercent <= 25 
                            ? 'bg-[#ff453a]' 
                            : item.healthPercent <= 50 
                            ? 'bg-[#ff9f0a]' 
                            : 'bg-[#30d158]'
                        }`}
                        style={{ width: `${item.healthPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Inspection Numbers */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-white/[0.02] rounded-2xl border border-white/[0.04] text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-[#86868b] block">Última Troca:</span>
                      <span className="font-mono font-medium text-[#f5f5f7]">{item.lastServiceKm.toLocaleString()} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#86868b] block">Próxima Recomendada:</span>
                      <span className="font-mono font-medium text-[#2997ff]">{item.nextServiceKm.toLocaleString()} km ({remainingKm.toLocaleString()} km restantes)</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
                  {item.component3DKey && onSelect3DComponent && (
                    <button
                      type="button"
                      onClick={() => onSelect3DComponent(item.component3DKey!)}
                      className="text-[#86868b] hover:text-[#f5f5f7] font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-[#2997ff]" />
                      Ver no 3D
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onScheduleItem?.(item.name)}
                    className="ml-auto px-4 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs tracking-tight transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Agendar Revisão
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* History of Services */
        <div className="space-y-3">
          {records.map(rec => (
            <div 
              key={rec.id}
              className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#30d158]/10 text-[#30d158] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#f5f5f7] text-base tracking-tight">{rec.itemName}</h4>
                    <span className="text-[10px] font-mono text-[#86868b] px-2 py-0.5 rounded-full bg-white/[0.04]">
                      {rec.odometerKm.toLocaleString()} km
                    </span>
                  </div>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Realizado em <strong className="text-[#f5f5f7]">{rec.workshopName}</strong> • {rec.date}
                  </p>
                  {rec.notes && (
                    <p className="text-xs text-[#86868b] italic mt-1">{rec.notes}</p>
                  )}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="text-[10px] text-[#86868b] block">Valor Pago</span>
                <span className="font-mono text-base font-semibold text-[#30d158]">
                  R$ {rec.cost.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apple Sheet Modal: Add Service Record */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#161617] border border-white/[0.12] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5 border-b border-white/[0.08] pb-3">
              <h3 className="font-semibold text-lg text-[#f5f5f7] tracking-tight flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#2997ff]" />
                Registrar Manutenção Realizada
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#86868b] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#86868b] mb-1">Item / Peça Substituída</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                >
                  {maintenanceItems.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                  <option value="custom">Outro Serviço Especializado</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Data da Execução</label>
                  <input
                    type="date"
                    required
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Quilometragem (km)</label>
                  <input
                    type="number"
                    required
                    value={serviceKm}
                    onChange={(e) => setServiceKm(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Valor Total (R$)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={serviceCost}
                    onChange={(e) => setServiceCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Oficina / Mecânica</label>
                  <input
                    type="text"
                    required
                    value={serviceWorkshop}
                    onChange={(e) => setServiceWorkshop(e.target.value)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#86868b] mb-1">Observações ou Peças Trocadas</label>
                <textarea
                  rows={2}
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  placeholder="Ex: Trocadas pastilhas cerâmicas e sangria do fluido DOT 4..."
                  className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-medium text-[#86868b] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold tracking-tight shadow-md shadow-[#0071e3]/25"
                >
                  Salvar Manutenção
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
