import { useMemo, useRef, useState } from "react";
import { RotateCcw, Save, Settings2, Sparkles } from "lucide-react";
import { ItemModelPreview } from "@/islands/sanctuary/ItemModelPreview";
import { PixelAvatar } from "@/islands/sanctuary/PixelAvatar";
import { useGsapReveal } from "@/islands/sanctuary/useGsapReveal";
import {
  getRenderableCurrentProfile,
  useSanctuaryStore,
} from "@/lib/sanctuary/store";
import {
  formatWardrobeDuration,
  getDefaultWardrobeConfig,
  getFocusSecondsForLevel,
  listWardrobeRulesByField,
  loadWardrobeConfig,
  resetWardrobeConfig,
  saveWardrobeConfig,
  type WardrobeConfig,
  type WardrobeField,
} from "@/lib/sanctuary/wardrobe";

const fields: WardrobeField[] = ["upper", "lower", "socks", "accessory"];

const fieldLabels: Record<WardrobeField, string> = {
  upper: "Parte superior",
  lower: "Parte inferior",
  socks: "Calcetines",
  accessory: "Accesorios",
};

const fieldDescriptions: Record<WardrobeField, string> = {
  upper: "Define el nivel de apertura de cada prenda superior.",
  lower: "Ajusta el ritmo de desbloqueo de pantalones y bases.",
  socks: "Controla los detalles pequenos del conjunto.",
  accessory: "Ordena cascos, bigotes y piezas raras del santuario.",
};

function getLevelStepMinutes(config: WardrobeConfig) {
  return Math.max(15, Math.round(config.levelStepFocusSeconds / 60));
}

export function WardrobeRulesEditor() {
  const sanctuary = useSanctuaryStore();
  const avatar = getRenderableCurrentProfile(sanctuary).avatar;
  const [config, setConfig] = useState<WardrobeConfig>(() =>
    loadWardrobeConfig(),
  );
  const [savedMessage, setSavedMessage] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGsapReveal(rootRef);

  const groups = useMemo(
    () =>
      fields.map((field) => ({
        field,
        label: fieldLabels[field],
        description: fieldDescriptions[field],
        rules: listWardrobeRulesByField(field, config),
      })),
    [config],
  );

  const maxUnlockLevel = Math.max(
    ...config.rules.map((rule) => rule.unlockLevel),
  );
  const totalUnlockWindow = getFocusSecondsForLevel(
    maxUnlockLevel,
    config.levelStepFocusSeconds,
  );

  function updateLevelStepMinutes(value: number) {
    setConfig((current) => ({
      ...current,
      levelStepFocusSeconds: Math.max(15, Math.round(value)) * 60,
    }));
    setSavedMessage("");
  }

  function updateRuleLevel(ruleId: string, unlockLevel: number) {
    setConfig((current) => ({
      ...current,
      rules: current.rules.map((rule) =>
        rule.id === ruleId
          ? { ...rule, unlockLevel: Math.max(1, Math.round(unlockLevel || 1)) }
          : rule,
      ),
    }));
    setSavedMessage("");
  }

  function handleSave() {
    saveWardrobeConfig(config);
    setSavedMessage("Cambios del armario guardados.");
  }

  function handleReset() {
    resetWardrobeConfig();
    const nextConfig = getDefaultWardrobeConfig();
    setConfig(nextConfig);
    setSavedMessage("Armario restaurado al diseno base.");
  }

  return (
    <div ref={rootRef} className="space-y-6">
      <section className="gsap-rise grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="border border-outline-variant bg-[radial-gradient(circle_at_50%_16%,rgba(255,193,112,0.12),transparent_38%),linear-gradient(180deg,#201714_0%,#17110f_100%)] px-6 py-8 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-headline text-[10px] font-bold uppercase tracking-[0.24em] text-outline">
                Editor del armario
              </p>
              <h1 className="mt-2 font-headline text-3xl font-black uppercase tracking-tight text-on-surface">
                Reglas de desbloqueo
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-on-surface-variant">
                Aqui decides en que nivel aparece cada prenda. El armario
                principal y las misiones leeran esta configuracion para pintar
                los candados y el progreso del personaje.
              </p>
            </div>
            <a
              href="/armario"
              className="inline-flex items-center justify-center border-b-[3px] border-outline-variant bg-surface-container-high px-4 py-3 font-headline text-xs font-bold uppercase tracking-widest text-on-surface"
            >
              Ver armario
            </a>
          </div>

          <div className="mt-8 flex min-h-[24rem] items-center justify-center overflow-hidden sm:min-h-[29rem]">
            <PixelAvatar
              avatar={avatar}
              size="xxl"
              highlighted={false}
              showStatusBadge={false}
              stage="plain"
              anchor="center"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="gsap-rise grid gap-4 sm:grid-cols-2">
            <article className="border border-outline-variant bg-surface-container p-5">
              <div className="flex items-center gap-2 text-primary">
                <Settings2 size={16} />
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em]">
                  Ritmo de nivel
                </p>
              </div>
              <label className="mt-4 block text-xs uppercase tracking-[0.18em] text-outline">
                Minutos por nivel
              </label>
              <input
                type="number"
                min={15}
                step={5}
                value={getLevelStepMinutes(config)}
                onChange={(event) =>
                  updateLevelStepMinutes(Number(event.target.value))
                }
                className="mt-2 w-full border border-outline-variant bg-surface-container-low px-3 py-3 font-headline text-lg font-black uppercase tracking-tight text-on-surface"
              />
              <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                Cada nivel suma{" "}
                {formatWardrobeDuration(config.levelStepFocusSeconds)} de
                estudio acumulado.
              </p>
            </article>

            <article className="border border-outline-variant bg-surface-container p-5">
              <div className="flex items-center gap-2 text-secondary">
                <Sparkles size={16} />
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em]">
                  Ventana total
                </p>
              </div>
              <p className="mt-4 font-headline text-2xl font-black uppercase tracking-tight text-on-surface">
                Nivel {maxUnlockLevel}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                Con la configuracion actual, el ultimo item se abre tras{" "}
                {formatWardrobeDuration(totalUnlockWindow)}.
              </p>
            </article>
          </div>

          <div className="gsap-rise border border-outline-variant bg-surface-container p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-outline">
                  Guardado
                </p>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {savedMessage ||
                    "Ajusta niveles, guarda y luego revisa el resultado en el armario."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 border border-outline-variant bg-surface-container-low px-4 py-3 font-headline text-xs font-bold uppercase tracking-widest text-on-surface hover:border-secondary"
                >
                  <RotateCcw size={14} />
                  Restaurar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 border-b-[3px] border-on-primary-fixed-variant bg-primary px-4 py-3 font-headline text-xs font-bold uppercase tracking-widest text-on-primary"
                >
                  <Save size={14} />
                  Guardar reglas
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {groups.map((group) => (
        <section
          key={group.field}
          className="gsap-rise border border-outline-variant bg-surface-container p-4 sm:p-5"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant pb-4">
            <div>
              <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-outline">
                {group.label}
              </p>
              <h2 className="mt-2 font-headline text-2xl font-black uppercase tracking-tight text-primary">
                {group.description}
              </h2>
            </div>
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-outline">
              {group.rules.length} piezas
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {group.rules.map((rule) => {
              const unlockTime = getFocusSecondsForLevel(
                rule.unlockLevel,
                config.levelStepFocusSeconds,
              );

              return (
                <article
                  key={rule.id}
                  className="border border-outline-variant bg-surface-container-low p-4"
                >
                  <div className="flex justify-center">
                    <ItemModelPreview
                      field={rule.field}
                      value={rule.value}
                      avatar={avatar}
                    />
                  </div>
                  <p className="mt-3 font-headline text-sm font-black uppercase tracking-[0.14em] text-on-surface">
                    {rule.label}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-outline">
                    {rule.value}
                  </p>

                  <label className="mt-4 block text-xs uppercase tracking-[0.18em] text-outline">
                    Nivel de desbloqueo
                  </label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={rule.unlockLevel}
                    onChange={(event) =>
                      updateRuleLevel(rule.id, Number(event.target.value))
                    }
                    className="mt-2 w-full border border-outline-variant bg-surface-container px-3 py-3 font-headline text-lg font-black uppercase tracking-tight text-on-surface"
                  />

                  <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                    Se desbloquea al nivel {rule.unlockLevel} tras{" "}
                    {formatWardrobeDuration(unlockTime)} de estudio acumulado.
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
