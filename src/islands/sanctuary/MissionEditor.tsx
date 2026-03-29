import { useMemo, useRef, useState } from "react";
import { Plus, RotateCcw, Save, Sparkles, Trash2 } from "lucide-react";
import { ItemModelPreview } from "@/islands/sanctuary/ItemModelPreview";
import { useGsapReveal } from "@/islands/sanctuary/useGsapReveal";
import {
  avatarOptions,
  getRenderableCurrentProfile,
  useSanctuaryStore,
} from "@/lib/sanctuary/store";
import {
  createMissionId,
  formatMissionDuration,
  getDefaultMissionDefinitions,
  getMissionRewardLabel,
  loadMissionDefinitions,
  resetMissionDefinitions,
  saveMissionDefinitions,
  type MissionDefinition,
  type MissionReward,
  type MissionRoomKind,
} from "@/lib/sanctuary/missions";
import type { WardrobeField } from "@/lib/sanctuary/wardrobe";

const roomKindLabels: Record<MissionRoomKind, string> = {
  any: "Cualquier sala",
  solo: "Sala privada personal",
  public: "Biblioteca publica",
  private: "Sala compartida privada",
};

const wardrobeFieldLabels: Record<WardrobeField, string> = {
  upper: "Parte superior",
  lower: "Parte inferior",
  socks: "Calcetines",
  accessory: "Accesorios",
};

function createBlankMission(): MissionDefinition {
  return {
    id: createMissionId(),
    title: "Nueva mision",
    description: "",
    requiredFocusSeconds: 60 * 60,
    requiredSessions: 1,
    roomKind: "any",
    reward: {
      type: "none",
    },
  };
}

function getRewardField(reward: MissionReward): WardrobeField {
  return reward.type === "wardrobe" ? reward.field : "upper";
}

function getRewardValue(reward: MissionReward): string {
  if (reward.type !== "wardrobe") {
    return avatarOptions.upper[0]?.value ?? "shirt-01-longsleeve";
  }

  return reward.value;
}

export function MissionEditor() {
  const sanctuary = useSanctuaryStore();
  const avatar = getRenderableCurrentProfile(sanctuary).avatar;
  const [missions, setMissions] = useState<MissionDefinition[]>(() =>
    loadMissionDefinitions(),
  );
  const [savedMessage, setSavedMessage] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGsapReveal(rootRef);

  const totalRequiredFocus = useMemo(
    () =>
      missions.reduce(
        (sum, mission) => sum + Math.max(0, mission.requiredFocusSeconds),
        0,
      ),
    [missions],
  );

  function updateMission(
    missionId: string,
    updater: (mission: MissionDefinition) => MissionDefinition,
  ) {
    setMissions((current) =>
      current.map((mission) =>
        mission.id === missionId ? updater(mission) : mission,
      ),
    );
    setSavedMessage("");
  }

  function addMission() {
    setMissions((current) => [...current, createBlankMission()]);
    setSavedMessage("");
  }

  function removeMission(missionId: string) {
    setMissions((current) =>
      current.filter((mission) => mission.id !== missionId),
    );
    setSavedMessage("");
  }

  function handleSave() {
    saveMissionDefinitions(missions);
    setSavedMessage("Misiones guardadas.");
  }

  function handleReset() {
    resetMissionDefinitions();
    setMissions(getDefaultMissionDefinitions());
    setSavedMessage("Misiones restauradas.");
  }

  return (
    <div ref={rootRef} className="space-y-6">
      <section className="gsap-rise grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="border border-outline-variant bg-[radial-gradient(circle_at_20%_18%,rgba(105,188,255,0.12),transparent_34%),linear-gradient(180deg,#201714_0%,#17110f_100%)] px-6 py-8 sm:px-8">
          <p className="font-headline text-[10px] font-bold uppercase tracking-[0.24em] text-outline">
            Editor de misiones
          </p>
          <h1 className="mt-2 font-headline text-3xl font-black uppercase tracking-tight text-on-surface">
            Recompensas y requisitos
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
            Desde aqui defines las misiones del santuario, cuanto tiempo piden,
            cuantas sesiones obligan y que prenda desbloquean al completarlas.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="border border-outline-variant bg-surface-container/70 p-4">
              <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-outline">
                Misiones activas
              </p>
              <p className="mt-3 font-headline text-2xl font-black uppercase tracking-tight text-primary">
                {missions.length}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
                Puedes crear, borrar o rehacer todo el circuito de progreso.
              </p>
            </article>
            <article className="border border-outline-variant bg-surface-container/70 p-4">
              <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-outline">
                Tiempo total exigido
              </p>
              <p className="mt-3 font-headline text-2xl font-black uppercase tracking-tight text-secondary">
                {formatMissionDuration(totalRequiredFocus)}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
                Suma del foco pedido por todas las misiones definidas.
              </p>
            </article>
          </div>

          <div className="mt-8 flex min-h-[18rem] items-center justify-center overflow-hidden border border-outline-variant bg-surface-container-low">
            <ItemModelPreview
              field="upper"
              value={avatar.upper}
              avatar={avatar}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="gsap-rise border border-outline-variant bg-surface-container p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-outline">
                  Gestion
                </p>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {savedMessage ||
                    "Guarda cuando termines para dejar la configuracion persistida en local."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={addMission}
                  className="inline-flex items-center gap-2 border border-outline-variant bg-surface-container-low px-4 py-3 font-headline text-xs font-bold uppercase tracking-widest text-on-surface hover:border-secondary"
                >
                  <Plus size={14} />
                  Nueva mision
                </button>
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
                  Guardar
                </button>
              </div>
            </div>
          </div>

          <div className="gsap-rise border border-outline-variant bg-surface-container p-5">
            <div className="flex items-start gap-3">
              <Sparkles size={18} className="mt-0.5 shrink-0 text-tertiary" />
              <div>
                <p className="font-headline text-[10px] font-bold uppercase tracking-[0.24em] text-outline">
                  Consejos de equilibrio
                </p>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  Si una mision desbloquea una pieza rara, conviene que el foco
                  exigido no rompa la progresion del armario. Aqui puedes
                  alinear ambos sistemas sin tocar codigo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gsap-rise space-y-4">
        {missions.map((mission, index) => {
          const rewardField = getRewardField(mission.reward);
          const rewardOptions = avatarOptions[rewardField];
          const rewardValue = getRewardValue(mission.reward);

          return (
            <article
              key={mission.id}
              className="border border-outline-variant bg-surface-container p-4 sm:p-5"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant pb-4">
                <div>
                  <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-outline">
                    Mision {index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                    {getMissionRewardLabel(mission.reward)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMission(mission.id)}
                  className="inline-flex items-center gap-2 border border-error/40 bg-error/10 px-4 py-3 font-headline text-xs font-bold uppercase tracking-widest text-error hover:border-error"
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.18em] text-outline">
                      Titulo
                    </span>
                    <input
                      type="text"
                      value={mission.title}
                      onChange={(event) =>
                        updateMission(mission.id, (current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      className="mt-2 w-full border border-outline-variant bg-surface-container-low px-3 py-3 text-sm text-on-surface"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.18em] text-outline">
                      Tipo de sala
                    </span>
                    <select
                      value={mission.roomKind}
                      onChange={(event) =>
                        updateMission(mission.id, (current) => ({
                          ...current,
                          roomKind: event.target.value as MissionRoomKind,
                        }))
                      }
                      className="mt-2 w-full border border-outline-variant bg-surface-container-low px-3 py-3 text-sm text-on-surface"
                    >
                      {Object.entries(roomKindLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-xs uppercase tracking-[0.18em] text-outline">
                      Descripcion
                    </span>
                    <textarea
                      value={mission.description}
                      onChange={(event) =>
                        updateMission(mission.id, (current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      rows={3}
                      className="mt-2 w-full border border-outline-variant bg-surface-container-low px-3 py-3 text-sm text-on-surface"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.18em] text-outline">
                      Minutos de foco
                    </span>
                    <input
                      type="number"
                      min={15}
                      step={15}
                      value={Math.round(mission.requiredFocusSeconds / 60)}
                      onChange={(event) =>
                        updateMission(mission.id, (current) => ({
                          ...current,
                          requiredFocusSeconds:
                            Math.max(15, Number(event.target.value) || 15) * 60,
                        }))
                      }
                      className="mt-2 w-full border border-outline-variant bg-surface-container-low px-3 py-3 text-sm text-on-surface"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.18em] text-outline">
                      Sesiones necesarias
                    </span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={mission.requiredSessions}
                      onChange={(event) =>
                        updateMission(mission.id, (current) => ({
                          ...current,
                          requiredSessions: Math.max(
                            1,
                            Number(event.target.value) || 1,
                          ),
                        }))
                      }
                      className="mt-2 w-full border border-outline-variant bg-surface-container-low px-3 py-3 text-sm text-on-surface"
                    />
                  </label>
                </div>

                <div className="space-y-4 border border-outline-variant bg-surface-container-low p-4">
                  <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-outline">
                    Recompensa
                  </p>

                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.18em] text-outline">
                      Tipo
                    </span>
                    <select
                      value={mission.reward.type}
                      onChange={(event) =>
                        updateMission(mission.id, (current) => ({
                          ...current,
                          reward:
                            event.target.value === "wardrobe"
                              ? {
                                  type: "wardrobe",
                                  field: "upper",
                                  value:
                                    avatarOptions.upper[0]?.value ??
                                    "shirt-01-longsleeve",
                                }
                              : { type: "none" },
                        }))
                      }
                      className="mt-2 w-full border border-outline-variant bg-surface-container px-3 py-3 text-sm text-on-surface"
                    >
                      <option value="none">Sin recompensa</option>
                      <option value="wardrobe">Prenda del armario</option>
                    </select>
                  </label>

                  {mission.reward.type === "wardrobe" ? (
                    <>
                      <label className="block">
                        <span className="text-xs uppercase tracking-[0.18em] text-outline">
                          Categoria
                        </span>
                        <select
                          value={rewardField}
                          onChange={(event) => {
                            const nextField = event.target
                              .value as WardrobeField;
                            const firstOption = avatarOptions[nextField][0];
                            updateMission(mission.id, (current) => ({
                              ...current,
                              reward: {
                                type: "wardrobe",
                                field: nextField,
                                value: firstOption?.value ?? "ninguno",
                              },
                            }));
                          }}
                          className="mt-2 w-full border border-outline-variant bg-surface-container px-3 py-3 text-sm text-on-surface"
                        >
                          {Object.entries(wardrobeFieldLabels).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ),
                          )}
                        </select>
                      </label>

                      <label className="block">
                        <span className="text-xs uppercase tracking-[0.18em] text-outline">
                          Item
                        </span>
                        <select
                          value={rewardValue}
                          onChange={(event) =>
                            updateMission(mission.id, (current) => ({
                              ...current,
                              reward: {
                                type: "wardrobe",
                                field: rewardField,
                                value: event.target.value,
                              },
                            }))
                          }
                          className="mt-2 w-full border border-outline-variant bg-surface-container px-3 py-3 text-sm text-on-surface"
                        >
                          {rewardOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <div className="border border-outline-variant bg-surface-container p-3">
                        <div className="flex justify-center">
                          <ItemModelPreview
                            field={rewardField}
                            value={rewardValue}
                            avatar={avatar}
                          />
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
                          La mision entrega{" "}
                          {getMissionRewardLabel(mission.reward)}.
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm leading-relaxed text-on-surface-variant">
                      Esta mision no desbloquea ropa todavia.
                    </p>
                  )}

                  <div className="border border-outline-variant bg-surface-container p-3">
                    <p className="font-headline text-[10px] font-bold uppercase tracking-[0.22em] text-outline">
                      Resumen
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                      {formatMissionDuration(mission.requiredFocusSeconds)} ·{" "}
                      {mission.requiredSessions} sesiones ·{" "}
                      {roomKindLabels[mission.roomKind]}.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
