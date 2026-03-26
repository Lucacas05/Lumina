import { LogIn, UserCircle } from "lucide-react";

export function IdentityBadge() {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="font-headline text-xs font-bold uppercase tracking-widest text-primary">Invitado</p>
        <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
          Acceso local
        </p>
      </div>
      <button
        type="button"
        title="Inicio de sesión disponible próximamente"
        className="inline-flex items-center justify-center gap-2 border-b-[3px] border-on-primary-fixed-variant bg-primary px-4 py-2 font-headline text-xs font-bold uppercase tracking-widest text-on-primary"
      >
        <LogIn size={16} />
        Iniciar sesión
      </button>
      <div className="hidden h-10 w-10 items-center justify-center overflow-hidden border-2 border-outline-variant bg-surface-container-highest lg:flex">
        <UserCircle className="text-primary" size={22} />
      </div>
    </div>
  );
}
