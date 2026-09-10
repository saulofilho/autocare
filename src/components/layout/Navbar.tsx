import React from 'react';
import { Vehicle } from '../../types/vehicle';
import { 
  Car, 
  Wrench, 
  Fuel, 
  BarChart3, 
  Store, 
  Lightbulb, 
  Bell, 
  Palette, 
  Gauge, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  vehicle: Vehicle;
  unreadCount: number;
  onOpenNotifications: () => void;
  selectedColor: string;
  onChangeColor: (color: string) => void;
  onOpenKmModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  vehicle,
  unreadCount,
  onOpenNotifications,
  selectedColor,
  onChangeColor,
  onOpenKmModal
}) => {
  const colorOptions = [
    { name: 'Azul Titânio', hex: '#2563eb' },
    { name: 'Vermelho Carmim', hex: '#dc2626' },
    { name: 'Preto Espacial', hex: '#0f172a' },
    { name: 'Branco Estelar', hex: '#f8fafc' },
    { name: 'Cinza Natural', hex: '#64748b' },
    { name: 'Verde Meia-Noite', hex: '#059669' }
  ];

  const navItems = [
    { id: '3d', label: 'Visão 3D & Motor', icon: Car },
    { id: 'maintenance', label: 'Manutenção', icon: Wrench },
    { id: 'fuel', label: 'Combustível', icon: Fuel },
    { id: 'reports', label: 'Custos & Gastos', icon: BarChart3 },
    { id: 'marketplace', label: 'Oficinas', icon: Store },
    { id: 'tips', label: 'Dicas Técnicas', icon: Lightbulb }
  ];

  return (
    <header className="sticky top-0 z-40 bg-black/75 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
      {/* Top Cockpit Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Apple-style Brand & Vehicle info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-semibold text-white tracking-tight">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-b from-white/20 to-white/5 border border-white/10 flex items-center justify-center shadow-inner">
              <Car className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              AutoCare <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#2997ff]/15 text-[#2997ff] font-medium">3D</span>
            </span>
          </div>

          <span className="hidden sm:inline w-px h-4 bg-white/10" />

          {/* Vehicle summary badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs">
            <div 
              className="w-2 h-2 rounded-full shadow-sm ring-1 ring-white/20" 
              style={{ backgroundColor: selectedColor }} 
            />
            <span className="font-medium text-[#f5f5f7] tracking-tight">{vehicle.brand} {vehicle.model}</span>
            <span className="text-[10px] font-mono text-[#86868b] uppercase tracking-wider">{vehicle.licensePlate}</span>
          </div>
        </div>

        {/* Right Tools (Color Swatches, Odometer, Notifications) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Apple-style Color Picker Swatches */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] rounded-full border border-white/[0.08]">
            <Palette className="w-3 h-3 text-[#86868b]" />
            <span className="text-[10px] text-[#86868b] mr-1 font-medium">Acabamento</span>
            <div className="flex items-center gap-1">
              {colorOptions.map(c => (
                <button
                  key={c.hex}
                  onClick={() => onChangeColor(c.hex)}
                  title={c.name}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                    selectedColor === c.hex 
                      ? 'ring-2 ring-[#2997ff] ring-offset-2 ring-offset-black scale-110' 
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Odometer quick action button */}
          <button
            id="btn-nav-odometer"
            onClick={onOpenKmModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-[#f5f5f7] transition-all text-xs font-mono font-medium tracking-tight cursor-pointer"
            title="Atualizar odômetro"
          >
            <Gauge className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>{vehicle.currentKm.toLocaleString()} km</span>
          </button>

          {/* Notification bell button */}
          <button
            id="btn-nav-notifications"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-[#f5f5f7] transition-all cursor-pointer"
            title="Notificações & Lembretes"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ff453a] text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Apple-style Segmented Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-2.5 pt-1 overflow-x-auto scrollbar-none">
        <div className="inline-flex p-1 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#86868b]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
