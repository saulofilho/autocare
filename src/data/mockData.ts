import {
  Vehicle,
  MaintenanceItem,
  MaintenanceRecord,
  FuelLog,
  Workshop,
  MechanicReview,
  CarComponent3DInfo,
  PushNotificationItem,
  MaintenanceTipItem,
  ServiceBooking
} from '../types/vehicle';

export const initialVehicle: Vehicle = {
  id: 'veh-01',
  brand: 'Volkswagen',
  model: 'T-Cross 1.4 250 TSI Highline',
  year: 2023,
  licensePlate: 'BRA2E19',
  currentKm: 48350,
  fuelTankCapacity: 52,
  currentFuelLevel: 36,
  fuelType: 'Flex',
  color: '#2563eb', // Royal Blue
  vin: '9BWKB4BZ7NP028194'
};

export const initialMaintenanceItems: MaintenanceItem[] = [
  {
    id: 'm-oil',
    name: 'Óleo do Motor 5W30 Sintético & Filtro',
    category: 'fluidos',
    intervalKm: 10000,
    intervalMonths: 12,
    lastServiceKm: 40000,
    lastServiceDate: '2025-11-10',
    nextServiceKm: 50000,
    healthPercent: 16, // Near 50,000 km! (1,650 km left)
    urgency: 'warning',
    estimatedCost: 380,
    description: 'Lubrificante 100% sintético norma VW 508.88 + elemento filtrante.',
    components3dKey: 'engine'
  },
  {
    id: 'm-brakes',
    name: 'Pastilhas de Freio Dianteiras',
    category: 'freios',
    intervalKm: 25000,
    intervalMonths: 24,
    lastServiceKm: 25000,
    lastServiceDate: '2025-02-14',
    nextServiceKm: 50000,
    healthPercent: 8, // Urgent!
    urgency: 'critical',
    estimatedCost: 320,
    description: 'Espessura residual de 2.5mm. Requer substituição preventiva.',
    components3dKey: 'brakes'
  },
  {
    id: 'm-air-filter',
    name: 'Filtro de Ar do Motor & Cabine (A/C)',
    category: 'motor',
    intervalKm: 15000,
    intervalMonths: 12,
    lastServiceKm: 35000,
    lastServiceDate: '2025-07-20',
    nextServiceKm: 50000,
    healthPercent: 11,
    urgency: 'warning',
    estimatedCost: 190,
    description: 'Filtro de motor saturado aumenta consumo em até 8%.',
    components3dKey: 'air_filter'
  },
  {
    id: 'm-spark-plugs',
    name: 'Velas de Ignição Iridium',
    category: 'motor',
    intervalKm: 40000,
    intervalMonths: 36,
    lastServiceKm: 10000,
    lastServiceDate: '2024-03-01',
    nextServiceKm: 50000,
    healthPercent: 4,
    urgency: 'critical',
    estimatedCost: 450,
    description: 'Velas desgastadas causam falhas de ignição e carbonização.',
    components3dKey: 'engine'
  },
  {
    id: 'm-tires',
    name: 'Alinhamento 3D, Balanceamento & Rodízio',
    category: 'pneus',
    intervalKm: 10000,
    intervalMonths: 6,
    lastServiceKm: 42000,
    lastServiceDate: '2026-01-15',
    nextServiceKm: 52000,
    healthPercent: 63,
    urgency: 'ok',
    estimatedCost: 180,
    description: 'Prolonga a vida útil dos pneus em até 20.000 km.',
    components3dKey: 'tires'
  },
  {
    id: 'm-coolant',
    name: 'Líquido de Arrefecimento G12/G13',
    category: 'fluidos',
    intervalKm: 60000,
    intervalMonths: 48,
    lastServiceKm: 0,
    lastServiceDate: '2023-08-01',
    nextServiceKm: 60000,
    healthPercent: 68,
    urgency: 'ok',
    estimatedCost: 260,
    description: 'Fluido orgânico de arrefecimento e protetor anticorrosão.',
    components3dKey: 'radiator'
  },
  {
    id: 'm-timing-belt',
    name: 'Correia Dentada / Kit Distribuição',
    category: 'motor',
    intervalKm: 80000,
    intervalMonths: 60,
    lastServiceKm: 0,
    lastServiceDate: '2023-08-01',
    nextServiceKm: 80000,
    healthPercent: 78,
    urgency: 'ok',
    estimatedCost: 950,
    description: 'Inspeção visual a cada 20.000 km. Troca aos 80.000 km.',
    components3dKey: 'engine'
  },
  {
    id: 'm-battery',
    name: 'Bateria EFB / AGM Start-Stop (60Ah)',
    category: 'eletrica',
    intervalKm: 0,
    intervalMonths: 36,
    lastServiceKm: 0,
    lastServiceDate: '2023-08-01',
    nextServiceKm: 0,
    healthPercent: 55,
    urgency: 'ok',
    estimatedCost: 650,
    description: 'Tensão sob repouso: 12.4V. Teste de CCA em 82%.',
    components3dKey: 'battery'
  }
];

export const initialMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'rec-01',
    itemId: 'm-oil',
    itemName: 'Troca de Óleo 5W30 + Filtro de Óleo',
    date: '2025-11-10',
    odometerKm: 40000,
    workshopName: 'Bosch Car Service Centro',
    workshopId: 'ws-01',
    cost: 360,
    notes: 'Utilizado Motul 8100 X-cess 5W40 + Filtro Mann.'
  },
  {
    id: 'rec-02',
    itemId: 'm-tires',
    itemName: 'Alinhamento 3D + Balanceamento 4 Rodas',
    date: '2026-01-15',
    odometerKm: 42000,
    workshopName: 'Della Via Pneus & Auto Center',
    workshopId: 'ws-03',
    cost: 170,
    notes: 'Rodízio em X dos pneus dianteiros e traseiros.'
  },
  {
    id: 'rec-03',
    itemId: 'm-brakes',
    itemName: 'Pastilhas de Freio Traseiras',
    date: '2025-05-18',
    odometerKm: 32000,
    workshopName: 'AutoTech Garage Premium',
    workshopId: 'ws-02',
    cost: 290,
    notes: 'Substituição das pastilhas traseiras originais Fras-le.'
  }
];

export const initialFuelLogs: FuelLog[] = [
  {
    id: 'fuel-01',
    date: '2026-03-02',
    odometerKm: 48350,
    fuelType: 'Gasolina Comum',
    liters: 42.5,
    pricePerLiter: 5.89,
    totalCost: 250.32,
    fullTank: true,
    stationName: 'Posto Shell Select - Av. Brasil',
    calculatedKmPerLiter: 12.8
  },
  {
    id: 'fuel-02',
    date: '2026-02-18',
    odometerKm: 47810,
    fuelType: 'Gasolina Comum',
    liters: 45.0,
    pricePerLiter: 5.79,
    totalCost: 260.55,
    fullTank: true,
    stationName: 'Posto Ipiranga Centro',
    calculatedKmPerLiter: 12.4
  },
  {
    id: 'fuel-03',
    date: '2026-02-05',
    odometerKm: 47250,
    fuelType: 'Etanol',
    liters: 48.0,
    pricePerLiter: 3.79,
    totalCost: 181.92,
    fullTank: true,
    stationName: 'Posto Petrobras BR Mania',
    calculatedKmPerLiter: 8.9
  },
  {
    id: 'fuel-04',
    date: '2026-01-22',
    odometerKm: 46820,
    fuelType: 'Gasolina Aditivada',
    liters: 43.2,
    pricePerLiter: 6.09,
    totalCost: 263.08,
    fullTank: true,
    stationName: 'Posto Shell V-Power',
    calculatedKmPerLiter: 13.1
  },
  {
    id: 'fuel-05',
    date: '2026-01-08',
    odometerKm: 46250,
    fuelType: 'Etanol',
    liters: 46.5,
    pricePerLiter: 3.69,
    totalCost: 171.58,
    fullTank: true,
    stationName: 'Posto Ale Combustíveis',
    calculatedKmPerLiter: 9.1
  }
];

export const initialWorkshops: Workshop[] = [
  {
    id: 'ws-01',
    name: 'Bosch Car Service - Centro Automotivo',
    category: 'Geral',
    address: 'Av. das Américas, 2840',
    neighborhood: 'Barra',
    city: 'Rio de Janeiro - RJ',
    distanceKm: 2.1,
    rating: 4.9,
    reviewsCount: 148,
    phone: '(21) 3456-7890',
    whatsapp: '5521999887766',
    isOpen: true,
    openHours: '08:00 - 18:00',
    verifiedPartner: true,
    latitude: -23.000,
    longitude: -43.365,
    featuredServices: [
      { name: 'Troca de Óleo + Filtros', price: 350, durationMinutes: 45 },
      { name: 'Revisão Geral Preventiva (50 itens)', price: 420, durationMinutes: 120 },
      { name: 'Diagnóstico Scanner Eletrônico OBD-II', price: 150, durationMinutes: 40 },
      { name: 'Substituição Pastilhas de Freio', price: 280, durationMinutes: 60 }
    ]
  },
  {
    id: 'ws-02',
    name: 'AutoTech Garage Premium & Câmbios',
    category: 'Injeção & Motor',
    address: 'Rua General Polidoro, 112',
    neighborhood: 'Botafogo',
    city: 'Rio de Janeiro - RJ',
    distanceKm: 4.8,
    rating: 4.8,
    reviewsCount: 92,
    phone: '(21) 2234-5566',
    whatsapp: '5521988776655',
    isOpen: true,
    openHours: '08:30 - 18:00',
    verifiedPartner: true,
    latitude: -22.955,
    longitude: -43.189,
    featuredServices: [
      { name: 'Limpeza de Bicos Injetores Ultrassom', price: 240, durationMinutes: 90 },
      { name: 'Troca Correia Dentada + Tensores', price: 780, durationMinutes: 180 },
      { name: 'Revisão Sistema de Arrefecimento', price: 220, durationMinutes: 60 }
    ]
  },
  {
    id: 'ws-03',
    name: 'Della Via Pneus & Suspensão',
    category: 'Pneus & Alinhamento',
    address: 'Av. Brasil, 8200',
    neighborhood: 'Ramos',
    city: 'Rio de Janeiro - RJ',
    distanceKm: 5.5,
    rating: 4.7,
    reviewsCount: 215,
    phone: '(21) 3987-1234',
    whatsapp: '5521977665544',
    isOpen: true,
    openHours: '07:30 - 19:00',
    verifiedPartner: true,
    latitude: -22.855,
    longitude: -43.250,
    featuredServices: [
      { name: 'Alinhamento 3D + Balanceamento 4 Rodas', price: 160, durationMinutes: 45 },
      { name: 'Troca Amortecedores Dianteiros (Par)', price: 650, durationMinutes: 120 },
      { name: 'Higienização de Ar Condicionado c/ Ozônio', price: 130, durationMinutes: 30 }
    ]
  },
  {
    id: 'ws-04',
    name: 'Freios & Cia Especialistas',
    category: 'Freios & Suspensão',
    address: 'Rua Conde de Bonfim, 670',
    neighborhood: 'Tijuca',
    city: 'Rio de Janeiro - RJ',
    distanceKm: 6.2,
    rating: 4.9,
    reviewsCount: 78,
    phone: '(21) 2571-0099',
    whatsapp: '5521966554433',
    isOpen: false,
    openHours: '08:00 - 17:30',
    verifiedPartner: true,
    latitude: -22.929,
    longitude: -43.238,
    featuredServices: [
      { name: 'Troca Pastilhas & Discos Dianteiros', price: 580, durationMinutes: 90 },
      { name: 'Sangria & Fluido de Freio DOT 4 / 5.1', price: 180, durationMinutes: 50 },
      { name: 'Retífica de Tambor / Disco', price: 140, durationMinutes: 60 }
    ]
  }
];

export const initialReviews: MechanicReview[] = [
  {
    id: 'rev-01',
    workshopId: 'ws-01',
    userName: 'Carlos Eduardo Silveira',
    rating: 5,
    date: '2026-02-28',
    serviceRendered: 'Troca de Óleo + Revisão Freios',
    vehicleModel: 'VW T-Cross 1.4 TSI',
    comment: 'Atendimento impecável! Explicaram tudo o que precisava ser trocado, mostraram as peças velhas no balcão e não empurraram serviços desnecessários. Recomendo muito!',
    tags: ['Preço Justo', 'Transparência', 'Pontualidade', 'Peças Originais']
  },
  {
    id: 'rev-02',
    workshopId: 'ws-01',
    userName: 'Fernanda Martins',
    rating: 5,
    date: '2026-02-14',
    serviceRendered: 'Diagnóstico Scanner OBD-II',
    vehicleModel: 'Jeep Renegade',
    comment: 'Luz da injeção acendeu na viagem. Passaram o scanner na hora, identificaram que era a sonda lambda, limparam os contatos e resolveram sem enrolação.',
    tags: ['Rápido Atendimento', 'Conhecimento Técnico', 'Ambiente Limpo']
  },
  {
    id: 'rev-03',
    workshopId: 'ws-02',
    userName: 'Rodrigo P. Mendes',
    rating: 5,
    date: '2026-01-20',
    serviceRendered: 'Troca de Correia Dentada',
    vehicleModel: 'Honda Civic G10',
    comment: 'Mecânicos super experientes. Mandaram vídeos no WhatsApp com todo o processo da desmontagem e montagem do motor.',
    tags: ['Vídeos no WhatsApp', 'Excelente Acabamento', 'Garantia 6 Meses']
  },
  {
    id: 'rev-04',
    workshopId: 'ws-03',
    userName: 'Juliana Costa',
    rating: 4,
    date: '2026-02-10',
    serviceRendered: 'Alinhamento 3D e Pneus',
    vehicleModel: 'Toyota Corolla Cross',
    comment: 'Serviço muito bem executado, volante ficou 100% reto. Apenas a sala de espera que estava um pouco cheia no horário do almoço.',
    tags: ['Alinhamento Perfeito', 'Bons Preços']
  }
];

export const car3DComponents: CarComponent3DInfo[] = [
  {
    id: 'engine',
    name: 'Motor a Combustão & Bloco de Cilindros',
    category: 'Powertrain',
    healthPercent: 82,
    statusText: 'Ótimo estado, revisão de velas próxima aos 50.000 km',
    urgency: 'ok',
    howItWorks: 'Converte a queima da mistura de ar e combustível em movimento rotacional através dos pistões, bielas e virabrequim.',
    symptoms: [
      'Ruído metálico tipo "batida de pino" em aclives',
      'Fumaça azulada no escapamento (óleo queimando)',
      'Perda de potência e consumo elevado de combustível'
    ],
    maintenanceTip: 'Nunca estenda o prazo da troca de óleo e use sempre a viscosidade correta (5W30) para preservar o turbo e tuchos hidráulicos.',
    estimatedReplacementCost: 'R$ 3.000 - R$ 12.000 (retífica completa)',
    recommendedInterval: 'Revisão periódica a cada 10.000 km',
    position3D: [0, 0.45, 1.3]
  },
  {
    id: 'brakes',
    name: 'Sistema de Freios a Disco & Pinças',
    category: 'Segurança Ativa',
    healthPercent: 18,
    statusText: 'Pastilhas dianteiras com desgaste acentuado (2.5mm)',
    urgency: 'critical',
    howItWorks: 'A pressão hidráulica comprime as pastilhas contra os discos de freio giratórios nas rodas, convertendo energia cinética em calor.',
    symptoms: [
      'Chiado ou rangido metálico ao pisar no freio',
      'Pedal esponjoso ou descendo até o assoalho',
      'Vibração no volante ao frear em velocidades de estrada'
    ],
    maintenanceTip: 'Trocar as pastilhas antes de encostarem na placa de aço evita ter que retificar ou comprar discos novos, economizando até R$ 600.',
    estimatedReplacementCost: 'R$ 280 - R$ 650 (dianteiras + mão de obra)',
    recommendedInterval: 'Checar a cada 10.000 km; trocar entre 25.000 e 35.000 km',
    position3D: [-0.85, 0.1, 1.45]
  },
  {
    id: 'transmission',
    name: 'Transmissão & Caixa de Câmbio Automática',
    category: 'Transmissão',
    healthPercent: 90,
    statusText: 'Engate suave de marchas, fluido ATF em nível ideal',
    urgency: 'ok',
    howItWorks: 'Transfere o torque do motor para os eixos de tração através de engrenagens planetárias e conversor de torque.',
    symptoms: [
      'Trancos nas trocas de marcha',
      'Demora para engatar Drive (D) ou Ré (R)',
      'Cheiro de óleo queimado vindo de baixo do veículo'
    ],
    maintenanceTip: 'Nunca puxe a alavanca para P (Parking) com o carro ainda em movimento. Troque o fluido ATF a cada 60.000 km.',
    estimatedReplacementCost: 'R$ 4.500 - R$ 9.000',
    recommendedInterval: 'Troca de fluido entre 60.000 e 80.000 km',
    position3D: [0, 0.2, 0.5]
  },
  {
    id: 'radiator',
    name: 'Radiador & Sistema de Arrefecimento',
    category: 'Controle Térmico',
    healthPercent: 88,
    statusText: 'Nível e aditivo G12 corretos, sem vazamentos térmicos',
    urgency: 'ok',
    howItWorks: 'Circula fluido refrigerante pelo bloco do motor para manter a temperatura operacional estável em torno de 90°C.',
    symptoms: [
      'Ponteiro de temperatura subindo além do centro',
      'Ventoinha acionando na velocidade máxima com frequência',
      'Pó branco ou líquido verde/rosa pingando embaixo do para-choque'
    ],
    maintenanceTip: 'NUNCA complete com água da torneira! Use sempre água desmineralizada + aditivo orgânico na proporção 50/50 para evitar corrosão interna.',
    estimatedReplacementCost: 'R$ 450 - R$ 1.100',
    recommendedInterval: 'Substituição completa a cada 60.000 km ou 4 anos',
    position3D: [0, 0.4, 2.05]
  },
  {
    id: 'exhaust',
    name: 'Sistema de Exaustão & Catalisador',
    category: 'Emissões & Escapamento',
    healthPercent: 92,
    statusText: 'Catalisador operando em eficiência máxima, sondas OK',
    urgency: 'ok',
    howItWorks: 'Coleta os gases tóxicos gerados pela combustão, filtra poluentes com metais nobres no catalisador e abafa ruídos com silenciadores.',
    symptoms: [
      'Ruído esportivo ou estalos sob o assoalho',
      'Luz da injeção eletrônica acesa (código P0420)',
      'Cheiro forte de ovo podre ou enxofre pelo escapamento'
    ],
    maintenanceTip: 'Evite combustível adulterado; solventes destroem a cerâmica interna do catalisador.',
    estimatedReplacementCost: 'R$ 1.200 - R$ 3.500',
    recommendedInterval: 'Vida útil média de 100.000 km',
    position3D: [0, 0.15, -1.2]
  },
  {
    id: 'battery',
    name: 'Bateria Automotiva 12V 60Ah EFB',
    category: 'Sistema Elétrico',
    healthPercent: 74,
    statusText: 'Carga 12.4V sob repouso, partida instantânea',
    urgency: 'ok',
    howItWorks: 'Fornece a corrente elétrica de alta amperagem necessária para acionar o motor de partida e alimenta eletrônicos com o carro desligado.',
    symptoms: [
      'Partida pesada ou lenta pela manhã',
      'Luzes do painel piscando ao girar a chave',
      'Luz da bateria acesa no quadro de instrumentos'
    ],
    maintenanceTip: 'Desligue faróis e ar-condicionado antes de dar partida no motor para reduzir o estresse sobre as placas de chumbo.',
    estimatedReplacementCost: 'R$ 480 - R$ 750',
    recommendedInterval: 'Duração média de 2 a 3 anos',
    position3D: [0.55, 0.65, 1.4]
  },
  {
    id: 'suspension',
    name: 'Suspensão McPherson & Amortecedores',
    category: 'Conforto e Estabilidade',
    healthPercent: 76,
    statusText: 'Batentes e buchas preservados, sem vazamento de óleo',
    urgency: 'ok',
    howItWorks: 'Molas e amortecedores absorvem impactos do asfalto, mantendo os pneus sempre em contato firme com a pista.',
    symptoms: [
      'Carro continua balançando após passar por lombadas',
      'Batidas secas "toc-toc" em pisos irregulares',
      'Desgaste irregular ou escamado na banda de rodagem dos pneus'
    ],
    maintenanceTip: 'Sempre faça alinhamento após trocar componentes de suspensão para evitar que o carro puxe para os lados.',
    estimatedReplacementCost: 'R$ 700 - R$ 1.600 (par)',
    recommendedInterval: 'Revisar a cada 20.000 km; troca com 50.000 - 70.000 km',
    position3D: [-0.75, 0.4, 1.35]
  },
  {
    id: 'tires',
    name: 'Conjunto de Pneus 205/55 R17 & Rodas',
    category: 'Aderência e Frenagem',
    healthPercent: 68,
    statusText: 'Sulcos em 4.5mm (mínimo legal: 1.6mm TWI)',
    urgency: 'ok',
    howItWorks: 'Único ponto de contato entre o carro e o chão. Garante tração, frenagem e estabilidade direcional sob qualquer clima.',
    symptoms: [
      'Aquaplanagem em poças leves de chuva',
      'Distância de frenagem aumentada',
      'Indicador de desgaste TWI nivelado com a borracha da banda'
    ],
    maintenanceTip: 'Calibre os pneus a cada 15 dias com eles ainda frios. Pneus 3 PSI abaixo do recomendado aumentam o consumo de gasolina em 4%.',
    estimatedReplacementCost: 'R$ 450 - R$ 680 por pneu',
    recommendedInterval: 'Rodízio a cada 10.000 km; troca com 40.000 a 60.000 km',
    position3D: [0.85, 0.1, -1.35]
  }
];

export const initialPushNotifications: PushNotificationItem[] = [
  {
    id: 'notif-01',
    title: '⚠️ Lembrete de Manutenção por Quilometragem',
    message: 'Seu veículo atingiu 48.350 km. As pastilhas de freio dianteiras e o óleo do motor estão previstos para 50.000 km (restam 1.650 km). Agende uma revisão preventiva!',
    date: 'Hoje, 10:15',
    type: 'mileage',
    read: false,
    priority: 'alta',
    actionUrl: 'marketplace'
  },
  {
    id: 'notif-02',
    title: '⛽ Oportunidade de Economia no Abastecimento',
    message: 'O Etanol na sua região está a R$ 3,79 vs Gasolina a R$ 5,89 (relação 64,3%). Abastecer com Etanol é mais vantajoso hoje!',
    date: 'Ontem, 16:40',
    type: 'fuel',
    read: true,
    priority: 'normal',
    actionUrl: 'fuel'
  },
  {
    id: 'notif-03',
    title: '🔧 Agendamento Confirmado',
    message: 'Sua revisão preventiva na oficina Bosch Car Service está confirmada para Quarta-feira às 09:30.',
    date: '28 Fev, 14:00',
    type: 'booking',
    read: true,
    priority: 'normal',
    actionUrl: 'marketplace'
  }
];

export const initialBookings: ServiceBooking[] = [
  {
    id: 'book-01',
    workshopId: 'ws-01',
    workshopName: 'Bosch Car Service - Centro Automotivo',
    serviceName: 'Revisão Geral Preventiva (50 itens)',
    price: 420,
    date: '2026-03-12',
    timeSlot: '09:30',
    status: 'confirmado',
    vehiclePlate: 'BRA2E19',
    notes: 'Verificar pastilhas de freio dianteiras e ruído leve na partida a frio.',
    createdAt: '2026-03-01'
  }
];

export const initialMaintenanceTips: MaintenanceTipItem[] = [
  {
    id: 'tip-01',
    title: 'Calibragem Semanal dos Pneus Economiza até R$ 450/ano',
    category: 'Economia',
    summary: 'Rodar com pneus murchos aumenta o atrito com o solo, o desgaste prematuro dos ombros e eleva o consumo de combustível em até 4%.',
    content: 'Calibre sempre com os pneus frios (tendo rodado menos de 3 km). Utilize a pressão recomendada na etiqueta da coluna da porta do motorista (geralmente entre 30 e 34 PSI). Não se esqueça de calibrar o estepe com 2 a 4 PSI a mais.',
    potentialSavings: 'Economia de até 4% em combustível + 15.000 km a mais de vida útil nos pneus',
    difficulty: 'Fácil',
    iconName: 'Gauge'
  },
  {
    id: 'tip-02',
    title: 'Como Interpretar a Luz da Injeção Eletrônica',
    category: 'Luzes do Painel',
    summary: 'A luz amarela espia indica anomalia na queima, combustível adulterado, velas ou sensores como sonda lambda.',
    content: 'Se a luz estiver contínua e o carro não falhar, procure uma oficina em até 48h para passar o scanner OBD-II. Se a luz estiver PISCANDO, pare o veículo imediatamente: indica que combustível não queimado está sendo expelido no catalisador, podendo fundir o componente e gerar prejuízo superior a R$ 2.500.',
    potentialSavings: 'Previne a queima precoce do catalisador e bicos injetores',
    difficulty: 'Médio',
    iconName: 'AlertTriangle'
  },
  {
    id: 'tip-03',
    title: 'Troca de Pastilhas vs Troca de Discos: A Conta que Fecha',
    category: 'Freios',
    summary: 'Substituir as pastilhas aos primeiros sinais de desgaste custa R$ 300; deixar o ferro encostar custa R$ 900 com discos novos.',
    content: 'Pastilhas de freio possuem espessura mínima de segurança de 3mm. Quando chegam a 2mm, a chapa metálica de apoio começa a riscar a pista do disco de freio, gerando sulcos profundos que condenam o disco sem chance de retífica.',
    potentialSavings: 'Economia direta de até R$ 600 em discos de freio',
    difficulty: 'Médio',
    iconName: 'ShieldAlert'
  },
  {
    id: 'tip-04',
    title: 'A Regra dos 70%: Gasolina vs Etanol na Prática',
    category: 'Economia',
    summary: 'Divida o valor do litro do Etanol pelo da Gasolina. Se o resultado for menor que 0,70 (ou 0,73 em motores modernos TSI), o Etanol compensa.',
    content: 'Motores modernos com injeção direta de combustível têm taxa de compressão mais alta e aproveitam melhor a octanagem do Etanol (102 RON), podendo compensar até a marca de 73% do preço da gasolina. Teste a média real do seu carro com nosso painel de combustível!',
    potentialSavings: 'Até R$ 120 - R$ 180 por mês no tanque cheio',
    difficulty: 'Fácil',
    iconName: 'Fuel'
  },
  {
    id: 'tip-05',
    title: 'Água da Torneira no Radiador: O Erro Mais Caro',
    category: 'Motor',
    summary: 'O cloro e os sais minerais da água comum causam corrosão galvânica acelerada no cabeçote de alumínio e bomba d água.',
    content: 'Nunca utilize água mineral ou de torneira. Use unicamente água desmineralizada diluída com aditivo homologado (norma ABNT NBR 13705 ou VW G12/G13). Um kit de aditivo custa R$ 70, enquanto a troca de um cabeçote corroído pode ultrapassar R$ 4.000.',
    potentialSavings: 'Evita retífica de cabeçote de R$ 3.500+',
    difficulty: 'Fácil',
    iconName: 'Droplet'
  },
  {
    id: 'tip-06',
    title: 'Filtro de Ar Saturado: O Inimigo Silencioso',
    category: 'Motor',
    summary: 'O motor precisa de cerca de 10.000 litros de ar para queimar 1 litro de combustível. Um filtro entupido sufoca o carro.',
    content: 'Em cidades com muito pó ou trânsito intenso, o filtro de ar se satura muito antes dos 10.000 km previstos. Trocar este item simples de R$ 60 melhora imediatamente a resposta do acelerador e reduz o consumo instantâneo em até 8%.',
    potentialSavings: 'Redução de até 8% no gasto mensal de combustível',
    difficulty: 'Fácil',
    iconName: 'Wind'
  }
];

export const initialCostBreakdowns = [
  {
    month: 'Mar/2026',
    fuel: 432.24,
    maintenance: 0,
    fixedCosts: 320,
    total: 752.24
  },
  {
    month: 'Fev/2026',
    fuel: 614.05,
    maintenance: 180,
    fixedCosts: 320,
    total: 1114.05
  },
  {
    month: 'Jan/2026',
    fuel: 606.24,
    maintenance: 420,
    fixedCosts: 320,
    total: 1346.24
  },
  {
    month: 'Dez/2025',
    fuel: 780.50,
    maintenance: 650,
    fixedCosts: 320,
    total: 1750.50
  }
];

export const initialOptimizationTips = [
  {
    title: 'Calibragem Semanal a Frio',
    category: 'Pneus & Consumo',
    description: 'Manter a pressão correta (32 PSI) reduz o atrito e economiza até 4% em combustível além de aumentar a vida útil dos pneus.',
    estimatedSavingsYearly: 480,
    impact: '-4% no gasto com gasolina'
  },
  {
    title: 'Aproveitamento da Paridade de Etanol',
    category: 'Abastecimento',
    description: 'Abastecer com etanol apenas quando o preço for inferior a 70% do valor da gasolina gera uma economia substancial no ano.',
    estimatedSavingsYearly: 720,
    impact: 'R$ 60 a menos por mês'
  },
  {
    title: 'Antecipação da Troca de Pastilhas',
    category: 'Freios Preventivos',
    description: 'Trocar pastilhas antes de encostarem na chapa de aço evita a retífica ou substituição prematura dos discos de freio.',
    estimatedSavingsYearly: 600,
    impact: 'Preservação dos discos'
  },
  {
    title: 'Filtro de Ar do Motor Limpo',
    category: 'Desempenho & Injeção',
    description: 'Substituir o filtro a cada 10.000 km mantém a estequiometria ideal do motor sem sobrecarregar os bicos injetores.',
    estimatedSavingsYearly: 240,
    impact: 'Menos queima irregular'
  }
];
