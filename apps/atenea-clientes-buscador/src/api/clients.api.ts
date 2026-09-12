import { http } from '@gamification/shared-utils/api/http';
import type {
  ClienteDetalle,
  ClienteGrupo,
  ClienteLogro,
  ClienteMision,
  ClienteResumen,
  ClienteTorneo,
} from '../model/cliente.types';

type DataResponse<T> = {
  data: T;
};

export async function fetchClient(id: string): Promise<ClienteDetalle> {
  const { data } = await http.get<DataResponse<ClienteDetalle>>(
    `/clients/${encodeURIComponent(id)}`,
  );
  return data.data;
}

export async function fetchClientSummary(id: string): Promise<ClienteResumen> {
  const { data } = await http.get<DataResponse<ClienteResumen>>(
    `/clients/${encodeURIComponent(id)}/summary`,
  );
  return data.data;
}

export async function fetchClientGroups(id: string): Promise<ClienteGrupo[]> {
  const { data } = await http.get<DataResponse<ClienteGrupo[]>>(
    `/clients/${encodeURIComponent(id)}/groups`,
  );
  return data.data;
}

export async function addClientGroupsApi(
  id: string,
  groupIds: number[],
): Promise<ClienteGrupo[]> {
  const { data } = await http.post<DataResponse<ClienteGrupo[]>>(
    `/clients/${encodeURIComponent(id)}/groups`,
    { groupIds },
  );
  return data.data;
}

export async function removeClientGroupApi(
  id: string,
  groupId: number,
): Promise<ClienteGrupo[]> {
  const { data } = await http.delete<DataResponse<ClienteGrupo[]>>(
    `/clients/${encodeURIComponent(id)}/groups/${groupId}`,
  );
  return data.data;
}

export async function fetchGroupsCatalog(): Promise<ClienteGrupo[]> {
  const { data } = await http.get<DataResponse<ClienteGrupo[]>>('/groups');
  return data.data;
}

export async function fetchClientAchievements(
  id: string,
): Promise<ClienteLogro[]> {
  const { data } = await http.get<DataResponse<ClienteLogro[]>>(
    `/clients/${encodeURIComponent(id)}/achievements`,
  );
  return data.data;
}

export async function fetchClientTournaments(
  id: string,
): Promise<ClienteTorneo[]> {
  const { data } = await http.get<DataResponse<ClienteTorneo[]>>(
    `/clients/${encodeURIComponent(id)}/tournaments`,
  );
  return data.data;
}

export async function fetchClientMissions(
  id: string,
): Promise<ClienteMision[]> {
  const { data } = await http.get<DataResponse<ClienteMision[]>>(
    `/clients/${encodeURIComponent(id)}/missions`,
  );
  return data.data;
}
