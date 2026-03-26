import { useSyncExternalStore } from "react";

export type AuthMode = "guest" | "account";
export type RoomKind = "solo" | "public" | "private";
export type PresenceState = "idle" | "studying" | "break" | "offline";
export type PresenceSpace = "solo" | "library" | "garden";
export type TimerPhase = "focus" | "break";
export type TimerStatus = "idle" | "running" | "paused";
export type ChronicleTone = "primary" | "secondary" | "tertiary";

export interface AvatarConfig {
  base: "archivo" | "vigia" | "viajera";
  skinTone: "marfil" | "miel" | "bronce" | "umbra";
  hairStyle: "corto" | "ondas" | "coleta" | "capucha";
  hairColor: "obsidiana" | "castano" | "cobre" | "plata";
  facialHair: "ninguno" | "bigote" | "barba-corta";
  outfit: "escriba" | "alquimista" | "guardabosques";
  accessory: "ninguno" | "libro" | "te" | "pluma" | "linterna";
  expression: "sereno" | "despierto" | "picaro";
}

export interface Profile {
  id: string;
  displayName: string;
  handle: string;
  avatar: AvatarConfig;
  bio: string;
  createdAt: number;
  isDemo?: boolean;
}

export interface Room {
  code: string;
  kind: Exclude<RoomKind, "solo">;
  name: string;
  description: string;
  ownerId?: string;
  memberIds: string[];
  createdAt: number;
}

export interface Presence {
  userId: string;
  roomCode: string;
  roomKind: RoomKind;
  state: PresenceState;
  space: PresenceSpace;
  message: string;
  updatedAt: number;
}

export interface TimerState {
  roomKind: RoomKind;
  roomCode: string;
  phase: TimerPhase;
  status: TimerStatus;
  focusDurationSeconds: number;
  breakDurationSeconds: number;
  durationSeconds: number;
  remainingSeconds: number;
  endsAt: number | null;
  updatedAt: number;
}

export interface StudySession {
  id: string;
  userId: string;
  roomCode: string;
  roomKind: RoomKind;
  focusSeconds: number;
  completedAt: number;
}

export interface ChronicleEntry {
  id: string;
  userId: string;
  title: string;
  description: string;
  timestamp: number;
  tone: ChronicleTone;
  origin?: "timer" | "system";
}

export interface AchievementUnlock {
  id: string;
  userId: string;
  unlockedAt: number;
}

export interface SanctuaryState {
  version: number;
  authMode: AuthMode;
  currentUserId: string;
  currentRoomCode: string;
  profiles: Record<string, Profile>;
  rooms: Record<string, Room>;
  presences: Record<string, Presence>;
  timer: TimerState;
  sessions: StudySession[];
  chronicleEntries: ChronicleEntry[];
  achievementUnlocks: AchievementUnlock[];
  friendIds: string[];
}

export interface AvatarOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
}

export const PUBLIC_ROOM_CODE = "gran-lectorio";
export const SOLO_ROOM_CODE = "santuario-silencioso";
export const FOCUS_SECONDS = 25 * 60;
export const BREAK_SECONDS = 5 * 60;

export const avatarOptions = {
  base: [
    { value: "archivo", label: "Archivo", description: "Silueta equilibrada de escriba." },
    { value: "vigia", label: "Vigía", description: "Hombros firmes y capa corta." },
    { value: "viajera", label: "Viajera", description: "Figura ligera y gesto vivaz." },
  ] satisfies AvatarOption<AvatarConfig["base"]>[],
  skinTone: [
    { value: "marfil", label: "Marfil", description: "Claro con luz cálida." },
    { value: "miel", label: "Miel", description: "Tono dorado suave." },
    { value: "bronce", label: "Bronce", description: "Profundo y cálido." },
    { value: "umbra", label: "Umbra", description: "Oscuro con contraste alto." },
  ] satisfies AvatarOption<AvatarConfig["skinTone"]>[],
  hairStyle: [
    { value: "corto", label: "Corto", description: "Recogido y limpio." },
    { value: "ondas", label: "Ondas", description: "Volumen suave." },
    { value: "coleta", label: "Coleta", description: "Recogido largo." },
    { value: "capucha", label: "Capucha", description: "Cubierto por tejido." },
  ] satisfies AvatarOption<AvatarConfig["hairStyle"]>[],
  hairColor: [
    { value: "obsidiana", label: "Obsidiana", description: "Negro profundo." },
    { value: "castano", label: "Castaño", description: "Marrón terroso." },
    { value: "cobre", label: "Cobre", description: "Ámbar rojizo." },
    { value: "plata", label: "Plata", description: "Claro y frío." },
  ] satisfies AvatarOption<AvatarConfig["hairColor"]>[],
  facialHair: [
    { value: "ninguno", label: "Sin vello", description: "Rostro limpio." },
    { value: "bigote", label: "Bigote", description: "Línea fina sobre el labio." },
    { value: "barba-corta", label: "Barba corta", description: "Sombra concentrada." },
  ] satisfies AvatarOption<AvatarConfig["facialHair"]>[],
  outfit: [
    { value: "escriba", label: "Escriba", description: "Tonos dorados y tinta." },
    { value: "alquimista", label: "Alquimista", description: "Capas ciruela y humo." },
    { value: "guardabosques", label: "Guardabosques", description: "Verdes apagados." },
  ] satisfies AvatarOption<AvatarConfig["outfit"]>[],
  accessory: [
    { value: "ninguno", label: "Ninguno", description: "Sin objeto adicional." },
    { value: "libro", label: "Libro", description: "Grimorio de estudio." },
    { value: "te", label: "Té", description: "Taza de pausa." },
    { value: "pluma", label: "Pluma", description: "Anotación rápida." },
    { value: "linterna", label: "Linterna", description: "Luz cálida tenue." },
  ] satisfies AvatarOption<AvatarConfig["accessory"]>[],
  expression: [
    { value: "sereno", label: "Sereno", description: "Reposado y neutral." },
    { value: "despierto", label: "Despierto", description: "Ojos abiertos y alerta." },
    { value: "picaro", label: "Pícaro", description: "Ceja alta y sonrisa leve." },
  ] satisfies AvatarOption<AvatarConfig["expression"]>[],
};

export const achievementDefinitions: AchievementDefinition[] = [
  {
    id: "primera-vigilia",
    title: "Primera vigilia",
    description: "Completa tu primera sesión de foco dentro del santuario.",
  },
  {
    id: "ritmo-de-tres",
    title: "Ritmo de tres",
    description: "Cierra tres sesiones de foco sin abandonar el archivo.",
  },
  {
    id: "hora-consagrada",
    title: "Hora consagrada",
    description: "Acumula al menos una hora completa de estudio con el Pomodoro.",
  },
  {
    id: "llama-constante",
    title: "Llama constante",
    description: "Mantén una racha de tres días activos dentro del santuario.",
  },
];

const STORAGE_KEY = "scholars-sanctuary-state-v3";
const CHANNEL_NAME = "scholars-sanctuary-live";
const DEFAULT_PRIVATE_DESCRIPTION = "Sala reservada para amistades invitadas y foco compartido.";

const guestAvatar: AvatarConfig = {
  base: "archivo",
  skinTone: "miel",
  hairStyle: "corto",
  hairColor: "castano",
  facialHair: "ninguno",
  outfit: "escriba",
  accessory: "libro",
  expression: "sereno",
};

const demoProfiles: Profile[] = [
  {
    id: "demo-lyra",
    displayName: "Lyra de las estanterías",
    handle: "@lyra",
    avatar: {
      base: "viajera",
      skinTone: "marfil",
      hairStyle: "coleta",
      hairColor: "cobre",
      facialHair: "ninguno",
      outfit: "guardabosques",
      accessory: "pluma",
      expression: "picaro",
    },
    bio: "Lleva el pulso del archivo al amanecer.",
    createdAt: Date.now(),
    isDemo: true,
  },
  {
    id: "demo-bruno",
    displayName: "Bruno del campanario",
    handle: "@bruno",
    avatar: {
      base: "vigia",
      skinTone: "bronce",
      hairStyle: "ondas",
      hairColor: "obsidiana",
      facialHair: "bigote",
      outfit: "alquimista",
      accessory: "linterna",
      expression: "despierto",
    },
    bio: "Prefiere estudiar en silencio y descansar entre setos.",
    createdAt: Date.now(),
    isDemo: true,
  },
  {
    id: "demo-ines",
    displayName: "Inés de la mesa larga",
    handle: "@ines",
    avatar: {
      base: "archivo",
      skinTone: "umbra",
      hairStyle: "capucha",
      hairColor: "plata",
      facialHair: "ninguno",
      outfit: "escriba",
      accessory: "libro",
      expression: "sereno",
    },
    bio: "Siempre deja una cita marcada antes de dormir.",
    createdAt: Date.now(),
    isDemo: true,
  },
];

function createInitialState(): SanctuaryState {
  const createdAt = Date.now();
  const profiles = Object.fromEntries(
    [
      {
        id: "guest-current",
        displayName: "Invitado del santuario",
        handle: "@invitado",
        avatar: guestAvatar,
        bio: "Sesiones privadas sin memoria social.",
        createdAt,
      },
      ...demoProfiles,
    ].map((profile) => [profile.id, profile]),
  );

  return {
    version: 4,
    authMode: "guest",
    currentUserId: "guest-current",
    currentRoomCode: PUBLIC_ROOM_CODE,
    profiles,
    rooms: {
      [PUBLIC_ROOM_CODE]: {
        code: PUBLIC_ROOM_CODE,
        kind: "public",
        name: "Gran lectorio compartido",
        description: "La sala pública del santuario donde se ve el pulso del resto.",
        memberIds: demoProfiles.map((profile) => profile.id),
        createdAt,
      },
    },
    presences: {
      "guest-current": {
        userId: "guest-current",
        roomCode: SOLO_ROOM_CODE,
        roomKind: "solo",
        state: "idle",
        space: "solo",
        message: "",
        updatedAt: createdAt,
      },
      "demo-lyra": {
        userId: "demo-lyra",
        roomCode: PUBLIC_ROOM_CODE,
        roomKind: "public",
        state: "studying",
        space: "library",
        message: "Estudiando",
        updatedAt: createdAt,
      },
      "demo-bruno": {
        userId: "demo-bruno",
        roomCode: PUBLIC_ROOM_CODE,
        roomKind: "public",
        state: "break",
        space: "garden",
        message: "Vuelvo en cinco minutos",
        updatedAt: createdAt,
      },
      "demo-ines": {
        userId: "demo-ines",
        roomCode: PUBLIC_ROOM_CODE,
        roomKind: "public",
        state: "studying",
        space: "library",
        message: "Estudiando",
        updatedAt: createdAt,
      },
    },
    timer: {
      roomKind: "solo",
      roomCode: SOLO_ROOM_CODE,
      phase: "focus",
      status: "idle",
      focusDurationSeconds: FOCUS_SECONDS,
      breakDurationSeconds: BREAK_SECONDS,
      durationSeconds: FOCUS_SECONDS,
      remainingSeconds: FOCUS_SECONDS,
      endsAt: null,
      updatedAt: createdAt,
    },
    sessions: [],
    chronicleEntries: [],
    achievementUnlocks: [],
    friendIds: demoProfiles.map((profile) => profile.id),
  };
}

function toHandle(value: string) {
  return `@${value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "escriba"}`;
}

function createPrivateCode(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 18);

  return slug ? `sala-${slug}` : `sala-${Math.random().toString(36).slice(2, 8)}`;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function cloneState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readStoredState() {
  if (!isBrowser()) {
    return createInitialState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(raw) as SanctuaryState;
    if (parsed.version !== 3 && parsed.version !== 4) {
      return createInitialState();
    }

    parsed.version = 4;
    parsed.timer.focusDurationSeconds = parsed.timer.focusDurationSeconds ?? FOCUS_SECONDS;
    parsed.timer.breakDurationSeconds = parsed.timer.breakDurationSeconds ?? BREAK_SECONDS;
    parsed.timer.durationSeconds =
      parsed.timer.durationSeconds ??
      (parsed.timer.phase === "break" ? parsed.timer.breakDurationSeconds : parsed.timer.focusDurationSeconds);
    parsed.timer.remainingSeconds =
      parsed.timer.remainingSeconds ??
      (parsed.timer.phase === "break" ? parsed.timer.breakDurationSeconds : parsed.timer.focusDurationSeconds);

    return parsed;
  } catch {
    return createInitialState();
  }
}

function getRoomKindFromCode(state: SanctuaryState, code: string): RoomKind {
  if (code === SOLO_ROOM_CODE) {
    return "solo";
  }

  return state.rooms[code]?.kind ?? "private";
}

function getCurrentProfile(state: SanctuaryState) {
  return state.profiles[state.currentUserId];
}

function getRoomLabel(state: SanctuaryState, roomCode: string) {
  if (roomCode === SOLO_ROOM_CODE) {
    return "Santuario silencioso";
  }
  return state.rooms[roomCode]?.name ?? "Sala reservada";
}

function setCurrentPresence(state: SanctuaryState, next: Partial<Presence>) {
  const current = state.presences[state.currentUserId] ?? {
    userId: state.currentUserId,
    roomCode: SOLO_ROOM_CODE,
    roomKind: "solo" as RoomKind,
    state: "idle" as PresenceState,
    space: "solo" as PresenceSpace,
    message: "",
    updatedAt: Date.now(),
  };

  state.presences[state.currentUserId] = {
    ...current,
    ...next,
    updatedAt: Date.now(),
  };
}

function recalculateAchievements(state: SanctuaryState, userId: string) {
  const sessions = state.sessions.filter((session) => session.userId === userId);
  const totalFocusSeconds = sessions.reduce((total, session) => total + session.focusSeconds, 0);
  const streakDays = getStreakDays(sessions);
  const unlocked = new Set(state.achievementUnlocks.filter((entry) => entry.userId === userId).map((entry) => entry.id));
  const maybeUnlock = (id: string) => {
    if (!unlocked.has(id)) {
      state.achievementUnlocks.unshift({ id, userId, unlockedAt: Date.now() });
      unlocked.add(id);
    }
  };

  if (sessions.length >= 1) maybeUnlock("primera-vigilia");
  if (sessions.length >= 3) maybeUnlock("ritmo-de-tres");
  if (totalFocusSeconds >= 60 * 60) maybeUnlock("hora-consagrada");
  if (streakDays >= 3) maybeUnlock("llama-constante");
}

function pushChronicle(
  state: SanctuaryState,
  userId: string,
  title: string,
  description: string,
  tone: ChronicleTone,
  origin: ChronicleEntry["origin"] = "system",
) {
  state.chronicleEntries.unshift({
    id: crypto.randomUUID(),
    userId,
    title,
    description,
    timestamp: Date.now(),
    tone,
    origin,
  });
}

function completeFocusSession(state: SanctuaryState) {
  const userId = state.currentUserId;
  state.sessions.unshift({
    id: crypto.randomUUID(),
    userId,
    roomCode: state.timer.roomCode,
    roomKind: state.timer.roomKind,
    focusSeconds: state.timer.focusDurationSeconds,
    completedAt: Date.now(),
  });

  pushChronicle(
    state,
    userId,
    "Vigilia cerrada",
    `Has completado una sesión de foco en ${getRoomLabel(state, state.timer.roomCode).toLowerCase()}.`,
    state.timer.roomKind === "solo" ? "primary" : "tertiary",
    "timer",
  );

  recalculateAchievements(state, userId);
}

function transitionToBreak(state: SanctuaryState) {
  state.timer = {
    ...state.timer,
    phase: "break",
    status: "running",
    durationSeconds: state.timer.breakDurationSeconds,
    remainingSeconds: state.timer.breakDurationSeconds,
    endsAt: Date.now() + state.timer.breakDurationSeconds * 1000,
    updatedAt: Date.now(),
  };

  setCurrentPresence(state, {
    roomCode: state.timer.roomCode,
    roomKind: state.timer.roomKind,
    state: "break",
    space: state.timer.roomKind === "solo" ? "solo" : "garden",
    message: state.timer.roomKind === "solo" ? "" : "Descansando",
  });
}

function resetFocusState(state: SanctuaryState) {
  state.timer = {
    ...state.timer,
    phase: "focus",
    status: "idle",
    durationSeconds: state.timer.focusDurationSeconds,
    remainingSeconds: state.timer.focusDurationSeconds,
    endsAt: null,
    updatedAt: Date.now(),
  };

  setCurrentPresence(state, {
    roomCode: state.timer.roomKind === "solo" ? SOLO_ROOM_CODE : state.timer.roomCode,
    roomKind: state.timer.roomKind,
    state: "idle",
    space: state.timer.roomKind === "solo" ? "solo" : "library",
    message: "",
  });
}

function syncExpiredTimer(state: SanctuaryState, now = Date.now()) {
  if (state.timer.status !== "running" || !state.timer.endsAt) {
    return;
  }

  while (state.timer.status === "running" && state.timer.endsAt && now >= state.timer.endsAt) {
    if (state.timer.phase === "focus") {
      completeFocusSession(state);
      transitionToBreak(state);
      continue;
    }

    resetFocusState(state);
    break;
  }
}

function getTimeLeft(state: SanctuaryState, now = Date.now()) {
  if (state.timer.status !== "running" || !state.timer.endsAt) {
    return state.timer.remainingSeconds;
  }

  return Math.max(0, Math.ceil((state.timer.endsAt - now) / 1000));
}

function getDistinctSessionDays(sessions: StudySession[]) {
  const days = new Set(
    sessions.map((session) => {
      const date = new Date(session.completedAt);
      return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
    }),
  );
  return days.size;
}

function getStreakDays(sessions: StudySession[]) {
  if (sessions.length === 0) {
    return 0;
  }

  const dayKeys = Array.from(
    new Set(
      sessions
        .map((session) => {
          const date = new Date(session.completedAt);
          return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        })
        .sort((a, b) => b - a),
    ),
  );

  let streak = 0;
  let cursor = dayKeys[0];

  for (const day of dayKeys) {
    if (day === cursor) {
      streak += 1;
      cursor -= 24 * 60 * 60 * 1000;
      continue;
    }
    break;
  }

  return streak;
}

let currentState = createInitialState();
let hydrated = false;
let channel: BroadcastChannel | null = null;
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function persistState() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  channel?.postMessage(currentState);
}

function ensureHydrated() {
  if (!isBrowser() || hydrated) {
    return;
  }

  hydrated = true;
  currentState = readStoredState();
  channel = new BroadcastChannel(CHANNEL_NAME);

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) {
      return;
    }

    try {
      currentState = JSON.parse(event.newValue) as SanctuaryState;
      emitChange();
    } catch {
      currentState = createInitialState();
      emitChange();
    }
  });

  channel.addEventListener("message", (event) => {
    currentState = event.data as SanctuaryState;
    emitChange();
  });
}

function commit(mutator: (draft: SanctuaryState) => void) {
  ensureHydrated();
  const draft = cloneState(currentState);
  syncExpiredTimer(draft);
  mutator(draft);
  currentState = draft;
  persistState();
  emitChange();
}

function subscribe(listener: () => void) {
  ensureHydrated();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  ensureHydrated();
  return currentState;
}

export function useSanctuaryStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => currentState);
}

export function getCurrentTimer(state: SanctuaryState, now = Date.now()) {
  const snapshot = cloneState(state);
  syncExpiredTimer(snapshot, now);
  return {
    ...snapshot.timer,
    remainingSeconds: getTimeLeft(snapshot, now),
    roomLabel: getRoomLabel(snapshot, snapshot.timer.roomCode),
  };
}

export function getCurrentProfileSummary(state: SanctuaryState) {
  const profile = getCurrentProfile(state);
  const sessions = state.sessions.filter((session) => session.userId === profile.id);
  const validAchievementIds = new Set(achievementDefinitions.map((achievement) => achievement.id));
  const achievements = state.achievementUnlocks.filter(
    (entry) => entry.userId === profile.id && validAchievementIds.has(entry.id),
  );
  const latestChronicle =
    state.chronicleEntries.find((entry) => entry.userId === profile.id && entry.origin === "timer") ?? null;

  return {
    profile,
    sessionsCount: sessions.length,
    focusHours: (sessions.reduce((total, session) => total + session.focusSeconds, 0) / 3600).toFixed(1),
    streakDays: getStreakDays(sessions),
    archiveDays: getDistinctSessionDays(sessions),
    achievementsCount: achievements.length,
    latestChronicle,
  };
}

export function getChroniclesForCurrentProfile(state: SanctuaryState) {
  return state.chronicleEntries.filter((entry) => entry.userId === state.currentUserId && entry.origin === "timer");
}

export function getAchievementsForCurrentProfile(state: SanctuaryState) {
  const unlocked = new Map(
    state.achievementUnlocks
      .filter((entry) => entry.userId === state.currentUserId)
      .map((entry) => [entry.id, entry.unlockedAt]),
  );

  return achievementDefinitions.map((achievement) => ({
    ...achievement,
    unlockedAt: unlocked.get(achievement.id) ?? null,
  }));
}

export function getCurrentRoom(state: SanctuaryState) {
  return state.rooms[state.currentRoomCode] ?? null;
}

export function getPrivateRoomsForCurrentProfile(state: SanctuaryState) {
  return Object.values(state.rooms)
    .filter((room) => room.kind === "private" && room.memberIds.includes(state.currentUserId))
    .sort((left, right) => right.createdAt - left.createdAt);
}

export function getFriendsForCurrentProfile(state: SanctuaryState) {
  return state.friendIds.map((id) => state.profiles[id]).filter(Boolean);
}

export function getRoomMembers(state: SanctuaryState, roomCode: string, space: PresenceSpace) {
  const room = state.rooms[roomCode];
  const members = Object.values(state.presences)
    .filter((presence) => presence.roomCode === roomCode && presence.space === space && presence.state !== "offline")
    .map((presence) => ({
      presence,
      profile: state.profiles[presence.userId],
      isCurrentUser: presence.userId === state.currentUserId,
    }))
    .filter((entry) => entry.profile);

  if (room) {
    room.memberIds.forEach((memberId) => {
      if (members.some((entry) => entry.profile.id === memberId)) {
        return;
      }

      const existingPresenceInRoom = Object.values(state.presences).find(
        (presence) => presence.userId === memberId && presence.roomCode === roomCode,
      );
      if (existingPresenceInRoom) {
        return;
      }

      const profile = state.profiles[memberId];
      if (!profile) {
        return;
      }

      members.push({
        profile,
        presence: {
          userId: memberId,
          roomCode,
          roomKind: room.kind,
          state: "idle",
          space: "library",
          message: "",
          updatedAt: room.createdAt,
        },
        isCurrentUser: memberId === state.currentUserId,
      });
    });
  }

  return members
    .filter((entry) => entry.presence.space === space)
    .sort((left, right) => Number(right.isCurrentUser) - Number(left.isCurrentUser));
}

export const sanctuaryActions = {
  activateLocalAccount(displayName: string) {
    commit((state) => {
      const trimmed = displayName.trim() || "Escriba mayor";
      const previousUserId = state.currentUserId;
      const guest = state.profiles["guest-current"];
      const accountId = `account-${trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "local"}`;
      const alreadyExists = state.profiles[accountId];

      state.authMode = "account";
      state.currentUserId = accountId;
      state.currentRoomCode = PUBLIC_ROOM_CODE;
      state.profiles[accountId] = alreadyExists ?? {
        id: accountId,
        displayName: trimmed,
        handle: toHandle(trimmed),
        avatar: guest?.avatar ?? guestAvatar,
        bio: "Cuenta local del santuario con acceso a espacios sociales.",
        createdAt: Date.now(),
      };

      if (!state.rooms[PUBLIC_ROOM_CODE].memberIds.includes(accountId)) {
        state.rooms[PUBLIC_ROOM_CODE].memberIds.unshift(accountId);
      }

      if (previousUserId && state.presences[previousUserId]) {
        state.presences[previousUserId] = {
          ...state.presences[previousUserId],
          state: "offline",
          message: "",
          updatedAt: Date.now(),
        };
      }

      setCurrentPresence(state, {
        roomCode: PUBLIC_ROOM_CODE,
        roomKind: "public",
        state: "idle",
        space: "library",
        message: "",
      });

      resetFocusState(state);
    });
  },

  returnToGuestMode() {
    commit((state) => {
      const previousUserId = state.currentUserId;
      state.authMode = "guest";
      state.currentUserId = "guest-current";
      state.currentRoomCode = PUBLIC_ROOM_CODE;
      if (previousUserId !== "guest-current" && state.presences[previousUserId]) {
        state.presences[previousUserId] = {
          ...state.presences[previousUserId],
          state: "offline",
          message: "",
          updatedAt: Date.now(),
        };
      }
      resetFocusState(state);
      setCurrentPresence(state, {
        roomCode: SOLO_ROOM_CODE,
        roomKind: "solo",
        state: "idle",
        space: "solo",
        message: "",
      });
    });
  },

  renameCurrentProfile(displayName: string) {
    commit((state) => {
      const trimmed = displayName.trim();
      if (!trimmed) {
        return;
      }
      state.profiles[state.currentUserId] = {
        ...state.profiles[state.currentUserId],
        displayName: trimmed,
        handle: toHandle(trimmed),
      };
    });
  },

  updateAvatar<K extends keyof AvatarConfig>(field: K, value: AvatarConfig[K]) {
    commit((state) => {
      state.profiles[state.currentUserId] = {
        ...state.profiles[state.currentUserId],
        avatar: {
          ...state.profiles[state.currentUserId].avatar,
          [field]: value,
        },
      };
    });
  },

  selectPublicRoom() {
    commit((state) => {
      if (state.authMode !== "account") {
        return;
      }
      state.currentRoomCode = PUBLIC_ROOM_CODE;
      if (!state.rooms[PUBLIC_ROOM_CODE].memberIds.includes(state.currentUserId)) {
        state.rooms[PUBLIC_ROOM_CODE].memberIds.unshift(state.currentUserId);
      }
      setCurrentPresence(state, {
        roomCode: PUBLIC_ROOM_CODE,
        roomKind: "public",
        state: state.timer.phase === "break" ? "break" : "idle",
        space: state.timer.phase === "break" ? "garden" : "library",
      });
    });
  },

  createPrivateRoom(name: string, invitedIds: string[]) {
    commit((state) => {
      if (state.authMode !== "account") {
        return;
      }

      const trimmed = name.trim() || "Círculo privado";
      const code = createPrivateCode(trimmed);
      const memberIds = Array.from(new Set([state.currentUserId, ...invitedIds.filter(Boolean)]));

      state.rooms[code] = {
        code,
        kind: "private",
        name: trimmed,
        description: DEFAULT_PRIVATE_DESCRIPTION,
        ownerId: state.currentUserId,
        memberIds,
        createdAt: Date.now(),
      };
      state.currentRoomCode = code;

      invitedIds.forEach((friendId, index) => {
        if (!state.profiles[friendId]) {
          return;
        }
        state.presences[friendId] = {
          userId: friendId,
          roomCode: code,
          roomKind: "private",
          state: index % 2 === 0 ? "idle" : "break",
          space: index % 2 === 0 ? "library" : "garden",
          message: index % 2 === 0 ? "" : "Nos vemos en la pausa",
          updatedAt: Date.now(),
        };
      });

      setCurrentPresence(state, {
        roomCode: code,
        roomKind: "private",
        state: "idle",
        space: "library",
        message: "",
      });

      recalculateAchievements(state, state.currentUserId);
    });
  },

  joinPrivateRoom(code: string) {
    commit((state) => {
      if (state.authMode !== "account") {
        return;
      }

      const room = state.rooms[code.trim()];
      if (!room || room.kind !== "private") {
        return;
      }

      if (!room.memberIds.includes(state.currentUserId)) {
        room.memberIds.unshift(state.currentUserId);
      }

      state.currentRoomCode = room.code;
      setCurrentPresence(state, {
        roomCode: room.code,
        roomKind: "private",
        state: "idle",
        space: "library",
        message: "",
      });
    });
  },

  setQuickMessage(message: string) {
    commit((state) => {
      const trimmed = message.trim().slice(0, 80);
      if (state.authMode !== "account" || state.timer.roomKind === "solo") {
        return;
      }

      setCurrentPresence(state, {
        roomCode: state.currentRoomCode,
        roomKind: getRoomKindFromCode(state, state.currentRoomCode),
        state: state.timer.phase === "break" ? "break" : "idle",
        space: state.timer.phase === "break" ? "garden" : "library",
        message: trimmed,
      });
    });
  },

  clearQuickMessage() {
    commit((state) => {
      setCurrentPresence(state, { message: "" });
    });
  },

  startTimer(roomKind: RoomKind, roomCode: string) {
    commit((state) => {
      state.timer.roomKind = roomKind;
      state.timer.roomCode = roomCode;
      state.timer.status = "running";
      state.timer.endsAt = Date.now() + getTimeLeft(state) * 1000;
      state.timer.updatedAt = Date.now();

      setCurrentPresence(state, {
        roomCode,
        roomKind,
        state: state.timer.phase === "break" ? "break" : "studying",
        space: roomKind === "solo" ? "solo" : state.timer.phase === "break" ? "garden" : "library",
        message: state.timer.phase === "break" ? state.presences[state.currentUserId]?.message || "Descansando" : "Estudiando",
      });
    });
  },

  pauseTimer() {
    commit((state) => {
      const remainingSeconds = getTimeLeft(state);
      state.timer.status = "paused";
      state.timer.remainingSeconds = remainingSeconds;
      state.timer.endsAt = null;
      state.timer.updatedAt = Date.now();

      setCurrentPresence(state, {
        state: state.timer.phase === "break" ? "break" : "idle",
        message: state.timer.phase === "break" ? state.presences[state.currentUserId]?.message || "Descansando" : "",
      });
    });
  },

  resetTimer(roomKind: RoomKind, roomCode: string) {
    commit((state) => {
      state.timer = {
        roomKind,
        roomCode,
        phase: "focus",
        status: "idle",
        focusDurationSeconds: state.timer.focusDurationSeconds,
        breakDurationSeconds: state.timer.breakDurationSeconds,
        durationSeconds: state.timer.focusDurationSeconds,
        remainingSeconds: state.timer.focusDurationSeconds,
        endsAt: null,
        updatedAt: Date.now(),
      };

      setCurrentPresence(state, {
        roomCode,
        roomKind,
        state: "idle",
        space: roomKind === "solo" ? "solo" : "library",
        message: "",
      });
    });
  },

  updateTimerDurations(focusMinutes: number, breakMinutes: number) {
    commit((state) => {
      const safeFocusMinutes = Number.isFinite(focusMinutes) ? focusMinutes : state.timer.focusDurationSeconds / 60;
      const safeBreakMinutes = Number.isFinite(breakMinutes) ? breakMinutes : state.timer.breakDurationSeconds / 60;
      const nextFocusSeconds = Math.min(180, Math.max(5, Math.round(safeFocusMinutes))) * 60;
      const nextBreakSeconds = Math.min(60, Math.max(1, Math.round(safeBreakMinutes))) * 60;

      state.timer.focusDurationSeconds = nextFocusSeconds;
      state.timer.breakDurationSeconds = nextBreakSeconds;

      if (state.timer.status === "running") {
        return;
      }

      const nextDuration = state.timer.phase === "break" ? nextBreakSeconds : nextFocusSeconds;
      state.timer.durationSeconds = nextDuration;
      state.timer.remainingSeconds = nextDuration;
      state.timer.endsAt = null;
      state.timer.updatedAt = Date.now();
    });
  },

  syncTimer() {
    commit((state) => {
      syncExpiredTimer(state);
      if (state.timer.status === "running") {
        state.timer.remainingSeconds = getTimeLeft(state);
      }
    });
  },
};
