import { DashboardCard } from './dashboard-card';
import { DAILY_LOGS } from './dashboard.mock';

export function DailyLogsTable() {
  return (
    <DashboardCard className="flex min-h-0 flex-col">
      <h2 className="font-gobold mb-3 flex items-center gap-2 text-sm tracking-wide text-slate-800 uppercase">
        <i className="pi pi-history text-xs" aria-hidden />
        Logs del día
      </h2>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-125 text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Clientes</th>
                <th className="px-3 py-2.5 font-semibold">
                  Fecha de modificación
                </th>
                <th className="px-3 py-2.5 font-semibold">ID del Evento</th>
                <th className="px-3 py-2.5 font-semibold">Nombre del Evento</th>
              </tr>
            </thead>
            <tbody>
              {DAILY_LOGS.map((log, index) => (
                <tr
                  key={log.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#eef3f7]/70'}
                >
                  <td className="px-3 py-2.5 text-slate-700">{log.client}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">
                    {log.date}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">{log.eventId}</td>
                  <td className="px-3 py-2.5 text-slate-700">
                    {log.eventName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardCard>
  );
}
