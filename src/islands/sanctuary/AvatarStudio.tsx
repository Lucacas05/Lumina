import { useMemo, useRef, useState } from "react";
import { Palette } from "lucide-react";
import {
  avatarOptions,
  sanctuaryActions,
  useSanctuaryStore,
  type AvatarConfig,
} from "@/lib/sanctuary/store";
import { ItemModelPreview } from "@/islands/sanctuary/ItemModelPreview";
import { PixelAvatar } from "@/islands/sanctuary/PixelAvatar";
import { useGsapReveal } from "@/islands/sanctuary/useGsapReveal";

type AvatarField = keyof AvatarConfig;

const fieldLabels: Record<AvatarField, string> = {
  base: "Base",
  skinTone: "Piel",
  hairStyle: "Peinado",
  hairColor: "Color",
  facialHair: "Bigote",
  outfit: "Vestuario",
  accessory: "Objeto",
  expression: "Rostro",
};

const fieldOrder: AvatarField[] = [
  "base",
  "skinTone",
  "hairStyle",
  "hairColor",
  "facialHair",
  "outfit",
  "accessory",
  "expression",
];

export function AvatarStudio() {
  const sanctuary = useSanctuaryStore();
  const [activeField, setActiveField] = useState<AvatarField>("outfit");
  const currentOptions = useMemo(() => avatarOptions[activeField], [activeField]);
  const avatar = sanctuary.profiles[sanctuary.currentUserId].avatar;
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGsapReveal(rootRef);

  return (
    <div
      ref={rootRef}
      className="grid gap-8 xl:grid-cols-[minmax(15rem,16rem)_minmax(0,1fr)_minmax(18rem,20rem)] 2xl:grid-cols-[minmax(16rem,18rem)_minmax(0,1fr)_minmax(20rem,22rem)]"
    >
      <aside className="space-y-5">
        <div className="gsap-rise bg-surface-container-low pixel-border p-5">
          <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">Vestidor del santuario</p>
          <h2 className="mt-2 font-headline text-2xl font-black uppercase tracking-tighter text-primary">Refinar avatar</h2>
        </div>

        <div className="gsap-rise bg-surface-container pixel-border p-3">
          {fieldOrder.map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => setActiveField(field)}
              className={`mb-2 flex w-full items-center justify-between rounded-none border-l-4 px-4 py-3 text-left font-headline text-sm font-bold uppercase tracking-widest last:mb-0 ${
                activeField === field
                  ? "border-primary bg-surface-container-highest text-primary"
                  : "border-transparent bg-surface-container-low text-on-surface hover:text-primary"
              }`}
            >
              <span>{fieldLabels[field]}</span>
              <span className="text-[10px] text-outline">{avatar[field]}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="min-w-0">
        <div className="gsap-rise relative overflow-hidden bg-[linear-gradient(180deg,#201a18_0%,#1a1412_55%,#130d0b_100%)] pixel-border p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,185,97,0.22),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(173,208,168,0.14),transparent_24%)]" />
          <div className="absolute left-1/2 top-[14%] h-40 w-40 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex min-h-[35rem] flex-col items-center justify-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 border-2 border-surface-container-highest bg-secondary-container px-4 py-1 font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-primary-fixed">
              Vista previa
            </div>
            <div className="absolute bottom-14 left-1/2 h-28 w-[74%] -translate-x-1/2 skew-x-[-18deg] rounded-[0.35rem] border-2 border-primary/25 bg-[linear-gradient(180deg,rgba(255,185,97,0.06),rgba(24,18,16,0.55))]" />
            <div className="gsap-drift relative z-10 rounded-none border-4 border-surface-container-highest bg-surface-container px-12 py-10 shadow-[0_22px_0_rgba(0,0,0,0.24)]">
              <PixelAvatar avatar={avatar} size="lg" highlighted={true} />
            </div>

            <div className="mt-12 grid w-full gap-3 sm:grid-cols-3">
              <div className="gsap-rise border-l-4 border-primary bg-surface-container px-4 py-3">
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">Vestuario</p>
                <p className="mt-2 font-headline text-sm font-black uppercase tracking-tight text-primary">{avatar.outfit}</p>
              </div>
              <div className="gsap-rise border-l-4 border-tertiary bg-surface-container px-4 py-3">
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">Objeto</p>
                <p className="mt-2 font-headline text-sm font-black uppercase tracking-tight text-tertiary">{avatar.accessory}</p>
              </div>
              <div className="gsap-rise border-l-4 border-secondary bg-surface-container px-4 py-3">
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">Rostro</p>
                <p className="mt-2 font-headline text-sm font-black uppercase tracking-tight text-secondary">{avatar.expression}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="gsap-rise bg-surface-container pixel-border p-6">
          <div className="mb-5 flex items-center gap-3">
            <Palette size={18} className="text-primary" />
            <div>
              <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">Pieza activa</p>
              <h3 className="font-headline text-xl font-black uppercase tracking-tight text-on-surface">{fieldLabels[activeField]}</h3>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {currentOptions.map((option) => {
              const active = avatar[activeField] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => sanctuaryActions.updateAvatar(activeField, option.value as AvatarConfig[typeof activeField])}
                  className={`gsap-rise flex items-center gap-4 rounded-none border-2 p-4 text-left ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-outline-variant bg-surface-container-low text-on-surface"
                  }`}
                >
                  <ItemModelPreview field={activeField} value={option.value} />
                  <div>
                    <p className="font-headline text-sm font-black uppercase tracking-tight">{option.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">{option.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="gsap-rise grid gap-3 sm:grid-cols-3">
          <div className="bg-surface-container-low pixel-border p-4">
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">Muestra</p>
            <div className="mt-3 flex justify-center">
              <ItemModelPreview field="outfit" value={avatar.outfit} />
            </div>
          </div>
          <div className="bg-surface-container-low pixel-border p-4">
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">Objeto</p>
            <div className="mt-3 flex justify-center">
              <ItemModelPreview field="accessory" value={avatar.accessory} />
            </div>
          </div>
          <div className="bg-surface-container-low pixel-border p-4">
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">Color</p>
            <div className="mt-3 flex justify-center">
              <ItemModelPreview field="hairColor" value={avatar.hairColor} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
