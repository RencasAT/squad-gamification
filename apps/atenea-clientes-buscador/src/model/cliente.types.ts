export type ClienteMetric = {
  value: string;
  label: string;
};

export type ClienteResumen = {
  deportivas: ClienteMetric[];
  casino: ClienteMetric[];
  tipoJugador: {
    title: string;
    description: string;
  };
};

export type ClienteGrupoRiesgo = 'bajo' | 'medio' | 'alto';

export type ClienteGrupo = {
  id: number;
  name: string;
  participants: number;
  risk: ClienteGrupoRiesgo;
};

/** Tono visual de la medalla (grises Figma). */
export type ClienteLogroTone = 'light' | 'medium' | 'dark';

export type ClienteLogro = {
  id: string;
  title: string;
  description: string;
  tone: ClienteLogroTone;
  acquired: boolean;
  /** 0–100; si existe y no está adquirido, se muestra el anillo de progreso. */
  progress?: number;
};

export type ClienteTorneoTipo = 'carrera' | 'torneo' | 'arena';

export type ClienteTorneo = {
  id: number;
  name: string;
  participants: number;
  type: ClienteTorneoTipo;
};

export type ClienteMisionEstado = 'completado' | 'incompleto';

export type ClienteMision = {
  id: number;
  name: string;
  status: ClienteMisionEstado;
  enrolledAt: string;
};

export type ClienteDetalle = {
  num: string;
  name: string;
  clientId: string;
  lastLoginLabel: string;
  registeredAtDate: string;
  resumen: ClienteResumen;
  grupos: ClienteGrupo[];
  logros: ClienteLogro[];
  torneos: ClienteTorneo[];
  misiones: ClienteMision[];
};

export type ClienteTabId =
  'resumen' | 'grupos' | 'logros' | 'torneos' | 'misiones';
