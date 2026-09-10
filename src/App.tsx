import React, { useState, useCallback } from 'react';
import { 
  initialVehicle, 
  initialMaintenanceItems, 
  initialMaintenanceRecords, 
  initialFuelLogs, 
  initialWorkshops, 
  initialReviews, 
  initialPushNotifications, 
  initialBookings, 
  car3DComponents 
} from './data/mockData';
import { 
  Vehicle, 
  MaintenanceItem, 
  MaintenanceRecord, 
  FuelLog, 
  Workshop, 
  MechanicReview, 
  ServiceBooking, 
  PushNotificationItem, 
  CarComponent3DInfo 
} from './types/vehicle';
import { Navbar } from './components/layout/Navbar';
import { CarCanvas3D } from './components/3d/CarCanvas3D';
import { ComponentDetailModal } from './components/3d/ComponentDetailModal';
import { MaintenanceTracker } from './components/maintenance/MaintenanceTracker';
import { FuelManager } from './components/fuel/FuelManager';
import { CostReports } from './components/reports/CostReports';
import { WorkshopMarketplace } from './components/marketplace/WorkshopMarketplace';
import { MaintenanceTips } from './components/maintenance/MaintenanceTips';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Fuel, 
  Wrench, 
  ShieldCheck, 
  Gauge, 
  Sliders, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<string>('3d');
  const [vehicle, setVehicle] = useState<Vehicle>(initialVehicle);
  const [selectedColor, setSelectedColor] = useState<string>(initialVehicle.color);
  
  // Data states
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(initialMaintenanceItems);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(initialMaintenanceRecords);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(initialFuelLogs);
  const [workshops] = useState<Workshop[]>(initialWorkshops);
  const [reviews, setReviews] = useState<MechanicReview[]>(initialReviews);
  const [bookings, setBookings] = useState<ServiceBooking[]>(initialBookings);
  const [notifications, setNotifications] = useState<PushNotificationItem[]>(initialPushNotifications);

  // Modals & Drawers
  const [selectedComponentForModal, setSelectedComponentForModal] = useState<CarComponent3DInfo | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [preSelectedService, setPreSelectedService] = useState<string | null>(null);
  const [isKmModalOpen, setIsKmModalOpen] = useState<boolean>(false);
  const [tempKmInput, setTempKmInput] = useState<number>(vehicle.currentKm);

  // Send native browser push notification
  const triggerNativeNotification = useCallback((title: string, message: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico'
        });
      } catch (e) {
        console.warn('Notification error', e);
      }
    }
  }, []);

  // Update vehicle Odometer & trigger automatic mileage alerts
  const handleUpdateKm = useCallback((newKm: number) => {
    setVehicle(prev => ({ ...prev, currentKm: newKm }));

    // Recalculate maintenance health
    setMaintenanceItems(prevItems =>
      prevItems.map(item => {
        const remaining = Math.max(0, item.nextServiceKm - newKm);
        const totalInterval = item.intervalKm || 10000;
        const healthPercent = Math.min(100, Math.max(0, Math.round((remaining / totalInterval) * 100)));
        let urgency: 'ok' | 'warning' | 'critical' = 'ok';
        if (remaining <= 500) urgency = 'critical';
        else if (remaining <= 2000) urgency = 'warning';

        return {
          ...item,
          healthPercent,
          urgency
        };
      })
    );

    // Automatic push notification triggers
    if (newKm >= 50000) {
      const alertTitle = '⚠️ Alerta de Revisão: 50.000 km Atingidos';
      const alertMsg = `Seu veículo atingiu ${newKm.toLocaleString()} km. O óleo sintético e as pastilhas de freio dianteiras estão no limite recomendado. Agende sua oficina credenciada.`;
      
      const newNotif: PushNotificationItem = {
        id: 'notif-auto-' + Date.now(),
        title: alertTitle,
        message: alertMsg,
        date: 'Agora',
        type: 'mileage',
        read: false,
        priority: 'alta',
        actionUrl: 'marketplace'
      };

      setNotifications(prev => [newNotif, ...prev]);
      triggerNativeNotification(alertTitle, alertMsg);
    }
  }, [triggerNativeNotification]);

  // Add new fuel log
  const handleAddFuelLog = (logData: Omit<FuelLog, 'id'>) => {
    const newLog: FuelLog = {
      ...logData,
      id: 'fuel-' + Date.now()
    };
    setFuelLogs(prev => [newLog, ...prev]);
    if (logData.odometerKm > vehicle.currentKm) {
      handleUpdateKm(logData.odometerKm);
    }
  };

  // Update fuel level
  const handleUpdateFuelLevel = (liters: number) => {
    setVehicle(prev => ({ ...prev, currentFuelLevel: liters }));
  };

  // Add maintenance record & renew item health
  const handleAddRecord = (recData: Omit<MaintenanceRecord, 'id'>) => {
    const newRec: MaintenanceRecord = {
      ...recData,
      id: 'rec-' + Date.now()
    };
    setMaintenanceRecords(prev => [newRec, ...prev]);

    // Update corresponding item
    setMaintenanceItems(prev =>
      prev.map(item => {
        if (item.id === recData.itemId || item.name.toLowerCase().includes(recData.itemName.toLowerCase())) {
          return {
            ...item,
            lastServiceKm: recData.odometerKm,
            lastServiceDate: recData.date,
            nextServiceKm: recData.odometerKm + item.intervalKm,
            healthPercent: 100,
            urgency: 'ok'
          };
        }
        return item;
      })
    );

    const successNotif: PushNotificationItem = {
      id: 'notif-rec-' + Date.now(),
      title: '✅ Manutenção Registrada',
      message: `${recData.itemName} realizada em ${recData.workshopName}. Odômetro sincronizado.`,
      date: 'Agora',
      type: 'mileage',
      read: false,
      priority: 'normal',
      actionUrl: 'maintenance'
    };
    setNotifications(prev => [successNotif, ...prev]);
  };

  // Add booking
  const handleAddBooking = (bookingData: Omit<ServiceBooking, 'id' | 'createdAt'>) => {
    const newBooking: ServiceBooking = {
      ...bookingData,
      id: 'book-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBookings(prev => [newBooking, ...prev]);

    const title = `Agendamento Confirmado: ${bookingData.workshopName}`;
    const message = `Serviço "${bookingData.serviceName}" para ${bookingData.date} às ${bookingData.timeSlot}.`;
    
    const newNotif: PushNotificationItem = {
      id: 'notif-book-' + Date.now(),
      title,
      message,
      date: 'Agora',
      type: 'booking',
      read: false,
      priority: 'alta',
      actionUrl: 'marketplace'
    };
    setNotifications(prev => [newNotif, ...prev]);
    triggerNativeNotification(title, message);
  };

  // Add review
  const handleAddReview = (reviewData: Omit<MechanicReview, 'id' | 'date'>) => {
    const newReview: MechanicReview = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: 'Hoje'
    };
    setReviews(prev => [newReview, ...prev]);
  };

  // Schedule service from 3D view or maintenance item
  const handleScheduleService = (serviceOrComponentName: string) => {
    setPreSelectedService(serviceOrComponentName);
    setActiveTab('marketplace');
  };

  // Trigger test push
  const handleTriggerTestPush = () => {
    const testTitle = 'AutoCare 3D - Alerta Push';
    const testMsg = 'Seus lembretes inteligentes por quilometragem e consumo estão funcionando perfeitamente.';
    triggerNativeNotification(testTitle, testMsg);
    
    setNotifications(prev => [
      {
        id: 'notif-test-' + Date.now(),
        title: testTitle,
        message: testMsg,
        date: 'Agora',
        type: 'alert',
        read: false,
        priority: 'normal'
      },
      ...prev
    ]);
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // Overall car health score
  const avgHealth = Math.round(
    maintenanceItems.reduce((acc, curr) => acc + curr.healthPercent, 0) / maintenanceItems.length
  );

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex flex-col selection:bg-[#2997ff] selection:text-white">
      {/* Apple-style Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vehicle={vehicle}
        unreadCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        selectedColor={selectedColor}
        onChangeColor={setSelectedColor}
        onOpenKmModal={() => {
          setTempKmInput(vehicle.currentKm);
          setIsKmModalOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* TAB 1: 3D DO CARRO (APPLE KEYNOTE SHOWCASE) */}
        {activeTab === '3d' && (
          <div className="space-y-8">
            {/* Apple Bento Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-[#86868b] tracking-tight block">
                    Índice de Saúde Mecânica
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-semibold font-mono text-[#f5f5f7] tracking-tight">{avgHealth}%</span>
                    <span className="text-xs text-[#ff9f0a] font-medium">2 revisões pendentes</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#2997ff]/10 text-[#2997ff] flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-[#86868b] tracking-tight block">
                    Odômetro Sincronizado
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-semibold font-mono text-[#f5f5f7] tracking-tight">{vehicle.currentKm.toLocaleString()}</span>
                    <span className="text-xs text-[#86868b]">km</span>
                  </div>
                </div>
                <button
                  id="btn-quick-km-update"
                  onClick={() => {
                    setTempKmInput(vehicle.currentKm);
                    setIsKmModalOpen(true);
                  }}
                  className="w-10 h-10 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-[#2997ff] flex items-center justify-center transition-all cursor-pointer border border-white/[0.06]"
                  title="Atualizar odômetro"
                >
                  <Gauge className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-[#86868b] tracking-tight block">
                    Autonomia Estimada
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-semibold font-mono text-[#f5f5f7] tracking-tight">430</span>
                    <span className="text-xs text-[#30d158] font-medium">km restantes</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#30d158]/10 text-[#30d158] flex items-center justify-center">
                  <Fuel className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-[#86868b] tracking-tight block">
                    Próxima Troca Crítica
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-base font-semibold text-[#ff453a] tracking-tight">Pastilhas de Freio</span>
                  </div>
                  <span className="text-[11px] text-[#86868b]">Em 1.650 km ou 30 dias</span>
                </div>
                <button
                  onClick={() => handleScheduleService('Pastilhas de Freio Dianteiras')}
                  className="w-10 h-10 rounded-2xl bg-[#ff453a]/10 hover:bg-[#ff453a]/20 text-[#ff453a] flex items-center justify-center transition-all cursor-pointer"
                >
                  <Wrench className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Apple Product Stage 3D Visualizer */}
            <CarCanvas3D
              vehicleColor={selectedColor}
              onSelectComponent={(comp) => setSelectedComponentForModal(comp)}
              onScheduleService={handleScheduleService}
            />

            {/* Educational Component Hotspot Bento Grid */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#f5f5f7] tracking-tight flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#2997ff]" />
                  Componentes Mecânicos Mapeados no Modelo 3D
                </h3>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Toque em qualquer peça para inspecionar funcionamento físico, desgaste esperado e custos médios de reposição.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                {car3DComponents.map(comp => (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedComponentForModal(comp)}
                    className="p-5 rounded-3xl bg-[#161617] border border-white/[0.08] hover:border-white/[0.18] cursor-pointer transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">{comp.category}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          comp.urgency === 'critical' ? 'bg-[#ff453a] animate-pulse' : comp.urgency === 'warning' ? 'bg-[#ff9f0a]' : 'bg-[#30d158]'
                        }`} />
                      </div>
                      <h4 className="font-semibold text-sm text-[#f5f5f7] tracking-tight line-clamp-1 group-hover:text-[#2997ff] transition-colors">{comp.name}</h4>
                      <p className="text-xs text-[#86868b] mt-1.5 line-clamp-2 leading-relaxed">{comp.howItWorks}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.06] text-xs">
                      <span className="text-[#86868b] font-mono">Saúde: <strong className="text-[#f5f5f7]">{comp.healthPercent}%</strong></span>
                      <span className="text-[#2997ff] font-medium flex items-center gap-0.5">
                        Inspecionar <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANUTENÇÕES */}
        {activeTab === 'maintenance' && (
          <MaintenanceTracker
            vehicle={vehicle}
            maintenanceItems={maintenanceItems}
            records={maintenanceRecords}
            onAddRecord={handleAddRecord}
            onUpdateKm={handleUpdateKm}
            onScheduleItem={handleScheduleService}
            onSelect3DComponent={(compKey) => {
              setActiveTab('3d');
              const comp = car3DComponents.find(c => c.id === compKey);
              if (comp) setSelectedComponentForModal(comp);
            }}
          />
        )}

        {/* TAB 3: COMBUSTÍVEL */}
        {activeTab === 'fuel' && (
          <FuelManager
            fuelLogs={fuelLogs}
            vehicle={vehicle}
            onAddFuelLog={handleAddFuelLog}
            onUpdateFuelLevel={handleUpdateFuelLevel}
          />
        )}

        {/* TAB 4: RELATÓRIOS MENSAIS DE CUSTOS */}
        {activeTab === 'reports' && (
          <CostReports
            vehicle={vehicle}
            fuelLogs={fuelLogs}
            maintenanceRecords={maintenanceRecords}
          />
        )}

        {/* TAB 5: MARKETPLACE DE OFICINAS */}
        {activeTab === 'marketplace' && (
          <WorkshopMarketplace
            workshops={workshops}
            reviews={reviews}
            bookings={bookings}
            vehicle={vehicle}
            onAddBooking={handleAddBooking}
            onAddReview={handleAddReview}
            initialSelectedService={preSelectedService}
          />
        )}

        {/* TAB 6: DICAS TÉCNICAS */}
        {activeTab === 'tips' && (
          <MaintenanceTips />
        )}
      </main>

      {/* Global 3D Component Detail Modal */}
      <ComponentDetailModal
        component={selectedComponentForModal}
        onClose={() => setSelectedComponentForModal(null)}
        onSchedule={handleScheduleService}
      />

      {/* Global Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        }}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onTriggerTestPush={handleTriggerTestPush}
      />

      {/* Apple Sheet Quick Odometer Update Modal */}
      {isKmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#161617] border border-white/[0.12] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5 border-b border-white/[0.08] pb-3">
              <h3 className="font-semibold text-lg text-[#f5f5f7] tracking-tight flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#2997ff]" />
                Atualizar Odômetro
              </h3>
              <button 
                onClick={() => setIsKmModalOpen(false)}
                className="text-[#86868b] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateKm(tempKmInput);
              setIsKmModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#86868b] mb-1.5">
                  Quilometragem Atual do Painel (km)
                </label>
                <div className="relative">
                  <input
                    id="input-global-km"
                    type="number"
                    value={tempKmInput}
                    min={vehicle.currentKm}
                    onChange={(e) => setTempKmInput(parseInt(e.target.value) || vehicle.currentKm)}
                    className="w-full bg-black border border-white/[0.12] rounded-2xl px-4 py-2.5 text-[#f5f5f7] font-mono text-lg focus:border-[#2997ff] focus:outline-none"
                  />
                  <span className="absolute right-4 top-3 text-xs text-[#86868b]">km</span>
                </div>
                <p className="text-[11px] text-[#86868b] mt-1.5">
                  Atualiza automaticamente o desgaste das peças e ativa alertas preventivos.
                </p>
              </div>

              {/* Simulation buttons */}
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
                <span className="text-[11px] font-medium text-[#86868b] block mb-2">
                  Atalhos de Simulação:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTempKmInput(vehicle.currentKm + 500)}
                    className="px-3 py-1.5 text-xs rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-[#f5f5f7] font-medium cursor-pointer"
                  >
                    + 500 km
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempKmInput(50000)}
                    className="px-3 py-1.5 text-xs rounded-full bg-[#ff9f0a]/15 hover:bg-[#ff9f0a]/25 text-[#ff9f0a] border border-[#ff9f0a]/30 font-medium cursor-pointer"
                  >
                    50.000 km (Disparar Alerta)
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsKmModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#86868b] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs tracking-tight shadow-md shadow-[#0071e3]/25"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
