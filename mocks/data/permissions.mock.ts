import type { RolePermissionModuleDef } from '@gamification/atenea-administracion-roles/model/role.types';

export const mockPermissionModules: RolePermissionModuleDef[] = [
  {
    id: 'contenido-gamification',
    label: 'Contenido de Gamification',
    features: [
      { id: 'torneos', label: 'Torneos', detailLabel: 'Torneos' },
      { id: 'misiones', label: 'Misiones', detailLabel: 'Misiones' },
      { id: 'rachas', label: 'Rachas', detailLabel: 'Rachas' },
      {
        id: 'terminos',
        label: 'Plantillas TyC',
        detailLabel: 'Plantillas TyC',
      },
    ],
  },
  {
    id: 'premios',
    label: 'Premios',
    features: [
      {
        id: 'catalogo',
        label: 'Creación de Premios',
        detailLabel: 'Creación de Premios',
      },
      { id: 'canjes', label: 'Tracking', detailLabel: 'Tracking' },
      {
        id: 'inventario',
        label: 'Entrega de premios',
        detailLabel: 'Entrega de premios',
      },
    ],
  },
  {
    id: 'analisis-modelado',
    label: 'Análisis y Modelado',
    features: [
      { id: 'reportes', label: 'Reportería', detailLabel: 'Reportería' },
      {
        id: 'tracking',
        label: 'Tracking de usuario',
        detailLabel: 'Tracking de usuario',
      },
    ],
  },
  {
    id: 'clientes',
    label: 'Clientes',
    features: [
      {
        id: 'tracking',
        label: 'Tracking de usuario',
        detailLabel: 'Tracking de usuario',
      },
    ],
  },
  {
    id: 'simulaciones',
    label: 'Simulaciones',
    features: [
      { id: 'ab-testing', label: 'A/B Testing', detailLabel: 'A/B Testing' },
      {
        id: 'ab-testing-b',
        label: 'A/B Testing',
        detailLabel: 'A/B Testing',
      },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    features: [],
  },
  {
    id: 'administracion',
    label: 'Administración',
    features: [
      {
        id: 'usuarios',
        label: 'Gestión de usuario',
        detailLabel: 'Gestión de usuario',
      },
      {
        id: 'roles',
        label: 'Gestión de roles',
        detailLabel: 'Gestión de roles',
      },
    ],
  },
  {
    id: 'logs-monitoreo',
    label: 'Logs y Monitoreo',
    badgeLabel: 'Monitoreo',
    features: [],
  },
];
