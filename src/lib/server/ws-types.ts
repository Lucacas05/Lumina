import type { AvatarConfig } from "@/lib/sanctuary/store";

export type PresenceState = "idle" | "studying" | "break" | "away" | "offline";
export type TimerPhase = "focus" | "break";
export type TimerStatus = "idle" | "running" | "paused";

export interface UserSummary {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface RoomMemberPresence {
  userId: string;
  username: string;
  displayName: string;
  avatar: AvatarConfig;
  state: PresenceState;
  phase: TimerPhase;
  status: TimerStatus;
  remainingSeconds: number;
  message: string;
  lastSeenAt?: string | null;
}

// Client -> Server
export type ClientMessage =
  | { type: "join-room"; roomCode: string }
  | { type: "leave-room" }
  | {
      type: "presence-update";
      state: PresenceState;
      phase: TimerPhase;
      status: TimerStatus;
      remainingSeconds: number;
      message: string;
    }
  | { type: "ping" };

// Server -> Client
export type ServerMessage =
  | { type: "room-state"; members: RoomMemberPresence[] }
  | { type: "member-joined"; member: RoomMemberPresence }
  | { type: "member-left"; userId: string }
  | {
      type: "presence-changed";
      userId: string;
      state: PresenceState;
      phase: TimerPhase;
      status: TimerStatus;
      remainingSeconds: number;
      message: string;
      lastSeenAt?: string | null;
    }
  | { type: "friend-request"; from: UserSummary }
  | {
      type: "room-invitation";
      roomCode: string;
      roomName: string;
      from: UserSummary;
    }
  | { type: "pong" }
  | { type: "error"; message: string };
