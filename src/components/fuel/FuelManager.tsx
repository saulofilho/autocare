import React, { useState } from 'react';
import { FuelLog, Vehicle } from '../../types/vehicle';
import { 
  Fuel, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  Calculator, 
  Gauge, 
  Zap, 
  DollarSign, 
  Calendar,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

interface FuelManagerProps {
  fuelLogs: FuelLog[];
  vehicle: Vehicle;
  onAddFuelLog: (log: Omit<FuelLog, 'id'>) => void;
  onUpdateFuelLevel: (liters: number) => void;
}

export const FuelManager: React.FC<FuelManagerProps> = ({
  fuelLogs,
  vehicle,
  onAddFuelLog,
  onUpdateFuelLevel
}) => {
  const [showModal, setShowModal] = useState(false);

  // Parity Calculator states
  const [ethanolPrice, setEthanolPrice] = useState<number>(3.89);
  const [gasolinePrice, setGasolinePrice] = useState<number>(5.79);

  // New Log form states
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [fuelType, setFuelType] = useState<FuelLog['fuelType']>('Gasolina Comum');
  const [liters, setLiters] = useState<number>(45);
  const [pricePerLiter, setPricePerLiter] = useState<number>(5.79);
  const [odometerKm, setOdometerKm] = useState<number>(vehicle.currentKm);
  const [stationName, setStationName] = useState<string>('Posto Ipiranga Rodoanel');
  const [fullTank, setFullTank] = useState<boolean>(true);

  const tankCapacity = vehicle.fuelTankCapacity || 55;

  // Parity calculation (70% rule)
  const ratio = ethanolPrice / gasolinePrice;
  const parityPercent = Math.round(ratio * 100);
  const isEthanolAdvantageous = ratio < 0.70;
  const savingsPerTank = Math.abs((gasolinePrice * tankCapacity) - (ethanolPrice * (tankCapacity * 1.3)));

  // Average consumption calculations
  const gasolineLogs = fuelLogs.filter(l => l.fuelType.includes('Gasolina') && l.calculatedKmPerLiter);
  const avgGasolineKmPerL = gasolineLogs.length > 0
    ? (gasolineLogs.reduce((acc, l) => acc + (l.calculatedKmPerLiter || 0), 0) / gasolineLogs.length).toFixed(1)
    : '12.6';

  const ethanolLogs = fuelLogs.filter(l => l.fuelType === 'Etanol' && l.calculatedKmPerLiter);
  const avgEthanolKmPerL = ethanolLogs.length > 0
    ? (ethanolLogs.reduce((acc, l) => acc + (l.calculatedKmPerLiter || 0), 0) / ethanolLogs.length).toFixed(1)
    : '8.9';

  const avgCostPerKm = fuelLogs[0]?.costPerKm ? `R$ ${fuelLogs[0].costPerKm.toFixed(2)}` : 'R$ 0,48';

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalCost = liters * pricePerLiter;
    
    // Estimate efficiency based on previous log
    let calculatedKmPerLiter: number | undefined;
    let costPerKm: number | undefined;
    if (fuelLogs.length > 0 && odometerKm > fuelLogs[0].odometerKm) {
      const distance = odometerKm - fuelLogs[0].odometerKm;
      calculatedKmPerLiter = parseFloat((distance / liters).toFixed(1));
      costPerKm = parseFloat((totalCost / distance).toFixed(2));
    }

    onAddFuelLog({
      date,
      odometerKm,
      fuelType,
      liters,
      pricePerLiter,
      totalCost,
      fullTank,
      stationName,
      calculatedKmPerLiter,
      costPerKm
    });

    onUpdateFuelLevel(fullTank ? tankCapacity : Math.min(tankCapacity, vehicle.currentFuelLevel + liters));
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#f5f5f7] tracking-tight flex items-center gap-2.5">
            <Fuel className="w-5 h-5 text-[#30d158]" />
            Combustível & Eficiência Energética
          </h2>
          <p className="text-xs text-[#86868b] mt-1 tracking-tight">
            Gestão de autonomia, custos por quilômetro e paridade financeira inteligente.
          </p>
        </div>

        <button
          id="btn-open-fuel-modal"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold tracking-tight shadow-md shadow-[#0071e3]/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Registrar Abastecimento
        </button>
      </div>

      {/* Apple-style Bento Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex flex-col justify-between">
          <span className="text-[11px] font-medium text-[#86868b] tracking-tight">Média Gasolina</span>
          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-3xl font-semibold text-[#f5f5f7] font-mono tracking-tight">{avgGasolineKmPerL}</span>
            <span className="text-xs text-[#86868b]">km/L</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#30d158]">
            <TrendingUp className="w-3 h-3" />
            <span>Excelente consumo urbano</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex flex-col justify-between">
          <span className="text-[11px] font-medium text-[#86868b] tracking-tight">Média Etanol</span>
          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-3xl font-semibold text-[#f5f5f7] font-mono tracking-tight">{avgEthanolKmPerL}</span>
            <span className="text-xs text-[#86868b]">km/L</span>
          </div>
          <span className="text-[11px] text-[#86868b]">71% do rendimento da gasolina</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex flex-col justify-between">
          <span className="text-[11px] font-medium text-[#86868b] tracking-tight">Custo Médio por Km</span>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-semibold text-[#30d158] font-mono tracking-tight">{avgCostPerKm}</span>
            <span className="text-xs text-[#86868b]">/km</span>
          </div>
          <span className="text-[11px] text-[#86868b]">Baseado nos últimos 30 dias</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex flex-col justify-between">
          <span className="text-[11px] font-medium text-[#86868b] tracking-tight">Nível do Tanque</span>
          <div className="flex items-baseline gap-1.5 my-2">
            <span className="text-3xl font-semibold text-[#f5f5f7] font-mono tracking-tight">{vehicle.currentFuelLevel}</span>
            <span className="text-xs text-[#86868b]">de {tankCapacity}L</span>
          </div>
          <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#30d158] rounded-full" 
              style={{ width: `${(vehicle.currentFuelLevel / tankCapacity) * 100}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Smart Parity Calculator - Apple Bento Style */}
      <div className="p-6 rounded-3xl bg-[#161617] border border-white/[0.08]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#2997ff]/15 text-[#2997ff] border border-[#2997ff]/30">
                Regra dos 70%
              </span>
              <span className="text-xs text-[#86868b]">Paridade Financeira em Tempo Real</span>
            </div>
            <h3 className="text-lg font-semibold text-[#f5f5f7] tracking-tight">
              Calculadora Inteligente: Etanol ou Gasolina?
            </h3>
          </div>

          {/* Result Badge */}
          <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 ${
            isEthanolAdvantageous 
              ? 'bg-[#30d158]/10 border-[#30d158]/30 text-[#30d158]' 
              : 'bg-[#2997ff]/10 border-[#2997ff]/30 text-[#2997ff]'
          }`}>
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="text-xs font-semibold tracking-tight">
              {isEthanolAdvantageous ? 'Compensa Abastecer com Etanol' : 'Compensa Abastecer com Gasolina'}
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <label className="block text-xs font-medium text-[#86868b] mb-2">Preço do Litro do Etanol (R$)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-[#86868b]">R$</span>
              <input
                id="input-ethanol-calc"
                type="number"
                step="0.01"
                value={ethanolPrice}
                onChange={(e) => setEthanolPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] font-mono text-base focus:border-[#2997ff] focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <label className="block text-xs font-medium text-[#86868b] mb-2">Preço do Litro da Gasolina (R$)</label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-[#86868b]">R$</span>
              <input
                id="input-gasoline-calc"
                type="number"
                step="0.01"
                value={gasolinePrice}
                onChange={(e) => setGasolinePrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] font-mono text-base focus:border-[#2997ff] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Parity Slider Bar */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#86868b]">Paridade Atual: <strong className="text-[#f5f5f7] font-mono">{parityPercent}%</strong></span>
            <span className="text-[11px] text-[#86868b]">Ponto de Equilíbrio: 70%</span>
          </div>
          <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden flex">
            <div 
              className={`h-full transition-all duration-300 ${isEthanolAdvantageous ? 'bg-[#30d158]' : 'bg-[#2997ff]'}`}
              style={{ width: `${Math.min(100, parityPercent)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#86868b] leading-relaxed pt-1">
            {isEthanolAdvantageous
              ? `O litro do etanol custa ${parityPercent}% do preço da gasolina (abaixo do limite de 70%). Você economiza cerca de R$ ${savingsPerTank.toFixed(2)} a cada tanque cheio!`
              : `O etanol está custando ${parityPercent}% da gasolina (acima do limite de 70%). Abastecer com Gasolina oferece maior autonomia por real gasto.`}
          </p>
        </div>
      </div>

      {/* Fuel Logs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#f5f5f7] tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#86868b]" />
            Histórico Recente de Abastecimentos
          </h3>
          <span className="text-xs text-[#86868b] font-mono">{fuelLogs.length} registros</span>
        </div>

        <div className="space-y-2.5">
          {fuelLogs.map(log => (
            <div 
              key={log.id}
              className="p-4 rounded-2xl bg-[#161617] border border-white/[0.08] hover:border-white/[0.14] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                  <Fuel className={`w-4 h-4 ${log.fuelType.includes('Etanol') ? 'text-[#30d158]' : 'text-[#2997ff]'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#f5f5f7] text-sm tracking-tight">{log.fuelType}</span>
                    <span className="text-[10px] text-[#86868b] font-mono">{log.date}</span>
                    {log.fullTank && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-[#86868b]">Tanque Cheio</span>
                    )}
                  </div>
                  <p className="text-[#86868b] mt-0.5">
                    {log.stationName} • <span className="font-mono">{log.odometerKm.toLocaleString()} km</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:text-right">
                <div>
                  <span className="text-[10px] text-[#86868b] block">{log.liters} L a R$ {log.pricePerLiter.toFixed(2)}</span>
                  <span className="font-mono text-sm font-semibold text-[#f5f5f7]">R$ {log.totalCost.toFixed(2)}</span>
                </div>

                {log.calculatedKmPerLiter && (
                  <div className="pl-4 border-l border-white/[0.08]">
                    <span className="text-[10px] text-[#86868b] block">Média</span>
                    <span className="font-mono text-xs font-semibold text-[#30d158]">{log.calculatedKmPerLiter} km/L</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add Fuel Log */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#161617] border border-white/[0.12] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5 border-b border-white/[0.08] pb-3">
              <h3 className="font-semibold text-lg text-[#f5f5f7] tracking-tight flex items-center gap-2">
                <Fuel className="w-4 h-4 text-[#30d158]" />
                Registrar Abastecimento
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-[#86868b] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Tipo de Combustível</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                  >
                    <option value="Gasolina Comum">Gasolina Comum</option>
                    <option value="Gasolina Aditivada">Gasolina Aditivada</option>
                    <option value="Etanol">Etanol Hidratado</option>
                    <option value="Diesel S10">Diesel S10</option>
                    <option value="GNV">Gás Natural Veicular (GNV)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Volume Abastecido (Litros)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={liters}
                    onChange={(e) => setLiters(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Preço por Litro (R$)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={pricePerLiter}
                    onChange={(e) => setPricePerLiter(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Odômetro do Painel (km)</label>
                  <input
                    type="number"
                    required
                    value={odometerKm}
                    onChange={(e) => setOdometerKm(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Posto / Bandeira</label>
                  <input
                    type="text"
                    required
                    value={stationName}
                    onChange={(e) => setStationName(e.target.value)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="fullTankCheckbox"
                  checked={fullTank}
                  onChange={(e) => setFullTank(e.target.checked)}
                  className="rounded accent-[#2997ff]"
                />
                <label htmlFor="fullTankCheckbox" className="text-xs text-[#86868b] cursor-pointer">
                  Encheu o tanque até o desarme automático (essencial para cálculo de km/L)
                </label>
              </div>

              <div className="p-3.5 bg-black rounded-2xl border border-white/[0.08] flex items-center justify-between">
                <span className="text-xs text-[#86868b]">Total Estimado:</span>
                <span className="font-mono text-base font-semibold text-[#30d158]">
                  R$ {(liters * pricePerLiter).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-medium text-[#86868b] hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold tracking-tight shadow-md shadow-[#0071e3]/25 cursor-pointer"
                >
                  Salvar Abastecimento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
