import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Castle, Sparkles } from "lucide-react";
import { PixelAvatar } from "@/islands/sanctuary/PixelAvatar";
import {
  avatarOptions,
  getFullState,
  getRenderableCurrentProfile,
  sanctuaryActions,
  useSanctuaryStore,
  type PreferredStartPath,
  type RemoteAccountIdentity,
} from "@/lib/sanctuary/store";

interface OnboardingFlowProps {
  initialUser: RemoteAccountIdentity;
  nextPath: string | null;
}

export function OnboardingFlow({ initialUser, nextPath }: OnboardingFlowProps) {
  const sanctuary = useSanctuaryStore();
  const profile = getRenderableCurrentProfile(sanctuary);
  const [displayName, setDisplayName] = useState(initialUser.displayName);
  const [goal, setGoal] = useState(sanctuary.onboardingGoal);
  const [preferredStartPath, setPreferredStartPath] = useState<PreferredStartPath>(
    sanctuary.preferredStartPath,
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (sanctuary.currentUserId !== initialUser.id) {
      sanctuaryActions.connectGitHubAccount(initialUser);
    }
  }, [initialUser, sanctuary.currentUserId]);

  useEffect(() => {
    if (profile.id === initialUser.id) {
      setDisplayName(profile.displayName);
    }
  }, [initialUser.id, profile.displayName, profile.id]);

  const avatarPreview = useMemo(() => profile.avatar, [profile.avatar]);

  async function handleSubmit() {
    setIsSaving(true);

    sanctuaryActions.completeOnboarding({
      displayName,
      goal,
      preferredStartPath,
    });

    try {
      await fetch("/api/me", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: getFullState() }),
      });
    } finally {
      window.location.assign(nextPath || preferredStartPath);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="overflow-hidden bg-surface-container-low pixel-border">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 border-l-4 border-primary bg-secondary-container px-3 py-2">
              <Sparkles size={16} className="text-primary" />
              <span className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary-fixed">
                Bienvenida al archivo
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-headline text-4xl font-black uppercase tracking-tighter text-on-surface md:text-6xl">
                Prepara tu entrada en <span className="text-primary">Lumina</span>
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
                Antes de abrir la biblioteca pública y las salas privadas, deja lista tu identidad de estudio:
                nombre visible, objetivo inicial y la apariencia base con la que entrarás al santuario.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="bg-surface-container pixel-border p-4">
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
                  Cuenta conectada
                </p>
                <p className="mt-2 font-headline text-lg font-black uppercase tracking-tight text-on-surface">
                  @{initialUser.username}
                </p>
              </div>
              <div className="bg-surface-container pixel-border p-4">
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
                  Siguiente paso
                </p>
                <p className="mt-2 font-headline text-lg font-black uppercase tracking-tight text-primary">
                  Onboarding único
                </p>
              </div>
              <div className="bg-surface-container pixel-border p-4">
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
                  Destino inicial
                </p>
                <p className="mt-2 font-headline text-lg font-black uppercase tracking-tight text-tertiary">
                  {preferredStartPath === "/estudio" ? "Santuario silencioso" : "Biblioteca compartida"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,190,110,0.18),transparent_55%)] pixel-border p-8">
            <PixelAvatar avatar={avatarPreview} size="xxl" state="idle" stage="plain" anchor="center" />
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6 bg-surface-container pixel-border p-6">
          <div>
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
              Tu perfil base
            </p>
            <h2 className="mt-2 font-headline text-2xl font-black uppercase tracking-tight text-on-surface">
              Identidad del santuario
            </h2>
          </div>

          <label className="block space-y-2">
            <span className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
              Nombre visible
            </span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-none border-2 border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
              placeholder="Cómo te verá el resto"
            />
          </label>

          <label className="block space-y-2">
            <span className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
              Objetivo inicial
            </span>
            <textarea
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              rows={4}
              className="w-full rounded-none border-2 border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
              placeholder="Ejemplo: estudiar 4 pomodoros al día sin romper la racha."
            />
          </label>

          <div className="space-y-3">
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
              Sala preferida al entrar
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPreferredStartPath("/estudio")}
                className={`pixel-border p-4 text-left ${preferredStartPath === "/estudio" ? "bg-primary/15 border-primary" : "bg-surface-container-low"}`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span className="font-headline text-sm font-black uppercase tracking-tight text-on-surface">
                    Santuario silencioso
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
                  Entrar directamente al foco individual.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPreferredStartPath("/biblioteca-compartida")}
                className={`pixel-border p-4 text-left ${preferredStartPath === "/biblioteca-compartida" ? "bg-primary/15 border-primary" : "bg-surface-container-low"}`}
              >
                <div className="flex items-center gap-2">
                  <Castle size={16} className="text-primary" />
                  <span className="font-headline text-sm font-black uppercase tracking-tight text-on-surface">
                    Biblioteca compartida
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
                  Abrir antes la sala pública y tu círculo social.
                </p>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-surface-container pixel-border p-6">
          <div>
            <p className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
              Apariencia inicial
            </p>
            <h2 className="mt-2 font-headline text-2xl font-black uppercase tracking-tight text-on-surface">
              Avatar base
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
                Sexo
              </span>
              <select
                value={avatarPreview.sex}
                onChange={(event) =>
                  sanctuaryActions.updateAvatar("sex", event.target.value as typeof avatarPreview.sex)
                }
                className="w-full rounded-none border-2 border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
              >
                {avatarOptions.sex.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
                Piel
              </span>
              <select
                value={avatarPreview.skinTone}
                onChange={(event) =>
                  sanctuaryActions.updateAvatar("skinTone", event.target.value as typeof avatarPreview.skinTone)
                }
                className="w-full rounded-none border-2 border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
              >
                {avatarOptions.skinTone.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
                Pelo
              </span>
              <select
                value={avatarPreview.hairStyle}
                onChange={(event) =>
                  sanctuaryActions.updateAvatar("hairStyle", event.target.value as typeof avatarPreview.hairStyle)
                }
                className="w-full rounded-none border-2 border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
              >
                {avatarOptions.hairStyle.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
                Color del pelo
              </span>
              <select
                value={avatarPreview.hairColor}
                onChange={(event) =>
                  sanctuaryActions.updateAvatar("hairColor", event.target.value as typeof avatarPreview.hairColor)
                }
                className="w-full rounded-none border-2 border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
              >
                {avatarOptions.hairColor.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
                Parte superior
              </span>
              <select
                value={avatarPreview.upper}
                onChange={(event) =>
                  sanctuaryActions.updateAvatar("upper", event.target.value as typeof avatarPreview.upper)
                }
                className="w-full rounded-none border-2 border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
              >
                {avatarOptions.upper.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="font-headline text-[10px] font-bold uppercase tracking-[0.25em] text-outline">
                Parte inferior
              </span>
              <select
                value={avatarPreview.lower}
                onChange={(event) =>
                  sanctuaryActions.updateAvatar("lower", event.target.value as typeof avatarPreview.lower)
                }
                className="w-full rounded-none border-2 border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
              >
                {avatarOptions.lower.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={isSaving || displayName.trim().length === 0}
              className="inline-flex items-center justify-center gap-2 border-b-[3px] border-on-primary-fixed-variant bg-primary px-6 py-3 font-headline text-xs font-bold uppercase tracking-widest text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowRight size={16} />
              {isSaving ? "Guardando..." : "Entrar al santuario"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
