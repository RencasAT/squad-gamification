import { Toast } from '@primereact/ui/toast';
import { Toaster, type ToasterRegionInstance } from '@primereact/ui/toaster';

/** Host global de toasts (PrimeReact 11 compound API). */
export function AppToaster() {
  return (
    <Toaster.Root position="top-right">
      <Toaster.Portal>
        <Toaster.Region>
          {({ toaster }: ToasterRegionInstance) =>
            toaster?.toasts?.map((item) => (
              <Toast.Root
                key={item.id}
                toast={item}
                className="max-w-sm rounded-xl border border-slate-200 bg-white shadow-lg"
              >
                <Toast.Content className="flex items-start gap-3 px-4 py-3">
                  <Toast.Icon match="success">
                    <i className="pi pi-check-circle text-emerald-500" />
                  </Toast.Icon>
                  <Toast.Icon match="error">
                    <i className="pi pi-times-circle text-red-500" />
                  </Toast.Icon>
                  <Toast.Icon match="warn">
                    <i className="pi pi-exclamation-triangle text-amber-500" />
                  </Toast.Icon>
                  <Toast.Icon match="info">
                    <i className="pi pi-info-circle text-sky-500" />
                  </Toast.Icon>
                  <Toast.Message className="min-w-0 flex-1 text-sm">
                    <Toast.Title className="font-medium text-slate-900" />
                    <Toast.Description className="text-slate-500" />
                  </Toast.Message>
                  <Toast.Close className="text-slate-400 hover:text-slate-700">
                    <i className="pi pi-times text-xs" />
                  </Toast.Close>
                </Toast.Content>
              </Toast.Root>
            ))
          }
        </Toaster.Region>
      </Toaster.Portal>
    </Toaster.Root>
  );
}
