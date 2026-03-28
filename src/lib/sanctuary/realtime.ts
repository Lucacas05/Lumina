import type { ClientMessage, ServerMessage, PresenceState, TimerPhase, TimerStatus } from "@/lib/server/ws-types";
import { sanctuaryActions } from "@/lib/sanctuary/store";

let ws: WebSocket | null = null;
let currentRoomCode: string | null = null;
let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let pingTimer: ReturnType<typeof setInterval> | null = null;
const messageListeners = new Set<(msg: ServerMessage) => void>();

const MAX_RECONNECT_DELAY = 30_000;

function isBrowser() {
  return typeof window !== "undefined";
}

function clearTimers() {
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  if (pingTimer !== null) {
    clearInterval(pingTimer);
    pingTimer = null;
  }
}

function scheduleReconnect() {
  if (reconnectTimer !== null) {
    return;
  }

  const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), MAX_RECONNECT_DELAY);
  reconnectAttempts += 1;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, delay);
}

function handleMessage(event: MessageEvent) {
  let msg: ServerMessage;

  try {
    msg = JSON.parse(event.data as string) as ServerMessage;
  } catch {
    return;
  }

  switch (msg.type) {
    case "room-state":
      sanctuaryActions.setRemotePresences(msg.members);
      break;
    case "member-joined":
      sanctuaryActions.addRemotePresence(msg.member);
      break;
    case "member-left":
      sanctuaryActions.removeRemotePresence(msg.userId);
      break;
    case "presence-changed":
      sanctuaryActions.updateRemotePresence(msg);
      break;
    case "pong":
      break;
    case "error":
      console.warn("[realtime] server error:", msg.message);
      break;
    default:
      break;
  }

  messageListeners.forEach((listener) => listener(msg));
}

export function connect() {
  if (!isBrowser()) {
    return;
  }

  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
    return;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${protocol}//${window.location.host}/ws`;

  try {
    ws = new WebSocket(url);
  } catch {
    scheduleReconnect();
    return;
  }

  ws.addEventListener("open", () => {
    reconnectAttempts = 0;

    pingTimer = setInterval(() => {
      send({ type: "ping" });
    }, 25_000);

    if (currentRoomCode) {
      send({ type: "join-room", roomCode: currentRoomCode });
    }
  });

  ws.addEventListener("close", () => {
    clearTimers();
    ws = null;
    scheduleReconnect();
  });

  ws.addEventListener("error", () => {
    // close handler will schedule reconnect
  });

  ws.addEventListener("message", handleMessage);
}

export function disconnect() {
  clearTimers();
  currentRoomCode = null;
  reconnectAttempts = 0;

  if (ws) {
    ws.close();
    ws = null;
  }
}

export function send(msg: ClientMessage) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}

export function joinRoom(roomCode: string) {
  currentRoomCode = roomCode;
  send({ type: "join-room", roomCode });
}

export function leaveRoom() {
  send({ type: "leave-room" });
  currentRoomCode = null;
}

export function sendPresenceUpdate(
  state: PresenceState,
  phase: TimerPhase,
  status: TimerStatus,
  remainingSeconds: number,
  message: string,
) {
  send({
    type: "presence-update",
    state,
    phase,
    status,
    remainingSeconds,
    message,
  });
}

export function onMessage(listener: (msg: ServerMessage) => void) {
  messageListeners.add(listener);
  return () => {
    messageListeners.delete(listener);
  };
}

export function isConnected() {
  return ws?.readyState === WebSocket.OPEN;
}
