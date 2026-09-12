export function ClienteNoEncontrado() {
  return (
    <div className="flex flex-col items-center text-center" role="status">
      <span className="relative flex h-16 w-16 items-center justify-center">
        <span
          className="absolute -inset-3.5 rounded-full bg-warning/25"
          aria-hidden
        />
        <span
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-warning text-[2rem] leading-none font-bold text-white"
          aria-hidden
        >
          !
        </span>
      </span>

      <h3 className="font-gobold mt-6 text-xl tracking-wide text-ink uppercase">
        No existe jugador
      </h3>
      <p className="mt-2 text-sm text-ink">Prueba con otro ID o N° de DNI</p>
    </div>
  );
}
