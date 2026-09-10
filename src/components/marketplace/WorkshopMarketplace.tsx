import React, { useState } from 'react';
import { Workshop, MechanicReview, ServiceBooking, Vehicle } from '../../types/vehicle';
import confetti from 'canvas-confetti';
import { 
  Store, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  ShieldCheck, 
  ChevronRight, 
  Filter, 
  Plus, 
  ThumbsUp, 
  Wrench,
  Search,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface WorkshopMarketplaceProps {
  workshops: Workshop[];
  reviews: MechanicReview[];
  bookings: ServiceBooking[];
  vehicle: Vehicle;
  onAddBooking: (booking: Omit<ServiceBooking, 'id' | 'createdAt'>) => void;
  onAddReview: (review: Omit<MechanicReview, 'id' | 'date'>) => void;
  initialSelectedService?: string | null;
}

export const WorkshopMarketplace: React.FC<WorkshopMarketplaceProps> = ({
  workshops,
  reviews,
  bookings,
  vehicle,
  onAddBooking,
  onAddReview,
  initialSelectedService
}) => {
  const [activeTab, setActiveTab] = useState<'workshops' | 'bookings'>('workshops');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'distance'>('rating');

  // Booking Modal State
  const [selectedWorkshopForBooking, setSelectedWorkshopForBooking] = useState<Workshop | null>(null);
  const [bookingServiceName, setBookingServiceName] = useState<string>(initialSelectedService || '');
  const [bookingPrice, setBookingPrice] = useState<number>(350);
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>('09:30');
  const [bookingNotes, setBookingNotes] = useState<string>('');

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewWorkshopId, setReviewWorkshopId] = useState<string>(workshops[0]?.id || '');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewService, setReviewService] = useState<string>('Revisão Geral Preventiva');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewTags, setReviewTags] = useState<string[]>(['Preço Justo', 'Pontualidade']);

  React.useEffect(() => {
    if (initialSelectedService) {
      setBookingServiceName(initialSelectedService);
      setSelectedWorkshopForBooking(workshops[0] || null);
    }
  }, [initialSelectedService, workshops]);

  const filteredWorkshops = workshops
    .filter(ws => {
      const matchesSearch = ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ws.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            ws.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || ws.category === selectedCategory;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.distanceKm - b.distanceKm;
    });

  const availableTimeSlots = ['08:30', '09:30', '11:00', '14:00', '15:30', '17:00'];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkshopForBooking) return;

    onAddBooking({
      workshopId: selectedWorkshopForBooking.id,
      workshopName: selectedWorkshopForBooking.name,
      serviceName: bookingServiceName,
      price: bookingPrice,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      status: 'confirmado',
      vehiclePlate: vehicle.licensePlate,
      notes: bookingNotes
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (_) {}

    setSelectedWorkshopForBooking(null);
    setActiveTab('bookings');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview({
      workshopId: reviewWorkshopId,
      userName: 'Você (' + vehicle.model + ')',
      rating: reviewRating,
      serviceRendered: reviewService,
      comment: reviewComment,
      tags: reviewTags,
      vehicleModel: `${vehicle.brand} ${vehicle.model}`
    });

    setShowReviewModal(false);
    setReviewComment('');
  };

  const toggleTag = (tag: string) => {
    if (reviewTags.includes(tag)) {
      setReviewTags(reviewTags.filter(t => t !== tag));
    } else {
      setReviewTags([...reviewTags, tag]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#f5f5f7] tracking-tight flex items-center gap-2.5">
            <Store className="w-5 h-5 text-[#2997ff]" />
            Rede de Oficinas Credenciadas & Avaliações
          </h2>
          <p className="text-xs text-[#86868b] mt-1 tracking-tight">
            Agendamento direto com mecânicos verificados e histórico de avaliações transparentes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-open-review-modal"
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.09] text-[#f5f5f7] font-medium text-xs border border-white/[0.08] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Star className="w-3.5 h-3.5 text-[#ff9f0a] fill-[#ff9f0a]" />
            Avaliar Mecânico
          </button>

          <button
            id="tab-my-bookings"
            onClick={() => setActiveTab(activeTab === 'workshops' ? 'bookings' : 'workshops')}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-white text-black shadow-sm'
                : 'bg-white/[0.05] hover:bg-white/[0.09] text-[#f5f5f7] border border-white/[0.08]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Meus Agendamentos ({bookings.length})
          </button>
        </div>
      </div>

      {activeTab === 'workshops' ? (
        <>
          {/* Apple-style Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2 bg-[#161617] rounded-2xl border border-white/[0.08]">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3.5 top-2.5" />
              <input
                id="input-search-workshop"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome da oficina, bairro ou cidade..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full pl-9 pr-4 py-1.5 text-xs text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none placeholder:text-[#86868b]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex p-1 bg-white/[0.04] rounded-full">
                {(['all', 'Geral', 'Injeção & Motor', 'Freios & Suspensão', 'Pneus & Alinhamento'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-xs rounded-full font-medium tracking-tight transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-white/15 text-white font-semibold'
                        : 'text-[#86868b] hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? 'Todas' : cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 pl-2 border-l border-white/[0.08]">
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-1 text-xs rounded-full cursor-pointer ${sortBy === 'rating' ? 'bg-[#ff9f0a]/15 text-[#ff9f0a] font-semibold' : 'text-[#86868b]'}`}
                >
                  Melhor Nota
                </button>
                <button
                  onClick={() => setSortBy('distance')}
                  className={`px-3 py-1 text-xs rounded-full cursor-pointer ${sortBy === 'distance' ? 'bg-[#2997ff]/15 text-[#2997ff] font-semibold' : 'text-[#86868b]'}`}
                >
                  Mais Perto
                </button>
              </div>
            </div>
          </div>

          {/* Workshop Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {filteredWorkshops.map(ws => {
              const wsReviews = reviews.filter(r => r.workshopId === ws.id);
              return (
                <div 
                  key={ws.id}
                  className="p-6 rounded-3xl bg-[#161617] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Info */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/[0.06] text-[#86868b]">
                            {ws.category}
                          </span>
                          {ws.verifiedPartner && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#30d158]">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Oficina Credenciada
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg text-[#f5f5f7] tracking-tight">{ws.name}</h3>
                      </div>

                      {/* Rating Badge */}
                      <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ff9f0a]/10 border border-[#ff9f0a]/20 text-[#ff9f0a] font-semibold text-xs">
                          <Star className="w-3.5 h-3.5 fill-[#ff9f0a]" />
                          <span>{ws.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-[10px] text-[#86868b] mt-0.5">({ws.reviewsCount} avaliações)</span>
                      </div>
                    </div>

                    {/* Address & distance */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#86868b] mb-4">
                      <span className="flex items-center gap-1 text-[#f5f5f7]">
                        <MapPin className="w-3.5 h-3.5 text-[#ff453a] shrink-0" />
                        {ws.neighborhood}, {ws.city} • <strong className="text-white font-mono">{ws.distanceKm} km</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#86868b] shrink-0" />
                        {ws.openHours}
                      </span>
                    </div>

                    {/* Featured Services */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider block">
                        Serviços Disponíveis para Agendamento Imediato:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ws.featuredServices.slice(0, 4).map((svc, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setSelectedWorkshopForBooking(ws);
                              setBookingServiceName(svc.name);
                              setBookingPrice(svc.price);
                            }}
                            className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-[#2997ff]/40 hover:bg-white/[0.05] cursor-pointer transition-all flex items-center justify-between text-xs"
                          >
                            <span className="text-[#f5f5f7] truncate pr-2">{svc.name}</span>
                            <span className="font-mono font-semibold text-[#30d158] shrink-0">R$ {svc.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review Snippet */}
                    {wsReviews.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] mb-4">
                        <div className="flex items-center justify-between text-[11px] text-[#86868b] mb-1">
                          <span className="font-medium text-[#f5f5f7]">{wsReviews[0].userName}</span>
                          <span className="text-[#ff9f0a] flex items-center gap-0.5">
                            {'★'.repeat(wsReviews[0].rating)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#86868b] italic line-clamp-2">
                          "{wsReviews[0].comment}"
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {wsReviews[0].tags.map((t, idx) => (
                            <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.04] text-[#86868b]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <a
                      href={`https://wa.me/${ws.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#30d158] hover:text-[#30d158]/80 flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Falar no WhatsApp
                    </a>

                    <button
                      id={`btn-book-${ws.id}`}
                      onClick={() => {
                        setSelectedWorkshopForBooking(ws);
                        setBookingServiceName(ws.featuredServices[0]?.name || 'Revisão Geral');
                        setBookingPrice(ws.featuredServices[0]?.price || 350);
                      }}
                      className="px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-xs tracking-tight shadow-md shadow-[#0071e3]/25 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Agendar Horário
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* My Bookings Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#f5f5f7] tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2997ff]" />
              Agendamentos Ativos do Veículo
            </h3>
            <span className="text-xs text-[#86868b] font-mono">Total: {bookings.length}</span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center bg-[#161617] border border-white/[0.08] rounded-3xl">
              <Calendar className="w-8 h-8 text-[#86868b] mx-auto mb-2" />
              <p className="text-sm text-[#86868b]">Nenhum agendamento ativo no momento.</p>
              <button
                onClick={() => setActiveTab('workshops')}
                className="mt-4 px-5 py-2 bg-[#0071e3] text-white text-xs font-semibold rounded-full"
              >
                Explorar Oficinas Credenciadas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {bookings.map(b => (
                <div key={b.id} className="p-6 rounded-3xl bg-[#161617] border border-white/[0.08] shadow-md">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#30d158] bg-[#30d158]/15 px-2.5 py-0.5 rounded-full border border-[#30d158]/30">
                        {b.status.toUpperCase()}
                      </span>
                      <h4 className="font-semibold text-[#f5f5f7] text-base tracking-tight mt-2">{b.serviceName}</h4>
                      <p className="text-xs text-[#86868b]">{b.workshopName}</p>
                    </div>
                    <span className="text-base font-mono font-semibold text-[#30d158]">R$ {b.price.toFixed(2)}</span>
                  </div>

                  <div className="p-3 bg-white/[0.02] rounded-2xl border border-white/[0.04] my-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#86868b] block text-[10px]">Data & Horário:</span>
                      <span className="text-[#f5f5f7] font-medium flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-[#2997ff]" />
                        {b.date} às {b.timeSlot}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#86868b] block text-[10px]">Veículo / Placa:</span>
                      <span className="text-[#f5f5f7] font-mono font-medium mt-0.5 block">{b.vehiclePlate}</span>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-[#86868b] italic mb-3">
                      Obs: {b.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs text-[#86868b]">
                    <span>ID: #{b.id}</span>
                    <span className="text-[#30d158] font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Lembrete sincronizado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedWorkshopForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#161617] border border-white/[0.12] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5 border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#2997ff]">Agendamento em Tempo Real</span>
                <h3 className="font-semibold text-lg text-[#f5f5f7] tracking-tight">{selectedWorkshopForBooking.name}</h3>
              </div>
              <button 
                id="btn-close-booking-modal"
                onClick={() => setSelectedWorkshopForBooking(null)}
                className="text-[#86868b] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#86868b] mb-1">Serviço Selecionado</label>
                <select
                  id="select-booking-service"
                  value={bookingServiceName}
                  onChange={(e) => {
                    setBookingServiceName(e.target.value);
                    const match = selectedWorkshopForBooking.featuredServices.find(s => s.name === e.target.value);
                    if (match) setBookingPrice(match.price);
                  }}
                  className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                >
                  {selectedWorkshopForBooking.featuredServices.map((svc, i) => (
                    <option key={i} value={svc.name}>
                      {svc.name} - R$ {svc.price} ({svc.durationMinutes} min)
                    </option>
                  ))}
                  <option value="Diagnóstico Geral com Scanner OBD-II">Diagnóstico Geral com Scanner OBD-II - R$ 150</option>
                  <option value="Troca de Pastilhas de Freio">Troca de Pastilhas de Freio - R$ 280</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Data Desejada</label>
                  <input
                    id="input-booking-date"
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#86868b] mb-1">Horário Disponível</label>
                  <select
                    id="select-booking-time"
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                  >
                    {availableTimeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot} (Livre)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#86868b] mb-1">Observações ou Sintomas Notados</label>
                <textarea
                  id="input-booking-notes"
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Ex: Barulho ao frear, luz da injeção acesa, checar fluido..."
                  className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none resize-none"
                />
              </div>

              <div className="p-3.5 bg-black rounded-2xl border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#86868b] block">Veículo:</span>
                  <span className="font-semibold text-[#f5f5f7]">{vehicle.brand} {vehicle.model} ({vehicle.licensePlate})</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#86868b] block">Valor Estimado:</span>
                  <span className="font-mono text-base font-semibold text-[#30d158]">R$ {bookingPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  id="btn-cancel-booking"
                  onClick={() => setSelectedWorkshopForBooking(null)}
                  className="px-4 py-2 font-medium text-[#86868b] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-confirm-booking"
                  className="px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold tracking-tight shadow-md shadow-[#0071e3]/25 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#161617] border border-white/[0.12] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5 border-b border-white/[0.08] pb-3">
              <h3 className="font-semibold text-lg text-[#f5f5f7] tracking-tight flex items-center gap-2">
                <Star className="w-4 h-4 text-[#ff9f0a] fill-[#ff9f0a]" />
                Avaliação de Oficina & Mecânico
              </h3>
              <button 
                id="btn-close-review-modal"
                onClick={() => setShowReviewModal(false)}
                className="text-[#86868b] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#86868b] mb-1">Selecione a Oficina</label>
                <select
                  id="select-review-workshop"
                  value={reviewWorkshopId}
                  onChange={(e) => setReviewWorkshopId(e.target.value)}
                  className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                >
                  {workshops.map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.name} ({ws.neighborhood})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#86868b] mb-1">Nota Geral (1 a 5 estrelas)</label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star className={`w-5 h-5 ${star <= reviewRating ? 'text-[#ff9f0a] fill-[#ff9f0a]' : 'text-white/20'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-[#ff9f0a] ml-2">
                    {reviewRating === 5 ? 'Excelente' : reviewRating === 4 ? 'Muito Bom' : reviewRating === 3 ? 'Regular' : 'Ruim'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#86868b] mb-1">Serviço Executado</label>
                <input
                  id="input-review-service"
                  type="text"
                  required
                  value={reviewService}
                  onChange={(e) => setReviewService(e.target.value)}
                  placeholder="Ex: Troca de pastilhas de freio e alinhamento 3D"
                  className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#86868b] mb-1">Destaques do Atendimento (Tags)</label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Preço Justo', 'Transparência', 'Pontualidade', 'Peças Originais', 'Ambiente Limpo', 'Vídeos no WhatsApp', 'Garantia Rápida'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                        reviewTags.includes(tag)
                          ? 'bg-white text-black font-semibold'
                          : 'bg-white/[0.04] text-[#86868b] border border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#86868b] mb-1">Seu Comentário Detalhado</label>
                <textarea
                  id="input-review-comment"
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Conte como foi sua experiência com o mecânico, qualidade das peças e clareza no orçamento..."
                  className="w-full bg-black border border-white/[0.12] rounded-xl px-3 py-2 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  id="btn-cancel-review"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 font-medium text-[#86868b] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-submit-review"
                  className="px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold tracking-tight shadow-md shadow-[#0071e3]/25"
                >
                  Publicar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
