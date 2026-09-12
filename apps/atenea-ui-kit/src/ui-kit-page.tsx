import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Button } from '@primereact/ui/button';
import { InputText } from '@primereact/ui/inputtext';
import { Textarea } from '@primereact/ui/textarea';
import { Tag } from '@primereact/ui/tag';
import { Badge } from '@primereact/ui/badge';
import { Skeleton } from '@primereact/ui/skeleton';
import { Divider } from '@primereact/ui/divider';
import { Message } from '@primereact/ui/message';
import { ProgressBar } from '@primereact/ui/progressbar';
import { ProgressSpinner } from '@primereact/ui/progressspinner';
import { Chip } from '@primereact/ui/chip';
import { Avatar } from '@primereact/ui/avatar';
import { Card } from '@primereact/ui/card';
import { Dialog } from '@primereact/ui/dialog';
import { Tabs } from '@primereact/ui/tabs';
import { ToggleSwitch } from '@primereact/ui/toggleswitch';
import { Checkbox } from '@primereact/ui/checkbox';
import { FloatInput } from '@gamification/shared-ui/components/float-input';
import { ModulePage } from '@gamification/shared-ui/components/module-page';
import { buildDicebearAvatarUrl } from '@gamification/shared-utils/utils/dicebear-avatar';
import { UI_KIT_CATEGORIES, isExtraSectionId } from './ui-kit-categories';
import { UiKitCategoryPanel } from './ui-kit-category-panel';
import { UiKitMissingSections } from './ui-kit-missing-sections';
import { cn } from '@gamification/shared-utils/utils/cn';
import { Field, Section, SubTitle } from './ui-kit-primitives';

function inputClass(hasError: boolean) {
  return cn(
    'h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-800 outline-none',
    hasError ? 'border-red-400' : 'border-slate-200 focus:border-slate-400',
  );
}

const DEMO_ICONS = [
  'pi-home',
  'pi-users',
  'pi-shield',
  'pi-bell',
  'pi-cog',
  'pi-trophy',
  'pi-image',
  'pi-list',
  'pi-sync',
  'pi-search',
  'pi-plus',
  'pi-trash',
  'pi-pencil',
  'pi-check',
  'pi-times',
  'pi-arrow-right',
  'pi-sign-out',
  'pi-camera',
  'pi-save',
  'pi-refresh',
  'pi-filter',
  'pi-download',
  'pi-upload',
  'pi-eye',
  'pi-copy',
] as const;

export function UiKitPage() {
  const [nativeChecked, setNativeChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  const [checkboxOn, setCheckboxOn] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('Eduardo Escudero');
  const [notes, setNotes] = useState('Notas de ejemplo para el catálogo.');
  const [demoTab, setDemoTab] = useState('resumen');
  const [category, setCategory] = useState<string>(UI_KIT_CATEGORIES[0].id);

  const renderSection = (sectionId: string) => {
    if (isExtraSectionId(sectionId)) {
      return <UiKitMissingSections sectionId={sectionId} />;
    }

    switch (sectionId) {
      case 'botones':
        return (
          <Section
            id="botones"
            title="Botones"
            description="Severidades, variantes, tamaños e iconos."
          >
            <SubTitle>Severidades</SubTitle>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button severity="secondary">Secondary</Button>
              <Button severity="success">Success</Button>
              <Button severity="info">Info</Button>
              <Button severity="warn">Warn</Button>
              <Button severity="danger">Danger</Button>
              <Button severity="contrast">Contrast</Button>
              <Button disabled>Disabled</Button>
            </div>

            <SubTitle>Variantes</SubTitle>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Button>
                <i className="pi pi-plus mr-2" />
                Solid
              </Button>
              <Button severity="secondary" variant="outlined">
                Outlined
              </Button>
              <Button severity="secondary" variant="text">
                Text
              </Button>
              <Button severity="danger" variant="outlined">
                <i className="pi pi-trash mr-2" />
                Danger outlined
              </Button>
              <Button raised>Raised</Button>
              <Button rounded>Rounded</Button>
            </div>

            <SubTitle>Tamaños e icon-only</SubTitle>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="small">Small</Button>
              <Button>Normal</Button>
              <Button size="large">Large</Button>
              <Button iconOnly aria-label="Configuración">
                <i className="pi pi-cog" />
              </Button>
              <Button
                severity="secondary"
                variant="outlined"
                iconOnly
                aria-label="Buscar"
              >
                <i className="pi pi-search" />
              </Button>
              <Button
                severity="danger"
                variant="text"
                iconOnly
                aria-label="Borrar"
              >
                <i className="pi pi-times" />
              </Button>
            </div>
          </Section>
        );

      case 'formularios':
        return (
          <Section
            id="formularios"
            title="Formularios"
            description="Inputs PrimeReact y campos nativos del producto."
          >
            <SubTitle>PrimeReact InputText / Textarea</SubTitle>
            <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Nombre (InputText)"
                control={
                  <InputText
                    value={name}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setName(event.target.value)
                    }
                    placeholder="Nombre completo"
                    className="w-full"
                  />
                }
              />
              <Field
                label="Correo (InputText)"
                control={
                  <InputText
                    type="email"
                    defaultValue="demo@apuestatotal.com"
                    placeholder="correo@apuestatotal.com"
                    className="w-full"
                  />
                }
              />
              <Field
                label="Notas (Textarea)"
                control={
                  <Textarea
                    value={notes}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                      setNotes(event.target.value)
                    }
                    rows={3}
                    className="w-full"
                  />
                }
              />
              <div className="space-y-3 self-end pb-1">
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <Checkbox.Root
                    checked={checkboxOn}
                    onCheckedChange={(event: { checked: boolean }) =>
                      setCheckboxOn(event.checked)
                    }
                  >
                    <Checkbox.Box>
                      <Checkbox.Indicator />
                    </Checkbox.Box>
                  </Checkbox.Root>
                  Acepto términos (Checkbox)
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <ToggleSwitch.Root
                    checked={switchOn}
                    onCheckedChange={(event: { checked: boolean }) =>
                      setSwitchOn(event.checked)
                    }
                  >
                    <ToggleSwitch.Control>
                      <ToggleSwitch.Handle />
                    </ToggleSwitch.Control>
                  </ToggleSwitch.Root>
                  Notificaciones activas (ToggleSwitch)
                </label>
              </div>
            </div>

            <SubTitle>Campos nativos del producto</SubTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Select nativo"
                control={
                  <select className={inputClass(false)} defaultValue="Admin">
                    <option>Super Admin</option>
                    <option>Admin</option>
                    <option>Viewer</option>
                  </select>
                }
              />
              <Field
                label="Con error"
                error="Campo requerido"
                control={
                  <input className={inputClass(true)} placeholder="Inválido" />
                }
              />
              <label className="flex items-center gap-2 self-end pb-1 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={nativeChecked}
                  onChange={(event) => setNativeChecked(event.target.checked)}
                  className="h-4 w-4 accent-slate-800"
                />
                Checkbox nativo
              </label>
            </div>

            <SubTitle>FloatInput (shared)</SubTitle>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FloatInput label="Nombre" />
              <FloatInput
                label="Correo"
                type="email"
                icon="pi-user"
                defaultValue="pilar.milla@apuestatotal.com"
              />
              <FloatInput label="Contraseña" type="password" icon="pi-key" />
              <FloatInput
                label="Buscar"
                icon="pi-search"
                hint="El label flota al foco o al escribir"
              />
              <FloatInput
                label="Campo inválido"
                invalid
                error="Campo requerido"
              />
              <FloatInput
                label="Deshabilitado"
                disabled
                defaultValue="No editable"
              />
            </div>
          </Section>
        );

      case 'tags':
        return (
          <Section
            id="tags"
            title="Tags y badges"
            description="Etiquetas de estado y contadores."
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Tag>Default</Tag>
              <Tag severity="success">Success</Tag>
              <Tag severity="info">Info</Tag>
              <Tag severity="warn">Warn</Tag>
              <Tag severity="danger">Danger</Tag>
              <Tag severity="secondary">Secondary</Tag>
              <Tag severity="contrast" rounded>
                Contrast
              </Tag>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative inline-flex">
                <Button severity="secondary" variant="outlined">
                  <i className="pi pi-bell mr-2" />
                  Notificaciones
                </Button>
                <Badge
                  value="4"
                  severity="danger"
                  className="absolute -top-2 -right-2"
                />
              </div>
              <Badge value="12" />
              <Badge value="OK" severity="success" />
              <Badge value="!" severity="warn" />
            </div>
          </Section>
        );

      case 'mensajes':
        return (
          <Section
            id="mensajes"
            title="Mensajes"
            description="Alertas inline por severidad."
          >
            <div className="space-y-3">
              {(
                [
                  ['success', 'Cambios guardados correctamente.'],
                  ['info', 'Hay una nueva versión disponible.'],
                  ['warn', 'La sesión expira en 5 minutos.'],
                  ['error', 'No se pudo completar la operación.'],
                ] as const
              ).map(([severity, text]) => (
                <Message.Root
                  key={severity}
                  severity={severity}
                  className="w-full"
                >
                  <Message.Content>
                    <Message.Icon />
                    <Message.Text>{text}</Message.Text>
                  </Message.Content>
                </Message.Root>
              ))}
            </div>
          </Section>
        );

      case 'feedback':
        return (
          <Section
            id="feedback"
            title="Feedback y carga"
            description="Progress, skeleton y spinners."
          >
            <div className="mb-5 space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium text-slate-500">
                  ProgressBar 65%
                </p>
                <ProgressBar.Root value={65} className="w-full">
                  <ProgressBar.Track>
                    <ProgressBar.Value />
                  </ProgressBar.Track>
                  <ProgressBar.Label />
                </ProgressBar.Root>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-slate-500">
                  ProgressBar 30%
                </p>
                <ProgressBar.Root value={30} className="w-full">
                  <ProgressBar.Track>
                    <ProgressBar.Value />
                  </ProgressBar.Track>
                </ProgressBar.Root>
              </div>
            </div>

            <div className="mb-5 flex items-center gap-6">
              <ProgressSpinner.Root>
                <ProgressSpinner.Track />
                <ProgressSpinner.Value />
              </ProgressSpinner.Root>
              <span className="text-sm text-slate-500">ProgressSpinner</span>
            </div>

            <SubTitle>Skeleton</SubTitle>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Skeleton width="100%" height="2.5rem" />
              <Skeleton width="100%" height="2.5rem" />
              <Skeleton width="100%" height="6rem" borderRadius="12px" />
            </div>
          </Section>
        );

      case 'datos':
        return (
          <Section
            id="datos"
            title="Datos"
            description="Tablas, cards y divisores."
          >
            <SubTitle>Tabla de listado</SubTitle>
            <div className="mb-5 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Correo</th>
                    <th className="px-4 py-3 font-semibold">Rol</th>
                    <th className="px-4 py-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'Eduardo Escudero',
                      'eduardo@apuestatotal.com',
                      'Super Admin',
                    ],
                    ['Pilar Milla', 'pilar@apuestatotal.com', 'Admin'],
                    ['Operador Demo', 'operador@apuestatotal.com', 'Operator'],
                  ].map(([rowName, email, role], index) => (
                    <tr
                      key={rowName}
                      className={
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                      }
                    >
                      <td className="px-4 py-3 text-slate-800">{rowName}</td>
                      <td className="px-4 py-3 text-slate-600">{email}</td>
                      <td className="px-4 py-3">
                        <Tag severity="secondary">{role}</Tag>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            severity="secondary"
                            variant="text"
                            iconOnly
                            aria-label="Editar"
                          >
                            <i className="pi pi-pencil text-sm" />
                          </Button>
                          <Button
                            severity="danger"
                            variant="text"
                            iconOnly
                            aria-label="Eliminar"
                          >
                            <i className="pi pi-trash text-sm" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <SubTitle>Cards</SubTitle>
            <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card.Root>
                <Card.Header>
                  <Card.Title>Campaña semanal</Card.Title>
                  <Card.Subtitle>Premios activos</Card.Subtitle>
                </Card.Header>
                <Card.Body>
                  <Card.Content>
                    Resumen de la campaña con métricas y estado de publicación.
                  </Card.Content>
                </Card.Body>
                <Card.Footer>
                  <Button size="small">Ver detalle</Button>
                </Card.Footer>
              </Card.Root>
              <Card.Root>
                <Card.Header>
                  <Card.Title>Usuarios online</Card.Title>
                  <Card.Subtitle>Última hora</Card.Subtitle>
                </Card.Header>
                <Card.Body>
                  <Card.Content>
                    <p className="text-3xl font-semibold text-slate-800">128</p>
                    <p className="mt-1 text-sm text-slate-500">+12% vs ayer</p>
                  </Card.Content>
                </Card.Body>
              </Card.Root>
            </div>

            <SubTitle>Divider</SubTitle>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-600">Contenido superior</p>
              <Divider />
              <p className="text-sm text-slate-600">Contenido inferior</p>
            </div>
          </Section>
        );

      case 'navegacion':
        return (
          <Section
            id="navegacion"
            title="Navegación"
            description="Tabs y breadcrumbs de referencia."
          >
            <SubTitle>Tabs</SubTitle>
            <Tabs.Root
              value={demoTab}
              onValueChange={(event: { value?: string | number }) =>
                setDemoTab(String(event.value ?? 'resumen'))
              }
              className="mb-5"
            >
              <Tabs.List>
                <Tabs.Tab value="resumen">Resumen</Tabs.Tab>
                <Tabs.Tab value="detalle">Detalle</Tabs.Tab>
                <Tabs.Tab value="historial">Historial</Tabs.Tab>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Panels className="mt-4">
                <Tabs.Panel value="resumen">
                  <p className="text-sm text-slate-600">
                    Vista resumen del módulo seleccionado.
                  </p>
                </Tabs.Panel>
                <Tabs.Panel value="detalle">
                  <p className="text-sm text-slate-600">
                    Detalle extendido con campos y acciones.
                  </p>
                </Tabs.Panel>
                <Tabs.Panel value="historial">
                  <p className="text-sm text-slate-600">
                    Historial de cambios y auditoría.
                  </p>
                </Tabs.Panel>
              </Tabs.Panels>
            </Tabs.Root>

            <SubTitle>Breadcrumb (patrón shell)</SubTitle>
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <span className="hover:text-slate-800">Inicio</span>
              <span>/</span>
              <span className="hover:text-slate-800">Administración</span>
              <span>/</span>
              <span className="font-medium text-slate-800">Usuarios</span>
            </nav>
          </Section>
        );

      case 'media':
        return (
          <Section
            id="media"
            title="Avatar y chips"
            description="Identidad de usuario y etiquetas removibles."
          >
            <SubTitle>Avatar PrimeReact</SubTitle>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Avatar.Root>
                <Avatar.Fallback>EE</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Root>
                <Avatar.Fallback>PM</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Root shape="circle">
                <Avatar.Image
                  src={buildDicebearAvatarUrl('Eduardo Escudero')}
                />
                <Avatar.Fallback>EE</Avatar.Fallback>
              </Avatar.Root>
            </div>

            <SubTitle>DiceBear (producto)</SubTitle>
            <div className="mb-5 flex flex-wrap items-center gap-4">
              {['Eduardo Escudero', 'Pilar Milla', 'Operador Demo'].map(
                (person) => (
                  <div key={person} className="flex items-center gap-3">
                    <img
                      src={buildDicebearAvatarUrl(person)}
                      alt={person}
                      className="h-14 w-14 rounded-2xl border border-slate-200 bg-slate-950"
                    />
                    <span className="text-sm text-slate-700">{person}</span>
                  </div>
                ),
              )}
            </div>

            <SubTitle>Chips</SubTitle>
            <div className="flex flex-wrap gap-2">
              <Chip.Root>
                <Chip.Label>Gamificación</Chip.Label>
              </Chip.Root>
              <Chip.Root>
                <Chip.Label>Premios</Chip.Label>
                <Chip.Remove aria-label="Quitar">
                  <i className="pi pi-times text-xs" />
                </Chip.Remove>
              </Chip.Root>
              <Chip.Root>
                <Chip.Start>
                  <i className="pi pi-user text-xs" />
                </Chip.Start>
                <Chip.Label>Operador</Chip.Label>
              </Chip.Root>
            </div>
          </Section>
        );

      case 'overlays':
        return (
          <Section
            id="overlays"
            title="Overlays"
            description="Dialogs y confirmaciones."
          >
            <Button onClick={() => setDialogOpen(true)}>
              <i className="pi pi-external-link mr-2" />
              Abrir dialog
            </Button>

            <Dialog.Root
              open={dialogOpen}
              onOpenChange={(event: { value?: boolean }) =>
                setDialogOpen(Boolean(event.value))
              }
            >
              <Dialog.Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Popup className="w-full max-w-md">
                    <Dialog.Header>
                      <Dialog.Title>Confirmar acción</Dialog.Title>
                      <Dialog.HeaderActions>
                        <Dialog.Close aria-label="Cerrar">
                          <i className="pi pi-times" />
                        </Dialog.Close>
                      </Dialog.HeaderActions>
                    </Dialog.Header>
                    <Dialog.Content>
                      ¿Seguro que deseas continuar con esta operación de
                      ejemplo?
                    </Dialog.Content>
                    <Dialog.Footer>
                      <Button
                        severity="secondary"
                        variant="outlined"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={() => setDialogOpen(false)}>
                        Confirmar
                      </Button>
                    </Dialog.Footer>
                  </Dialog.Popup>
                </Dialog.Positioner>
              </Dialog.Portal>
            </Dialog.Root>
          </Section>
        );

      case 'patrones':
        return (
          <Section
            id="patrones"
            title="Patrones del producto"
            description="Bloques reutilizados en features actuales."
          >
            <SubTitle>ModulePage</SubTitle>
            <div className="mb-5">
              <ModulePage
                title="Ejemplo de módulo"
                description="Usar ModulePage mientras el feature no tiene UI propia."
              />
            </div>

            <SubTitle>Estado vacío</SubTitle>
            <div className="mb-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
              <i className="pi pi-inbox text-3xl text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-600">
                Sin resultados
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Aquí aparecerán los registros cuando existan.
              </p>
              <Button className="mt-4" size="small">
                <i className="pi pi-plus mr-2" />
                Crear primero
              </Button>
            </div>

            <SubTitle>Ítem de notificación</SubTitle>
            <ul className="mb-5 overflow-hidden rounded-xl border border-slate-200">
              <li className="flex flex-col gap-3 bg-sky-50/60 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Notificación de ejemplo
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Mensaje corto con acción opcional.
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    22 jul 2026, 18:30
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button severity="secondary" variant="outlined">
                    <i className="pi pi-arrow-right mr-2" />
                    Ir
                  </Button>
                  <Button
                    severity="danger"
                    variant="text"
                    iconOnly
                    aria-label="Eliminar"
                  >
                    <i className="pi pi-times text-sm" />
                  </Button>
                </div>
              </li>
            </ul>

            <SubTitle>Métricas</SubTitle>
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: 'Modo', value: 'Desarrollo', icon: 'pi-server' },
                { label: 'API', value: '/api', icon: 'pi-link' },
                { label: 'Mocks', value: 'Activos', icon: 'pi-box' },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-slate-500">
                    <i className={`pi ${card.icon} text-sm`} />
                    <span className="text-xs font-medium tracking-wide uppercase">
                      {card.label}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold text-slate-800">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            <SubTitle>Iconos frecuentes</SubTitle>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-10">
              {DEMO_ICONS.map((icon) => (
                <div
                  key={icon}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-2 py-3"
                >
                  <i className={`pi ${icon} text-lg text-slate-700`} />
                  <span className="truncate text-[10px] text-slate-500">
                    {icon}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Catálogo de componentes
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Referencia de PrimeReact (`@primereact/ui`) organizada por
              categoría. Usa las pestañas para explorar demos al construir
              features.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {UI_KIT_CATEGORIES.length} categorías
          </span>
        </div>
      </section>

      <Tabs.Root
        value={category}
        onValueChange={(event: { value?: string | number }) =>
          setCategory(String(event.value ?? UI_KIT_CATEGORIES[0].id))
        }
        lazy
        className="flex flex-col gap-4"
      >
        <div className="sticky top-0 z-10 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur">
          <Tabs.List className="flex gap-1 overflow-x-auto pb-1">
            {UI_KIT_CATEGORIES.map((item) => (
              <Tabs.Tab
                key={item.id}
                value={item.id}
                className="shrink-0 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-2">
                  <i className={`pi ${item.icon} text-xs`} />
                  {item.label}
                </span>
              </Tabs.Tab>
            ))}
            <Tabs.Indicator />
          </Tabs.List>
        </div>

        <Tabs.Panels>
          {UI_KIT_CATEGORIES.map((item) => (
            <Tabs.Panel key={item.id} value={item.id}>
              <UiKitCategoryPanel category={item}>
                {(subsectionId) => renderSection(subsectionId)}
              </UiKitCategoryPanel>
            </Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs.Root>
    </div>
  );
}
