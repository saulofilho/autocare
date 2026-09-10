import React, { useState, useEffect } from 'react';
import { PushNotificationItem } from '../../types/vehicle';
import { 
  Bell, 
  X, 
  CheckCheck, 
  AlertTriangle, 
  Fuel, 
  Calendar, 
  CheckCircle, 
  Send, 
  Volume2,
  ChevronRight
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateTab: (tab: string) => void;
  onTriggerTestPush: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateTab,
  onTriggerTestPush
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermission(perm);
        if (perm === 'granted') {
          new Notification('AutoCare 3D Ativado', {
            body: 'Lembretes automáticos por quilometragem e consumo ativados com sucesso.',
            icon: '/favicon.ico'
          });
        }
      } catch (err) {
        console.error('Notification error', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#161617]/95 backdrop-blur-2xl border-l border-white/[0.08] h-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#2997ff]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#f5f5f7] text-base tracking-tight">Central de Lembretes</h3>
              <span className="text-[11px] text-[#86868b]">
                {notifications.filter(n => !n.read).length} não lidas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.some(n => !n.read) && (
              <button
                id="btn-mark-all-read"
                onClick={onMarkAllAsRead}
                title="Marcar todas como lidas"
                className="text-xs text-[#86868b] hover:text-[#f5f5f7] p-1.5 rounded-full hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              id="btn-close-notif-drawer"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-[#86868b] hover:text-[#f5f5f7] flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Apple Push Notifications Banner */}
        <div className="p-4 bg-white/[0.02] border-b border-white/[0.08]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#f5f5f7] flex items-center gap-1.5 tracking-tight">
                <Volume2 className="w-3.5 h-3.5 text-[#2997ff]" />
                Push Notifications
              </span>
              <p className="text-[11px] text-[#86868b] mt-0.5 leading-relaxed">
                {permission === 'granted' 
                  ? 'Ativado: Alertas por quilometragem e agendamento ativos no sistema operacional.' 
                  : 'Ative para receber lembretes imediatos no macOS, Windows ou celular quando o odômetro atingir a revisão.'}
              </p>
            </div>

            {permission !== 'granted' ? (
              <button
                id="btn-req-push-perm"
                onClick={requestBrowserPermission}
                className="px-3.5 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shrink-0 shadow-sm cursor-pointer"
              >
                Ativar
              </button>
            ) : (
              <button
                id="btn-test-push"
                onClick={onTriggerTestPush}
                className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-[#f5f5f7] text-xs font-medium shrink-0 cursor-pointer"
              >
                Testar Alerta
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-[#86868b] text-xs">
              Nenhuma notificação no momento.
            </div>
          ) : (
            notifications.map((n) => {
              const getIcon = () => {
                switch (n.type) {
                  case 'mileage':
                    return <AlertTriangle className="w-4 h-4 text-[#ff9f0a]" />;
                  case 'fuel':
                    return <Fuel className="w-4 h-4 text-[#30d158]" />;
                  case 'booking':
                    return <Calendar className="w-4 h-4 text-[#2997ff]" />;
                  default:
                    return <Bell className="w-4 h-4 text-[#86868b]" />;
                }
              };

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    onMarkAsRead(n.id);
                    if (n.actionUrl) {
                      onNavigateTab(n.actionUrl);
                      onClose();
                    }
                  }}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    n.read 
                      ? 'bg-white/[0.02] border border-white/[0.04] opacity-75 hover:opacity-100' 
                      : 'bg-white/[0.06] border border-white/[0.12] hover:bg-white/[0.09] shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className={`text-xs font-semibold tracking-tight ${n.read ? 'text-[#86868b]' : 'text-[#f5f5f7]'}`}>
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-[#86868b] font-mono shrink-0">{n.date}</span>
                      </div>
                      <p className="text-xs text-[#86868b] leading-relaxed">
                        {n.message}
                      </p>
                      {n.actionUrl && (
                        <span className="text-[11px] font-semibold text-[#2997ff] flex items-center gap-0.5 mt-2">
                          Visualizar <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
