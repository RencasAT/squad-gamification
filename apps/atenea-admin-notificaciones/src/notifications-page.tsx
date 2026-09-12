import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@primereact/ui/button';
import { cn } from '@gamification/shared-utils/utils/cn';

type AppNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

const initialNotifications: AppNotification[] = [
  {
    id: '1',
    title: 'Nuevo usuario creado',
    message: 'Se registró el usuario Operador Demo en el backoffice.',
    createdAt: '2026-07-22T18:30:00',
    read: false,
    href: '/administracion/usuarios',
  },
  {
    id: '2',
    title: 'Rol actualizado',
    message: 'Se modificaron los accesos del rol Admin.',
    createdAt: '2026-07-22T15:10:00',
    read: false,
    href: '/administracion/roles',
  },
  {
    id: '3',
    title: 'Premio publicado',
    message: 'La campaña de premios semanales ya está disponible.',
    createdAt: '2026-07-21T11:45:00',
    read: true,
    href: '/premios',
  },
  {
    id: '4',
    title: 'Mantenimiento programado',
    message: 'Habrá una ventana de mantenimiento el viernes a las 02:00.',
    createdAt: '2026-07-20T09:00:00',
    read: true,
  },
];

function formatDate(value: string) {
  return new Date(value).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);

  const clearAll = () => {
    setNotifications([]);
  };

  const removeOne = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const goTo = (notification: AppNotification) => {
    if (!notification.href) return;
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item,
      ),
    );
    void navigate(notification.href);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Mis Notificaciones
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {notifications.length === 0
              ? 'No tienes notificaciones.'
              : `${notifications.length} notificación${notifications.length === 1 ? '' : 'es'}`}
          </p>
        </div>

        <Button
          severity="danger"
          variant="outlined"
          disabled={notifications.length === 0}
          onClick={clearAll}
        >
          <i className="pi pi-trash mr-2" />
          Borrar todas
        </Button>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
          <i className="pi pi-bell text-3xl text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            Bandeja vacía
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Cuando haya novedades aparecerán aquí.
          </p>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-slate-200">
          {notifications.map((notification, index) => (
            <li
              key={notification.id}
              className={cn(
                'flex flex-col gap-3 border-b border-slate-200 px-4 py-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between',
                index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70',
                !notification.read && 'bg-sky-50/60',
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {!notification.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                  )}
                  <h3 className="text-sm font-semibold text-slate-800">
                    {notification.title}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {notification.message}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {formatDate(notification.createdAt)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {notification.href && (
                  <Button
                    type="button"
                    severity="secondary"
                    variant="outlined"
                    onClick={() => goTo(notification)}
                  >
                    <i className="pi pi-arrow-right mr-2" />
                    Ir
                  </Button>
                )}
                <Button
                  type="button"
                  severity="danger"
                  variant="text"
                  iconOnly
                  className="h-9! w-9! min-w-0! p-0!"
                  aria-label="Eliminar notificación"
                  onClick={() => removeOne(notification.id)}
                >
                  <i className="pi pi-times text-sm" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
