export type UiKitSubsection = {
  id: string;
  label: string;
};

export type UiKitCategory = {
  id: string;
  label: string;
  icon: string;
  description: string;
  subsections: readonly UiKitSubsection[];
};

export const UI_KIT_CATEGORIES = [
  {
    id: 'acciones',
    label: 'Acciones',
    icon: 'pi-bolt',
    description: 'Botones, severidades y variantes de acción.',
    subsections: [{ id: 'botones', label: 'Botones' }],
  },
  {
    id: 'formularios',
    label: 'Formularios',
    icon: 'pi-pencil',
    description: 'Inputs, labels y controles de selección.',
    subsections: [
      { id: 'formularios', label: 'Básicos' },
      { id: 'faltantes-inputs', label: 'Inputs extra' },
      { id: 'faltantes-seleccion', label: 'Selección' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: 'pi-info-circle',
    description: 'Tags, mensajes, progreso y estados de carga.',
    subsections: [
      { id: 'tags', label: 'Tags y badges' },
      { id: 'mensajes', label: 'Mensajes' },
      { id: 'feedback', label: 'Carga' },
    ],
  },
  {
    id: 'datos',
    label: 'Datos',
    icon: 'pi-table',
    description: 'Tablas, cards y vistas de datos avanzadas.',
    subsections: [
      { id: 'datos', label: 'Básicos' },
      { id: 'faltantes-data-tablas', label: 'Tablas' },
      { id: 'faltantes-data-tree', label: 'Tree' },
      { id: 'faltantes-data-org', label: 'Org chart' },
      { id: 'faltantes-data-upload', label: 'Upload' },
    ],
  },
  {
    id: 'navegacion',
    label: 'Navegación',
    icon: 'pi-sitemap',
    description: 'Tabs, menús, breadcrumbs y toolbars.',
    subsections: [
      { id: 'navegacion', label: 'Tabs' },
      { id: 'faltantes-nav', label: 'Menús' },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    icon: 'pi-image',
    description: 'Avatares, chips, galerías y carruseles.',
    subsections: [
      { id: 'media', label: 'Avatar y chips' },
      { id: 'faltantes-media2', label: 'Avanzada' },
    ],
  },
  {
    id: 'overlays',
    label: 'Overlays',
    icon: 'pi-window-maximize',
    description: 'Dialogs, drawers, toasts y tooltips.',
    subsections: [
      { id: 'overlays', label: 'Dialog' },
      { id: 'faltantes-overlays2', label: 'Extra' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    icon: 'pi-th-large',
    description: 'Paneles, splitters y utilidades de composición.',
    subsections: [
      { id: 'faltantes-layout', label: 'Paneles' },
      { id: 'faltantes-misc', label: 'Utilidades' },
    ],
  },
  {
    id: 'patrones',
    label: 'Patrones',
    icon: 'pi-box',
    description: 'Bloques reutilizados en el backoffice.',
    subsections: [{ id: 'patrones', label: 'Producto' }],
  },
] as const satisfies readonly UiKitCategory[];

export type UiKitCategoryId = (typeof UI_KIT_CATEGORIES)[number]['id'];

export const EXTRA_SECTION_IDS = [
  'faltantes-inputs',
  'faltantes-seleccion',
  'faltantes-layout',
  'faltantes-nav',
  'faltantes-overlays2',
  'faltantes-data-tablas',
  'faltantes-data-tree',
  'faltantes-data-org',
  'faltantes-data-upload',
  'faltantes-media2',
  'faltantes-misc',
] as const;

export type UiKitExtraSectionId = (typeof EXTRA_SECTION_IDS)[number];

export function isExtraSectionId(id: string): id is UiKitExtraSectionId {
  return (EXTRA_SECTION_IDS as readonly string[]).includes(id);
}
