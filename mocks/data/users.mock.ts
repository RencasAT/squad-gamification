import type { BackofficeUser } from '@gamification/atenea-administracion-usuarios/model/user.types';

const ROLE_ADMIN = { id: 1, name: 'Admin' };
const ROLE_GAMIFICATION = { id: 2, name: 'Gamification' };
const ROLE_CRM = { id: 5, name: 'CRM' };
const ROLE_LEGAL = { id: 4, name: 'Legal' };
const ROLE_AAC = { id: 6, name: 'AAC' };

export const mockUsers: BackofficeUser[] = [
  {
    id: 1,
    externalId: 258168136,
    name: 'Pilar Milla',
    email: 'pilar.milla@apuestatotal.com',
    active: true,
    roles: [ROLE_ADMIN, ROLE_GAMIFICATION],
  },
  {
    id: 2,
    externalId: 258168137,
    name: 'Eduardo Escudero',
    email: 'eduardo.escudero@apuestatotal.com',
    active: true,
    roles: [ROLE_ADMIN, ROLE_GAMIFICATION],
  },
  {
    id: 3,
    externalId: 258168138,
    name: 'Ana Torres',
    email: 'ana.torres@apuestatotal.com',
    active: true,
    roles: [ROLE_ADMIN, ROLE_GAMIFICATION],
  },
  {
    id: 4,
    externalId: 258168139,
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@apuestatotal.com',
    active: true,
    roles: [ROLE_ADMIN, ROLE_CRM],
  },
  {
    id: 5,
    externalId: 258168140,
    name: 'Lucia Vega',
    email: 'lucia.vega@apuestatotal.com',
    active: true,
    roles: [ROLE_ADMIN, ROLE_LEGAL],
  },
  {
    id: 6,
    externalId: 258168141,
    name: 'Operador Demo',
    email: 'operador@apuestatotal.com',
    active: true,
    /** Sin administración: menú restringido (demo login operador). */
    roles: [ROLE_GAMIFICATION],
  },
  {
    id: 7,
    externalId: 258168142,
    name: 'Maria Lopez',
    email: 'maria.lopez@apuestatotal.com',
    active: true,
    roles: [ROLE_ADMIN, ROLE_AAC],
  },
  {
    id: 8,
    externalId: 258168143,
    name: 'Usuario Inactivo',
    email: 'inactivo@apuestatotal.com',
    active: false,
    roles: [ROLE_CRM],
  },
  {
    id: 9,
    externalId: 258168144,
    name: 'Usuario Nuevo',
    email: 'nuevo@apuestatotal.com',
    active: true,
    roles: [ROLE_GAMIFICATION],
  },
];
