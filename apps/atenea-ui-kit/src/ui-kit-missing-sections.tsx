/* eslint-disable @typescript-eslint/no-explicit-any -- demos de APIs compound de PrimeReact 11 */
import { useState } from 'react';
import { Button } from '@primereact/ui/button';
import { ButtonGroup } from '@primereact/ui/buttongroup';
import { InputText } from '@primereact/ui/inputtext';
import { InputPassword } from '@primereact/ui/inputpassword';
import { FloatLabel } from '@primereact/ui/floatlabel';
import { IftaLabel } from '@primereact/ui/iftalabel';
import { Label } from '@primereact/ui/label';
import { Avatar } from '@primereact/ui/avatar';
import { AvatarGroup } from '@primereact/ui/avatargroup';
import { Badge } from '@primereact/ui/badge';
import { OverlayBadge } from '@primereact/ui/overlaybadge';
import { RadioButton } from '@primereact/ui/radiobutton';
import { RadioButtonGroup } from '@primereact/ui/radiobuttongroup';
import { Checkbox } from '@primereact/ui/checkbox';
import { CheckboxGroup } from '@primereact/ui/checkboxgroup';
import { ToggleButton } from '@primereact/ui/togglebutton';
import { ToggleButtonGroup } from '@primereact/ui/togglebuttongroup';
import { Accordion } from '@primereact/ui/accordion';
import { Panel } from '@primereact/ui/panel';
import { Fieldset } from '@primereact/ui/fieldset';
import { Collapsible } from '@primereact/ui/collapsible';
import { Select } from '@primereact/ui/select';
import { Listbox } from '@primereact/ui/listbox';
import { AutoComplete } from '@primereact/ui/autocomplete';
import { InputNumber } from '@primereact/ui/inputnumber';
import { InputOtp } from '@primereact/ui/inputotp';
import { InputGroup } from '@primereact/ui/inputgroup';
import { InputTags } from '@primereact/ui/inputtags';
import { Chip } from '@primereact/ui/chip';
import { InputColor, parseColor } from '@primereact/ui/inputcolor';
import type { ColorInstance } from '@primereact/types/headless/inputcolor';
import { IconField } from '@primereact/ui/iconfield';
import { DatePicker } from '@primereact/ui/datepicker';
import { Slider } from '@primereact/ui/slider';
import { Rating } from '@primereact/ui/rating';
import { Knob } from '@primereact/ui/knob';
import { MeterGroup } from '@primereact/ui/metergroup';
import { Breadcrumb } from '@primereact/ui/breadcrumb';
import { Menu } from '@primereact/ui/menu';
import { ContextMenu } from '@primereact/ui/contextmenu';
import { Toolbar } from '@primereact/ui/toolbar';
import { Popover } from '@primereact/ui/popover';
import { Tooltip } from '@primereact/ui/tooltip';
import { Drawer } from '@primereact/ui/drawer';
import { Toast } from '@primereact/ui/toast';
import { Toaster, toast } from '@primereact/ui/toaster';
import { Paginator } from '@primereact/ui/paginator';
import { DataTable } from '@primereact/ui/datatable';
import { DataView } from '@primereact/ui/dataview';
import { Timeline } from '@primereact/ui/timeline';
import { Stepper } from '@primereact/ui/stepper';
import { Splitter } from '@primereact/ui/splitter';
import { ScrollArea } from '@primereact/ui/scrollarea';
import { Carousel } from '@primereact/ui/carousel';
import { SpeedDial } from '@primereact/ui/speeddial';
import { FileUpload } from '@primereact/ui/fileupload';
import { Inplace } from '@primereact/ui/inplace';
import { Terminal } from '@primereact/ui/terminal';
import { Gallery } from '@primereact/ui/gallery';
import { Sidebar } from '@primereact/ui/sidebar';
import { Compare } from '@primereact/ui/compare';
import { NavigationMenu } from '@primereact/ui/navigationmenu';
import { AnimateOnScroll } from '@primereact/ui/animateonscroll';
import { Fluid } from '@primereact/ui/fluid';
import { FocusTrap } from '@primereact/ui/focustrap';
import { buildDicebearAvatarUrl } from '@gamification/shared-utils/utils/dicebear-avatar';
import { Demo, Section } from './ui-kit-primitives';
import type { UiKitExtraSectionId } from './ui-kit-categories';
import { UiKitTreeSection } from './ui-kit-tree-section';
import { UiKitOrgChartSection } from './ui-kit-org-chart-section';

const CITIES = ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Piura'];

const TABLE_ROWS = [
  { id: 1, name: 'Eduardo', role: 'Super Admin' },
  { id: 2, name: 'Pilar', role: 'Admin' },
  { id: 3, name: 'Operador', role: 'Operator' },
];

export function UiKitMissingSections({
  sectionId,
}: {
  sectionId: UiKitExtraSectionId;
}) {
  const [radio, setRadio] = useState('a');
  const [checks, setChecks] = useState<string[]>(['x']);
  const [toggleGroup, setToggleGroup] = useState('dia');
  const [toggleBtn, setToggleBtn] = useState(false);
  const [selectValue, setSelectValue] = useState<string | undefined>('Lima');
  const [listValue, setListValue] = useState<string | undefined>('Cusco');
  const [autoValue, setAutoValue] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([...CITIES]);
  const [numberValue, setNumberValue] = useState<number | null>(10);
  const [otp, setOtp] = useState('');
  const [tags, setTags] = useState<string[]>(['Premios', 'Campaign']);
  const [color, setColor] = useState<ColorInstance>(() =>
    parseColor('#334155'),
  );
  const [slider, setSlider] = useState(40);
  const [rating, setRating] = useState(3);
  const [knob, setKnob] = useState(55);
  const [page, setPage] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState('1');
  const [password, setPassword] = useState('secret');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const searchCities = (event: { query?: string }) => {
    const query = (event.query ?? '').trim().toLowerCase();
    setFilteredCities(
      query
        ? CITIES.filter((city) => city.toLowerCase().includes(query))
        : [...CITIES],
    );
  };

  if (sectionId === 'faltantes-inputs') {
    return (
      <Section
        id="faltantes-inputs"
        title="Inputs extra"
        description="Password, labels, number, otp, tags, color, iconfield, group."
      >
        <Demo name="FloatLabel">
          <FloatLabel>
            <InputText id="float-name" />
            <label htmlFor="float-name">Nombre</label>
          </FloatLabel>
        </Demo>

        <Demo name="IftaLabel">
          <IftaLabel>
            <label htmlFor="ifta-mail">Correo</label>
            <InputText id="ifta-mail" />
          </IftaLabel>
        </Demo>

        <Demo name="Label">
          <div className="flex flex-col gap-1">
            <Label htmlFor="plain-label">Etiqueta</Label>
            <InputText id="plain-label" />
          </div>
        </Demo>

        <Demo name="InputPassword">
          <InputPassword
            value={password}
            onChange={(event: any) => setPassword(event.target.value)}
            feedback={false}
            toggleMask
          />
        </Demo>

        <Demo name="IconField">
          <IconField.Root>
            <IconField.Inset>
              <i className="pi pi-search" />
            </IconField.Inset>
            <InputText placeholder="Buscar…" />
          </IconField.Root>
        </Demo>

        <Demo name="InputGroup">
          <InputGroup.Root>
            <InputGroup.Addon>@</InputGroup.Addon>
            <InputText placeholder="usuario" />
            <InputGroup.Addon>.com</InputGroup.Addon>
          </InputGroup.Root>
        </Demo>

        <Demo name="InputNumber">
          <InputNumber.Root
            value={numberValue}
            onValueChange={(event: any) => setNumberValue(event.value ?? null)}
          >
            <InputNumber.Group>
              <InputNumber.Decrement>-</InputNumber.Decrement>
              <InputNumber.Input as={InputText} />
              <InputNumber.Increment>+</InputNumber.Increment>
            </InputNumber.Group>
          </InputNumber.Root>
        </Demo>

        <Demo name="InputOtp">
          <InputOtp.Root
            value={otp}
            onValueChange={(event: any) => setOtp(String(event.value ?? ''))}
            length={4}
          >
            <InputOtp.Text />
          </InputOtp.Root>
        </Demo>

        <Demo name="InputTags">
          <InputTags.Root
            value={tags}
            onValueChange={(event: any) => setTags(event.value ?? [])}
          >
            <InputTags.Control>
              {({ controlProps }: any) => (
                <div className="flex min-h-11 w-full max-w-md flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <InputTags.Items>
                    {({ item, remove }: any) => (
                      <Chip.Root className="rounded-lg!" onRemove={remove}>
                        <Chip.Label>{item}</Chip.Label>
                        <Chip.Remove aria-label={`Quitar ${item}`}>
                          <i className="pi pi-times text-[10px]" />
                        </Chip.Remove>
                      </Chip.Root>
                    )}
                  </InputTags.Items>
                  <input
                    {...controlProps}
                    className="min-w-24 flex-1 bg-transparent text-sm outline-none"
                    placeholder="Agregar tag"
                  />
                </div>
              )}
            </InputTags.Control>
          </InputTags.Root>
        </Demo>

        <Demo name="InputColor">
          <div className="flex flex-col gap-3">
            <InputColor.Root
              value={color}
              onValueChange={(event: any) => {
                if (event.value) {
                  setColor(event.value);
                }
              }}
              className="flex w-full max-w-sm flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3"
            >
              <InputColor.Area className="relative h-36 w-full overflow-hidden rounded-lg">
                <InputColor.AreaBackground className="absolute inset-0" />
                <InputColor.AreaHandle className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow" />
              </InputColor.Area>

              <InputColor.Slider
                channel="hue"
                className="relative h-3 w-full rounded-full"
              >
                <InputColor.SliderTrack className="absolute inset-0 rounded-full" />
                <InputColor.SliderHandle className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow" />
              </InputColor.Slider>

              <div className="flex items-center gap-3">
                <InputColor.Swatch className="h-10 w-10 overflow-hidden rounded-lg border border-slate-200">
                  <InputColor.TransparencyGrid />
                  <InputColor.SwatchBackground className="h-full w-full" />
                </InputColor.Swatch>
                <InputColor.Input
                  channel="hex"
                  className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm"
                />
              </div>
            </InputColor.Root>

            <span className="text-sm text-slate-600">
              {color.toString('hex')}
            </span>
          </div>
        </Demo>

        <Demo name="Inplace">
          <Inplace.Root>
            <Inplace.Display>Clic para editar</Inplace.Display>
            <Inplace.Content>
              <InputText defaultValue="Valor editable" />
              <Inplace.Close>
                <i className="pi pi-times" />
              </Inplace.Close>
            </Inplace.Content>
          </Inplace.Root>
        </Demo>

        <Demo name="Fluid">
          <Fluid>
            <InputText placeholder="Ancho fluido" className="w-full" />
          </Fluid>
        </Demo>
      </Section>
    );
  }

  if (sectionId === 'faltantes-seleccion') {
    return (
      <Section
        id="faltantes-seleccion"
        title="Selección"
        description="Select, listbox, autocomplete, radios, toggles, rating, slider, knob."
      >
        <Demo name="Select">
          <Select.Root
            value={selectValue}
            onValueChange={(event: any) => setSelectValue(event.value)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Ciudad" />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner>
                <Select.Popup>
                  <Select.List>
                    {CITIES.map((city) => (
                      <Select.Option key={city} value={city}>
                        {city}
                        <Select.OptionIndicator />
                      </Select.Option>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </Demo>

        <Demo name="Listbox">
          <Listbox.Root
            value={listValue}
            onValueChange={(event: any) => setListValue(event.value)}
            className="w-full max-w-xs"
          >
            <Listbox.List>
              {CITIES.map((city) => (
                <Listbox.Option key={city} value={city}>
                  {city}
                  <Listbox.OptionIndicator />
                </Listbox.Option>
              ))}
            </Listbox.List>
          </Listbox.Root>
        </Demo>

        <Demo name="AutoComplete">
          <AutoComplete.Root
            value={autoValue}
            options={filteredCities}
            onValueChange={(event: any) =>
              setAutoValue(String(event.value ?? ''))
            }
            onComplete={searchCities}
            className="w-full max-w-xs"
          >
            <AutoComplete.Input
              as={InputText}
              placeholder="Buscar ciudad"
              className="w-full"
            />
            <AutoComplete.Portal>
              <AutoComplete.Positioner>
                <AutoComplete.Popup>
                  <AutoComplete.List>
                    {filteredCities.map((city, index) => (
                      <AutoComplete.Option
                        key={city}
                        value={city}
                        index={index}
                        uKey={city}
                      >
                        {city}
                      </AutoComplete.Option>
                    ))}
                    {filteredCities.length === 0 ? (
                      <AutoComplete.Empty>Sin resultados</AutoComplete.Empty>
                    ) : null}
                  </AutoComplete.List>
                </AutoComplete.Popup>
              </AutoComplete.Positioner>
            </AutoComplete.Portal>
          </AutoComplete.Root>
        </Demo>

        <Demo name="RadioButton + RadioButtonGroup">
          <RadioButtonGroup
            value={radio}
            onValueChange={(event: any) => setRadio(String(event.value ?? 'a'))}
            className="flex gap-4"
          >
            {['a', 'b', 'c'].map((value) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <RadioButton.Root value={value}>
                  <RadioButton.Box>
                    <RadioButton.Indicator />
                  </RadioButton.Box>
                </RadioButton.Root>
                Opción {value.toUpperCase()}
              </label>
            ))}
          </RadioButtonGroup>
        </Demo>

        <Demo name="CheckboxGroup">
          <CheckboxGroup
            value={checks}
            onValueChange={(event: any) => setChecks(event.value ?? [])}
            className="flex flex-col gap-2"
          >
            {['x', 'y', 'z'].map((value) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <Checkbox.Root value={value}>
                  <Checkbox.Box>
                    <Checkbox.Indicator />
                  </Checkbox.Box>
                </Checkbox.Root>
                Item {value}
              </label>
            ))}
          </CheckboxGroup>
        </Demo>

        <Demo name="ToggleButton">
          <ToggleButton.Root
            pressed={toggleBtn}
            onPressedChange={(event: any) =>
              setToggleBtn(Boolean(event.pressed))
            }
          >
            <ToggleButton.Indicator />
            {toggleBtn ? 'Activo' : 'Inactivo'}
          </ToggleButton.Root>
        </Demo>

        <Demo name="ToggleButtonGroup">
          <ToggleButtonGroup
            value={toggleGroup}
            onValueChange={(event: any) =>
              setToggleGroup(String(event.value ?? 'dia'))
            }
            className="flex gap-2"
          >
            {['dia', 'semana', 'mes'].map((value) => (
              <ToggleButton.Root key={value} value={value}>
                {value}
              </ToggleButton.Root>
            ))}
          </ToggleButtonGroup>
        </Demo>

        <Demo name="ButtonGroup">
          <ButtonGroup>
            <Button>
              <i className="pi pi-align-left mr-2" />
              Izquierda
            </Button>
            <Button severity="secondary">
              <i className="pi pi-align-center mr-2" />
              Centro
            </Button>
            <Button severity="secondary">
              <i className="pi pi-align-right mr-2" />
              Derecha
            </Button>
          </ButtonGroup>
        </Demo>

        <Demo name="Slider">
          <div className="flex w-full max-w-sm items-center gap-4">
            <Slider.Root
              value={slider}
              onValueChange={(event: any) => {
                const next = event.value;
                setSlider(Array.isArray(next) ? (next[0] ?? 0) : (next ?? 0));
              }}
              className="w-full"
            >
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Handle aria-label="Valor del slider" />
            </Slider.Root>
            <span className="w-8 shrink-0 text-sm font-semibold text-slate-700 tabular-nums">
              {slider}
            </span>
          </div>
        </Demo>

        <Demo name="Rating">
          <Rating.Root
            value={rating}
            onValueChange={(event: any) => setRating(event.value ?? 0)}
          >
            {[1, 2, 3, 4, 5].map((value, index) => (
              <Rating.Option key={value} value={value} index={index}>
                <Rating.On>
                  <i className="pi pi-star-fill" />
                </Rating.On>
                <Rating.Off>
                  <i className="pi pi-star" />
                </Rating.Off>
              </Rating.Option>
            ))}
          </Rating.Root>
        </Demo>

        <Demo name="Knob">
          <Knob.Root
            value={knob}
            onValueChange={(event: any) => setKnob(event.value ?? 0)}
          >
            <Knob.Range />
            <Knob.Value />
            <Knob.Text>{knob}</Knob.Text>
          </Knob.Root>
        </Demo>

        <Demo name="MeterGroup">
          <MeterGroup.Root aria-valuenow={70} className="w-full max-w-md">
            <MeterGroup.Meters>
              <MeterGroup.Meter value={45} color="#0f172a" />
              <MeterGroup.Meter value={25} color="#64748b" />
            </MeterGroup.Meters>
            <MeterGroup.Labels>
              <MeterGroup.Label>
                <MeterGroup.Marker color="#0f172a" />
                <MeterGroup.Text>Completado 45%</MeterGroup.Text>
              </MeterGroup.Label>
              <MeterGroup.Label>
                <MeterGroup.Marker color="#64748b" />
                <MeterGroup.Text>En progreso 25%</MeterGroup.Text>
              </MeterGroup.Label>
            </MeterGroup.Labels>
          </MeterGroup.Root>
        </Demo>

        <Demo name="DatePicker">
          <DatePicker.Root
            value={date}
            onValueChange={(event: any) => setDate(event.value)}
            className="w-full max-w-xs"
          >
            <DatePicker.Input
              as={InputText}
              placeholder="Fecha"
              className="w-full"
            />
            <DatePicker.Portal>
              <DatePicker.Positioner align="start">
                <DatePicker.Popup>
                  <DatePicker.Body>
                    <DatePicker.Panel>
                      <DatePicker.Calendar>
                        <DatePicker.Header>
                          <DatePicker.Prev
                            as={Button}
                            iconOnly
                            variant="text"
                            rounded
                            severity="secondary"
                            size="small"
                            aria-label="Mes anterior"
                          >
                            <i className="pi pi-chevron-left" />
                          </DatePicker.Prev>
                          <DatePicker.Title>
                            <DatePicker.SelectMonth />
                            <DatePicker.SelectYear />
                            <DatePicker.Decade />
                          </DatePicker.Title>
                          <DatePicker.Next
                            as={Button}
                            iconOnly
                            variant="text"
                            rounded
                            severity="secondary"
                            size="small"
                            aria-label="Mes siguiente"
                          >
                            <i className="pi pi-chevron-right" />
                          </DatePicker.Next>
                        </DatePicker.Header>
                        <DatePicker.Table>
                          <DatePicker.TableHead />
                          <DatePicker.TableBody />
                          <DatePicker.TableBody view="month" />
                          <DatePicker.TableBody view="year" />
                        </DatePicker.Table>
                      </DatePicker.Calendar>
                    </DatePicker.Panel>
                  </DatePicker.Body>
                </DatePicker.Popup>
              </DatePicker.Positioner>
            </DatePicker.Portal>
          </DatePicker.Root>
        </Demo>
      </Section>
    );
  }

  if (sectionId === 'faltantes-layout') {
    return (
      <Section
        id="faltantes-layout"
        title="Layout y paneles"
        description="Accordion, panel, fieldset, collapsible, splitter, scrollarea, stepper."
      >
        <Demo name="Accordion">
          <Accordion.Root className="w-full">
            <Accordion.Panel value="1">
              <Accordion.Header>
                <Accordion.Trigger>
                  Sección 1
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>Contenido del accordion #1.</Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel value="2">
              <Accordion.Header>
                <Accordion.Trigger>
                  Sección 2
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>Contenido del accordion #2.</Accordion.Content>
            </Accordion.Panel>
          </Accordion.Root>
        </Demo>

        <Demo name="Panel">
          <Panel.Root className="w-full">
            <Panel.Header>
              <Panel.Title>Panel de ejemplo</Panel.Title>
              <Panel.Trigger>
                <Panel.Indicator />
              </Panel.Trigger>
            </Panel.Header>
            <Panel.Content>Contenido colapsable del panel.</Panel.Content>
          </Panel.Root>
        </Demo>

        <Demo name="Fieldset">
          <Fieldset.Root className="w-full">
            <Fieldset.Legend>
              <Fieldset.Trigger>
                <Fieldset.Title>Datos generales</Fieldset.Title>
                <Fieldset.Indicator />
              </Fieldset.Trigger>
            </Fieldset.Legend>
            <Fieldset.Content>
              Grupo de campos dentro de un fieldset.
            </Fieldset.Content>
          </Fieldset.Root>
        </Demo>

        <Demo name="Collapsible">
          <Collapsible.Root className="w-full">
            <Collapsible.Trigger>
              <Button severity="secondary" variant="outlined">
                Toggle collapsible
              </Button>
            </Collapsible.Trigger>
            <Collapsible.Content className="mt-2 text-sm text-slate-600">
              Contenido revelado del collapsible.
            </Collapsible.Content>
          </Collapsible.Root>
        </Demo>

        <Demo name="Splitter">
          <Splitter.Root className="h-32 w-full rounded-xl border border-slate-200">
            <Splitter.Panel className="p-3 text-sm">Panel A</Splitter.Panel>
            <Splitter.Gutter>
              <Splitter.Handle />
            </Splitter.Gutter>
            <Splitter.Panel className="p-3 text-sm">Panel B</Splitter.Panel>
          </Splitter.Root>
        </Demo>

        <Demo name="ScrollArea">
          <ScrollArea.Root className="h-28 w-full max-w-sm rounded-xl border border-slate-200">
            <ScrollArea.Viewport>
              <ScrollArea.Content className="space-y-2 p-3 text-sm">
                {Array.from({ length: 12 }, (_, index) => (
                  <p key={index}>Línea de scroll #{index + 1}</p>
                ))}
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar>
              <ScrollArea.Handle />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Demo>

        <Demo name="Stepper">
          <Stepper.Root
            value={step}
            onValueChange={(event: any) => setStep(String(event.value ?? '1'))}
          >
            <Stepper.List>
              {['1', '2', '3'].map((value) => (
                <Stepper.Item key={value}>
                  <Stepper.Step value={value}>
                    <Stepper.Number />
                    <Stepper.Title>Paso {value}</Stepper.Title>
                  </Stepper.Step>
                  <Stepper.Separator />
                </Stepper.Item>
              ))}
            </Stepper.List>
            <Stepper.Panels className="mt-3 text-sm text-slate-600">
              <Stepper.Panel value="1">Contenido del paso 1</Stepper.Panel>
              <Stepper.Panel value="2">Contenido del paso 2</Stepper.Panel>
              <Stepper.Panel value="3">Contenido del paso 3</Stepper.Panel>
            </Stepper.Panels>
          </Stepper.Root>
        </Demo>
      </Section>
    );
  }

  if (sectionId === 'faltantes-nav') {
    return (
      <Section
        id="faltantes-nav"
        title="Menús y navegación"
        description="Breadcrumb, menu, context menu, toolbar, navigation menu, speed dial."
      >
        <Demo name="Breadcrumb">
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Inicio</Breadcrumb.Link>
                <Breadcrumb.Separator>/</Breadcrumb.Separator>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="#">Admin</Breadcrumb.Link>
                <Breadcrumb.Separator>/</Breadcrumb.Separator>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Breadcrumb.Current>Usuarios</Breadcrumb.Current>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </Demo>

        <Demo name="Menu">
          <Menu.Root>
            <Menu.Trigger>
              <Button severity="secondary" variant="outlined">
                Abrir menú
              </Button>
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner>
                <Menu.Popup>
                  <Menu.List>
                    <Menu.Item>Perfil</Menu.Item>
                    <Menu.Item>Configuración</Menu.Item>
                    <Menu.Separator />
                    <Menu.Item>Salir</Menu.Item>
                  </Menu.List>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </Demo>

        <Demo name="ContextMenu">
          <ContextMenu.Root>
            <ContextMenu.Trigger className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-sm text-slate-500">
              Clic derecho aquí
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
              <ContextMenu.Positioner>
                <ContextMenu.Popup>
                  <ContextMenu.List>
                    <ContextMenu.Item>Copiar</ContextMenu.Item>
                    <ContextMenu.Item>Pegar</ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Item>Eliminar</ContextMenu.Item>
                  </ContextMenu.List>
                </ContextMenu.Popup>
              </ContextMenu.Positioner>
            </ContextMenu.Portal>
          </ContextMenu.Root>
        </Demo>

        <Demo name="Toolbar">
          <Toolbar.Root className="w-full rounded-xl border border-slate-200 p-2">
            <Toolbar.Start>
              <Button size="small">Nuevo</Button>
            </Toolbar.Start>
            <Toolbar.Center>
              <span className="text-sm text-slate-500">Toolbar</span>
            </Toolbar.Center>
            <Toolbar.End>
              <Button size="small" severity="secondary" variant="outlined">
                Exportar
              </Button>
            </Toolbar.End>
          </Toolbar.Root>
        </Demo>

        <Demo name="NavigationMenu">
          <NavigationMenu
            model={[
              { label: 'Dashboard', icon: 'pi pi-home' },
              { label: 'Usuarios', icon: 'pi pi-users' },
              { label: 'Roles', icon: 'pi pi-shield' },
            ]}
          />
        </Demo>

        <Demo name="SpeedDial">
          <div className="relative h-28 w-full">
            <SpeedDial.Root>
              <SpeedDial.List>
                <SpeedDial.Item>
                  <SpeedDial.Action aria-label="Add">
                    <i className="pi pi-plus" />
                  </SpeedDial.Action>
                </SpeedDial.Item>
                <SpeedDial.Item>
                  <SpeedDial.Action aria-label="Search">
                    <i className="pi pi-search" />
                  </SpeedDial.Action>
                </SpeedDial.Item>
              </SpeedDial.List>
              <SpeedDial.Trigger>
                <i className="pi pi-bars" />
              </SpeedDial.Trigger>
            </SpeedDial.Root>
          </div>
        </Demo>
      </Section>
    );
  }

  if (sectionId === 'faltantes-overlays2') {
    return (
      <Section
        id="faltantes-overlays2"
        title="Overlays extra"
        description="Popover, tooltip, drawer, toast/toaster, sidebar, focus trap."
      >
        <Demo name="Popover">
          <Popover.Root>
            <Popover.Trigger>
              <Button severity="secondary" variant="outlined">
                Popover
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner>
                <Popover.Popup>
                  <Popover.Header>
                    <Popover.Title>Título</Popover.Title>
                    <Popover.Close>
                      <i className="pi pi-times" />
                    </Popover.Close>
                  </Popover.Header>
                  <Popover.Content>
                    <Popover.Description>
                      Contenido del popover.
                    </Popover.Description>
                  </Popover.Content>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
        </Demo>

        <Demo name="Tooltip">
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button severity="secondary" variant="text">
                Hover tooltip
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner>
                <Tooltip.Popup>
                  Texto de ayuda
                  <Tooltip.Arrow />
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Demo>

        <Demo name="Drawer">
          <Button onClick={() => setDrawerOpen(true)}>Abrir drawer</Button>
          <Drawer.Root
            open={drawerOpen}
            onOpenChange={(event: any) => setDrawerOpen(Boolean(event.value))}
          >
            <Drawer.Portal>
              <Drawer.Backdrop />
              <Drawer.Popup>
                <Drawer.Header>
                  <Drawer.Title>Drawer</Drawer.Title>
                  <Drawer.Close>
                    <i className="pi pi-times" />
                  </Drawer.Close>
                </Drawer.Header>
                <Drawer.Content>Panel lateral de ejemplo.</Drawer.Content>
                <Drawer.Footer>
                  <Button size="small" onClick={() => setDrawerOpen(false)}>
                    Cerrar
                  </Button>
                </Drawer.Footer>
              </Drawer.Popup>
            </Drawer.Portal>
          </Drawer.Root>
        </Demo>

        <Demo name="Toast + Toaster">
          <Toaster.Root position="top-right">
            <Toaster.Portal>
              <Toaster.Region />
            </Toaster.Portal>
          </Toaster.Root>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() =>
                toast.success({
                  title: 'Guardado',
                  description: 'Cambios aplicados correctamente.',
                })
              }
            >
              Success
            </Button>
            <Button
              severity="secondary"
              onClick={() =>
                toast.info({
                  title: 'Info',
                  description: 'Mensaje informativo del catálogo.',
                })
              }
            >
              Info
            </Button>
            <Button
              severity="danger"
              onClick={() =>
                toast.error({
                  title: 'Error',
                  description: 'Algo salió mal en la demo.',
                })
              }
            >
              Error
            </Button>
          </div>
          <Toast.Root
            className="mt-3 max-w-sm rounded-xl border border-slate-200 bg-white shadow-sm"
            toast={{
              title: 'Toast compuesto',
              description: 'Layout estático de referencia (sin cola).',
              severity: 'success',
            }}
          >
            <Toast.Message className="flex items-start gap-3 px-4 py-3">
              <Toast.Icon>
                <i className="pi pi-check-circle text-emerald-500" />
              </Toast.Icon>
              <Toast.Content className="flex-1 text-sm">
                <Toast.Title className="font-medium text-slate-900" />
                <Toast.Description className="text-slate-500" />
              </Toast.Content>
              <Toast.Close className="text-slate-400 hover:text-slate-700">
                <i className="pi pi-times text-xs" />
              </Toast.Close>
            </Toast.Message>
          </Toast.Root>
        </Demo>

        <Demo name="Sidebar">
          <Sidebar.Root className="h-40 overflow-hidden rounded-xl border border-slate-200">
            <Sidebar.Layout>
              <Sidebar.Aside className="w-40 border-r border-slate-200 p-2 text-sm">
                <Sidebar.Header>Menú</Sidebar.Header>
                <Sidebar.Content>
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton>Item 1</Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton>Item 2</Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  </Sidebar.Menu>
                </Sidebar.Content>
              </Sidebar.Aside>
              <Sidebar.Main className="p-3 text-sm">
                Contenido main
              </Sidebar.Main>
            </Sidebar.Layout>
          </Sidebar.Root>
        </Demo>

        <Demo name="FocusTrap">
          <FocusTrap className="rounded-xl border border-slate-200 p-3">
            <div className="flex gap-2">
              <Button size="small">Uno</Button>
              <Button size="small" severity="secondary" variant="outlined">
                Dos
              </Button>
            </div>
          </FocusTrap>
        </Demo>
      </Section>
    );
  }

  if (sectionId === 'faltantes-data-tablas') {
    return (
      <Section
        id="faltantes-data-tablas"
        title="Tablas y timeline"
        description="DataTable, DataView, Paginator y Timeline."
      >
        <Demo name="DataTable">
          <DataTable.Root value={TABLE_ROWS as any} className="w-full">
            <DataTable.TableContainer>
              <DataTable.Table>
                <DataTable.THead>
                  <DataTable.THeadRow>
                    <DataTable.THeadCell>
                      <DataTable.THeadTitle>ID</DataTable.THeadTitle>
                    </DataTable.THeadCell>
                    <DataTable.THeadCell>
                      <DataTable.THeadTitle>Nombre</DataTable.THeadTitle>
                    </DataTable.THeadCell>
                    <DataTable.THeadCell>
                      <DataTable.THeadTitle>Rol</DataTable.THeadTitle>
                    </DataTable.THeadCell>
                  </DataTable.THeadRow>
                </DataTable.THead>
                <DataTable.TBody>
                  {TABLE_ROWS.map((row) => (
                    <DataTable.Row key={row.id} data={row as any}>
                      <DataTable.Cell>{row.id}</DataTable.Cell>
                      <DataTable.Cell>{row.name}</DataTable.Cell>
                      <DataTable.Cell>{row.role}</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable.TBody>
              </DataTable.Table>
            </DataTable.TableContainer>
          </DataTable.Root>
        </Demo>

        <Demo name="DataView">
          <DataView.Root value={TABLE_ROWS as any} layout="list">
            <DataView.Content>
              <div className="space-y-2">
                {TABLE_ROWS.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    {row.name} · {row.role}
                  </div>
                ))}
              </div>
            </DataView.Content>
          </DataView.Root>
        </Demo>

        <Demo name="Paginator">
          <Paginator.Root
            page={page}
            onPageChange={(event: any) =>
              setPage(event.value ?? event.page ?? 0)
            }
            totalPages={5}
          >
            <Paginator.Content>
              <Paginator.First />
              <Paginator.Prev />
              <Paginator.Pages>
                {[0, 1, 2, 3, 4].map((value) => (
                  <Paginator.Page key={value} value={value}>
                    {value + 1}
                  </Paginator.Page>
                ))}
              </Paginator.Pages>
              <Paginator.Next />
              <Paginator.Last />
            </Paginator.Content>
          </Paginator.Root>
        </Demo>

        <Demo name="Timeline">
          <Timeline.Root>
            {['Creado', 'Revisado', 'Publicado'].map((label) => (
              <Timeline.Event key={label}>
                <Timeline.Opposite className="text-xs text-slate-400">
                  Hoy
                </Timeline.Opposite>
                <Timeline.Separator>
                  <Timeline.Marker />
                  <Timeline.Connector />
                </Timeline.Separator>
                <Timeline.Content className="text-sm">{label}</Timeline.Content>
              </Timeline.Event>
            ))}
          </Timeline.Root>
        </Demo>
      </Section>
    );
  }

  if (sectionId === 'faltantes-data-tree') {
    return <UiKitTreeSection />;
  }

  if (sectionId === 'faltantes-data-org') {
    return <UiKitOrgChartSection />;
  }

  if (sectionId === 'faltantes-data-upload') {
    return (
      <Section
        id="faltantes-data-upload"
        title="Upload"
        description="Carga de archivos."
      >
        <Demo name="FileUpload">
          <FileUpload.Root>
            <FileUpload.Trigger>
              <Button severity="secondary" variant="outlined" size="small">
                Elegir archivo
              </Button>
            </FileUpload.Trigger>
            <FileUpload.Content>
              <FileUpload.ItemGroup />
            </FileUpload.Content>
          </FileUpload.Root>
        </Demo>
      </Section>
    );
  }

  if (sectionId === 'faltantes-media2') {
    return (
      <Section
        id="faltantes-media2"
        title="Media avanzada"
        description="Carousel, gallery, compare, avatar group, overlay badge."
      >
        <Demo name="AvatarGroup + OverlayBadge">
          <div className="flex items-center gap-4">
            <AvatarGroup>
              {['Eduardo', 'Pilar', 'Operador'].map((name) => (
                <Avatar.Root key={name}>
                  <Avatar.Image src={buildDicebearAvatarUrl(name)} />
                  <Avatar.Fallback>{name.slice(0, 1)}</Avatar.Fallback>
                </Avatar.Root>
              ))}
            </AvatarGroup>
            <OverlayBadge>
              <Button severity="secondary" variant="outlined" iconOnly>
                <i className="pi pi-bell" />
              </Button>
              <Badge value="3" severity="danger" />
            </OverlayBadge>
          </div>
        </Demo>

        <Demo name="Carousel">
          <Carousel.Root className="w-full max-w-md">
            <Carousel.Content>
              {['Slide A', 'Slide B', 'Slide C'].map((label) => (
                <Carousel.Item
                  key={label}
                  className="rounded-xl border border-slate-200 p-8 text-center text-sm"
                >
                  {label}
                </Carousel.Item>
              ))}
            </Carousel.Content>
            <div className="mt-2 flex items-center justify-between">
              <Carousel.Prev>
                <i className="pi pi-chevron-left" />
              </Carousel.Prev>
              <Carousel.Indicators>
                <Carousel.Indicator />
                <Carousel.Indicator />
                <Carousel.Indicator />
              </Carousel.Indicators>
              <Carousel.Next>
                <i className="pi pi-chevron-right" />
              </Carousel.Next>
            </div>
          </Carousel.Root>
        </Demo>

        <Demo name="Gallery">
          <Gallery.Root
            value={[
              buildDicebearAvatarUrl('Eduardo'),
              buildDicebearAvatarUrl('Pilar'),
            ]}
          >
            <Gallery.Thumbnail>
              <Gallery.ThumbnailContent>
                <Gallery.ThumbnailItem index={0} />
                <Gallery.ThumbnailItem index={1} />
              </Gallery.ThumbnailContent>
            </Gallery.Thumbnail>
          </Gallery.Root>
        </Demo>

        <Demo name="Compare">
          <Compare.Root className="h-32 w-full max-w-md overflow-hidden rounded-xl border border-slate-200">
            <Compare.Item className="bg-slate-200 p-4 text-sm">
              Antes
            </Compare.Item>
            <Compare.Item className="bg-slate-800 p-4 text-sm text-white">
              Después
            </Compare.Item>
            <Compare.Handle>
              <Compare.Indicator />
            </Compare.Handle>
          </Compare.Root>
        </Demo>
      </Section>
    );
  }

  if (sectionId === 'faltantes-misc') {
    return (
      <Section
        id="faltantes-misc"
        title="Utilidades"
        description="Terminal y AnimateOnScroll."
      >
        <Demo name="Terminal">
          <Terminal.Root className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-100">
            <Terminal.Welcome>Backoffice terminal demo</Terminal.Welcome>
            <Terminal.CommandList />
            <Terminal.Prompt>
              <Terminal.PromptLabel>$</Terminal.PromptLabel>
              <Terminal.PromptValue />
            </Terminal.Prompt>
          </Terminal.Root>
        </Demo>

        <Demo name="AnimateOnScroll">
          <AnimateOnScroll>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
              Bloque con AnimateOnScroll (entra con animación al viewport).
            </div>
          </AnimateOnScroll>
        </Demo>
      </Section>
    );
  }

  return null;
}
