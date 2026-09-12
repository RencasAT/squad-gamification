import { cn } from '@gamification/shared-utils/utils/cn';

type SidebarToggleIconProps = {
  className?: string;
  title?: string;
};

/** Icono Figma: panel lateral + chevron (expandir / comprimir menú). */
export function SidebarToggleIcon({
  className,
  title,
}: SidebarToggleIconProps) {
  return (
    <svg
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-5', className)}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M11.25 10.8333V4.16667L7.91667 7.5L11.25 10.8333ZM1.66667 15C1.20833 15 0.815972 14.8368 0.489583 14.5104C0.163194 14.184 0 13.7917 0 13.3333V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H13.3333C13.7917 0 14.184 0.163194 14.5104 0.489583C14.8368 0.815972 15 1.20833 15 1.66667V13.3333C15 13.7917 14.8368 14.184 14.5104 14.5104C14.184 14.8368 13.7917 15 13.3333 15H1.66667ZM4.16667 13.3333V1.66667H1.66667V13.3333H4.16667ZM5.83333 13.3333H13.3333V1.66667H5.83333V13.3333Z"
        fill="currentColor"
      />
    </svg>
  );
}
