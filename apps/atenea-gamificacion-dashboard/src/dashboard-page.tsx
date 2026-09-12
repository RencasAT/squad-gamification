import { ExperiencesCalendar } from './experiences-calendar';
import { WeeklyGgrChart } from './weekly-ggr-chart';
import { DailyLogsTable } from './daily-logs-table';

export function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4">
      <ExperiencesCalendar />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <WeeklyGgrChart />
        <DailyLogsTable />
      </div>
    </div>
  );
}
