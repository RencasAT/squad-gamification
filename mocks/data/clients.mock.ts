import type {
  ClienteDetalle,
  ClienteGrupo,
} from '@gamification/atenea-clientes-buscador/model/cliente.types';

/** Grupos disponibles para asignar (mock). */
export const mockGruposCatalogo: ClienteGrupo[] = [
  {
    id: 1,
    name: 'Jugador activado',
    participants: 1029485,
    risk: 'bajo',
  },
  {
    id: 2,
    name: 'Jugador no activado',
    participants: 1029485,
    risk: 'bajo',
  },
  {
    id: 3,
    name: 'Cumpleaños',
    participants: 1029485,
    risk: 'bajo',
  },
  {
    id: 4,
    name: 'VIP',
    participants: 1029485,
    risk: 'bajo',
  },
  {
    id: 5,
    name: 'Codigacho deportivas',
    participants: 1029485,
    risk: 'bajo',
  },
  {
    id: 6,
    name: 'Depositante',
    participants: 1029485,
    risk: 'bajo',
  },
  {
    id: 7,
    name: 'mision-maestro-juego-prueba-fuego',
    participants: 1029485,
    risk: 'medio',
  },
  {
    id: 8,
    name: 'Retiro',
    participants: 1029485,
    risk: 'alto',
  },
  {
    id: 9,
    name: 'Cross sell',
    participants: 9800,
    risk: 'bajo',
  },
  {
    id: 10,
    name: 'Misión Casino VIP',
    participants: 1029485,
    risk: 'bajo',
  },
  {
    id: 11,
    name: 'Promociones VIP',
    participants: 1029485,
    risk: 'bajo',
  },
  {
    id: 12,
    name: 'Torneo semanal',
    participants: 1029485,
    risk: 'bajo',
  },
];

/** Mock local hasta conectar API de clientes. */
export const mockClienteDetalle: ClienteDetalle = {
  num: '76461311',
  name: 'Maria del Pilar Milla Terarrosa',
  clientId: '1002052584',
  lastLoginLabel: 'Logueado hace 5 dias',
  registeredAtDate: '04/02/2025',
  resumen: {
    deportivas: [
      { value: 'Fútbol', label: 'Deporte más apostado' },
      { value: '5.25', label: 'Cuota promedio' },
      { value: 'S/ 10,000', label: 'Apostado total' },
      { value: 'S/ 20,000', label: 'GGR Deportivas' },
    ],
    casino: [
      { value: 'Sweet Bonanza', label: 'Maquina más jugada' },
      { value: 'Slots', label: 'Tipo de maquinas más jugadas' },
      { value: '5', label: 'N° de maquinas jugadas' },
      { value: 'S/ 1,000', label: 'GGR Casino' },
    ],
    tipoJugador: {
      title: 'Conocedor deportivo',
      description:
        'Este sobrin@, apuesta a las fijas y tiene una amplia librería de apostados en diferentes mercados. Priorizar en eventos deportivos y cross.',
    },
  },
  grupos: [
    {
      id: 1,
      name: 'Jugador activado',
      participants: 1029485,
      risk: 'bajo',
    },
    {
      id: 2,
      name: 'Jugador no activado',
      participants: 1029485,
      risk: 'bajo',
    },
    {
      id: 3,
      name: 'Cumpleaños',
      participants: 1029485,
      risk: 'bajo',
    },
    {
      id: 4,
      name: 'VIP',
      participants: 1029485,
      risk: 'bajo',
    },
    {
      id: 5,
      name: 'Codigacho deportivas',
      participants: 1029485,
      risk: 'bajo',
    },
    {
      id: 6,
      name: 'Depositante',
      participants: 1029485,
      risk: 'bajo',
    },
    {
      id: 7,
      name: 'mision-maestro-juego-prueba-fuego',
      participants: 1029485,
      risk: 'medio',
    },
    {
      id: 8,
      name: 'Retiro',
      participants: 1029485,
      risk: 'alto',
    },
  ],
  logros: [
    {
      id: '1era-jugada',
      title: '1era Jugada',
      description: 'Adquirida el 09 de Febrero del 2025',
      tone: 'light',
      acquired: true,
    },
    {
      id: 'apostador',
      title: 'Apostador',
      description: 'Adquirida el 09 de Febrero del 2025',
      tone: 'light',
      acquired: true,
    },
    {
      id: 'goleador',
      title: 'Goleador',
      description: 'Se desbloquea al realizar 300 apuestas en un mes.',
      tone: 'medium',
      acquired: false,
      progress: 50,
    },
    {
      id: 'coleccionista',
      title: 'Coleccionista',
      description: 'Se desbloquea al obtener 10 logros.',
      tone: 'dark',
      acquired: false,
    },
    {
      id: 'racha-caliente',
      title: 'Racha caliente',
      description: 'Adquirida el 15 de Enero del 2025',
      tone: 'light',
      acquired: true,
    },
    {
      id: 'deportista',
      title: 'Deportista',
      description: 'Se desbloquea al apostar en 5 deportes distintos.',
      tone: 'medium',
      acquired: false,
    },
    {
      id: 'high-roller',
      title: 'High roller',
      description: 'Se desbloquea al apostar S/ 5,000 en un día.',
      tone: 'dark',
      acquired: false,
    },
    {
      id: 'casino-master',
      title: 'Casino master',
      description: 'Se desbloquea al jugar 20 máquinas distintas.',
      tone: 'medium',
      acquired: false,
    },
    {
      id: 'legendario',
      title: 'Legendario',
      description: 'Se desbloquea al completar todas las misiones.',
      tone: 'dark',
      acquired: false,
    },
  ],
  torneos: [
    {
      id: 1,
      name: 'Chilli-Race',
      participants: 1029485,
      type: 'carrera',
    },
    {
      id: 2,
      name: 'Torneo-Batalla-por-la-Copa',
      participants: 1029485,
      type: 'torneo',
    },
    {
      id: 3,
      name: 'Carrera-casino-fever',
      participants: 1029485,
      type: 'carrera',
    },
    {
      id: 4,
      name: 'Arena-reyes-del-slot',
      participants: 1029485,
      type: 'arena',
    },
    {
      id: 5,
      name: 'Torneo-premier-liga',
      participants: 1029485,
      type: 'torneo',
    },
    {
      id: 6,
      name: 'VIP-Carrera-fiestas-patrias',
      participants: 1029485,
      type: 'carrera',
    },
    {
      id: 7,
      name: 'Copa-deportivas',
      participants: 1029485,
      type: 'torneo',
    },
    {
      id: 8,
      name: 'Pragmatic-vip',
      participants: 1029485,
      type: 'arena',
    },
  ],
  misiones: [
    {
      id: 1,
      name: 'Chilli-Race',
      status: 'completado',
      enrolledAt: '16/07/2026 17:00:00',
    },
    {
      id: 2,
      name: 'Batalla-por-la-Copa',
      status: 'incompleto',
      enrolledAt: '16/07/2026 17:00:00',
    },
    {
      id: 3,
      name: 'Casino-fever',
      status: 'completado',
      enrolledAt: '16/07/2026 17:00:00',
    },
    {
      id: 4,
      name: 'VIP-fiestas-patrias',
      status: 'incompleto',
      enrolledAt: '16/07/2026 17:00:00',
    },
    {
      id: 5,
      name: 'Copa-deportivas',
      status: 'completado',
      enrolledAt: '16/07/2026 17:00:00',
    },
    {
      id: 6,
      name: 'Pragmatic-vip',
      status: 'completado',
      enrolledAt: '16/07/2026 17:00:00',
    },
    {
      id: 7,
      name: 'maestro-prueba-fuego',
      status: 'incompleto',
      enrolledAt: '16/07/2026 17:00:00',
    },
    {
      id: 8,
      name: 'torneo-mundialista',
      status: 'completado',
      enrolledAt: '16/07/2026 17:00:00',
    },
  ],
};

export function findClienteByNum(num: string): ClienteDetalle | null {
  const normalized = num.trim();
  if (!normalized) {
    return null;
  }

  const isKnown =
    normalized === mockClienteDetalle.num ||
    normalized === mockClienteDetalle.clientId;
  if (!isKnown) {
    return null;
  }

  return {
    ...mockClienteDetalle,
    num: normalized,
    grupos: mockClienteDetalle.grupos.map((grupo) => ({ ...grupo })),
    logros: mockClienteDetalle.logros.map((logro) => ({ ...logro })),
    torneos: mockClienteDetalle.torneos.map((torneo) => ({ ...torneo })),
    misiones: mockClienteDetalle.misiones.map((mision) => ({ ...mision })),
  };
}
