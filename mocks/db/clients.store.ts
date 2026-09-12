import { findClienteByNum, mockGruposCatalogo } from '../data/clients.mock';
import type {
  ClienteDetalle,
  ClienteGrupo,
} from '@gamification/atenea-clientes-buscador/model/cliente.types';

/** Clientes materializados en memoria (mutables por id de búsqueda). */
const clientsByKey = new Map<string, ClienteDetalle>();

function clientKey(id: string): string {
  return id.trim();
}

/** Limpia el store en memoria (tests). */
export function resetClientsStore(): void {
  clientsByKey.clear();
}

export function getOrCreateClient(id: string): ClienteDetalle | null {
  const key = clientKey(id);
  if (!key) {
    return null;
  }

  const existing = clientsByKey.get(key);
  if (existing) {
    return cloneClient(existing);
  }

  const created = findClienteByNum(key);
  if (!created) {
    return null;
  }

  clientsByKey.set(key, created);
  return cloneClient(created);
}

function cloneClient(client: ClienteDetalle): ClienteDetalle {
  return {
    ...client,
    resumen: {
      ...client.resumen,
      deportivas: client.resumen.deportivas.map((item) => ({ ...item })),
      casino: client.resumen.casino.map((item) => ({ ...item })),
      tipoJugador: { ...client.resumen.tipoJugador },
    },
    grupos: client.grupos.map((grupo) => ({ ...grupo })),
    logros: client.logros.map((logro) => ({ ...logro })),
    torneos: client.torneos.map((torneo) => ({ ...torneo })),
    misiones: client.misiones.map((mision) => ({ ...mision })),
  };
}

function mutateClient(
  id: string,
  updater: (client: ClienteDetalle) => void,
): ClienteDetalle | null {
  const key = clientKey(id);
  let client = clientsByKey.get(key);
  if (!client) {
    const created = findClienteByNum(key);
    if (!created) {
      return null;
    }
    clientsByKey.set(key, created);
    client = created;
  }
  updater(client);
  return cloneClient(client);
}

export function listClientGroups(id: string): ClienteGrupo[] | null {
  const client = getOrCreateClient(id);
  return client ? client.grupos : null;
}

export function addClientGroups(
  id: string,
  groupIds: number[],
): ClienteGrupo[] | null {
  return (
    mutateClient(id, (client) => {
      const existing = new Set(client.grupos.map((grupo) => grupo.id));
      for (const groupId of groupIds) {
        if (existing.has(groupId)) {
          continue;
        }
        const catalogItem = mockGruposCatalogo.find(
          (grupo) => grupo.id === groupId,
        );
        if (catalogItem) {
          client.grupos.push({ ...catalogItem });
          existing.add(groupId);
        }
      }
    })?.grupos ?? null
  );
}

export function removeClientGroup(
  id: string,
  groupId: number,
): ClienteGrupo[] | null {
  return (
    mutateClient(id, (client) => {
      client.grupos = client.grupos.filter((grupo) => grupo.id !== groupId);
    })?.grupos ?? null
  );
}

export function listGroupsCatalog(): ClienteGrupo[] {
  return mockGruposCatalogo.map((grupo) => ({ ...grupo }));
}
