import type { TreeNodeRow } from '@primereact/types/primitive/tree';
import { Tree } from '@primereact/ui/tree';
import { Demo, Section } from './ui-kit-primitives';

const TREE_NODES = [
  {
    key: '0',
    label: 'Gamificación',
    children: [
      { key: '0-0', label: 'Premios' },
      { key: '0-1', label: 'Campañas' },
      {
        key: '0-2',
        label: 'Administración',
        children: [
          { key: '0-2-0', label: 'Usuarios' },
          { key: '0-2-1', label: 'Roles' },
        ],
      },
    ],
  },
];

export function UiKitTreeSection() {
  return (
    <Section
      id="faltantes-data-tree"
      title="Tree"
      description="Árbol jerárquico con expand/collapse."
    >
      <Demo name="Tree">
        <Tree.Root
          value={TREE_NODES}
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-3"
        >
          <Tree.Nodes>
            {(row: TreeNodeRow) => (
              <Tree.Node uKey={row.node.key}>
                <Tree.Content className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                  <Tree.Toggle className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100">
                    <Tree.ToggleIndicator match="expanded">
                      <i className="pi pi-chevron-down text-xs" />
                    </Tree.ToggleIndicator>
                    <Tree.ToggleIndicator match="collapsed">
                      <i className="pi pi-chevron-right text-xs" />
                    </Tree.ToggleIndicator>
                  </Tree.Toggle>
                  <Tree.Label>{row.node.label}</Tree.Label>
                </Tree.Content>
              </Tree.Node>
            )}
          </Tree.Nodes>
          <Tree.Empty className="px-2 py-4 text-sm text-slate-500">
            Sin nodos
          </Tree.Empty>
        </Tree.Root>
      </Demo>
    </Section>
  );
}
