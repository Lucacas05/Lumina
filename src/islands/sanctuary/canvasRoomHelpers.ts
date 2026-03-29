import type { Profile, Presence } from "@/lib/sanctuary/store";
import { getSceneMap } from "@/lib/sanctuary/canvas/sceneMaps";
import type {
  CanvasRemotePlayer,
  Facing,
  SceneKind,
} from "@/lib/sanctuary/canvas/types";

export interface SceneMemberLike {
  profile: Profile;
  presence: Presence;
  isCurrentUser: boolean;
}

function hashString(value: string) {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function buildStableRemoteSlotMap(sceneKind: SceneKind, ids: string[]) {
  const slots = getSceneMap(sceneKind).remoteSlots;
  const assignments = new Map<string, (typeof slots)[number]>();

  if (slots.length === 0) {
    return assignments;
  }

  const taken = new Set<number>();
  const orderedIds = [...ids].sort((left, right) => {
    const leftHash = hashString(left);
    const rightHash = hashString(right);

    if (leftHash !== rightHash) {
      return leftHash - rightHash;
    }

    return left.localeCompare(right, "es");
  });

  orderedIds.forEach((id) => {
    const preferred = hashString(id) % slots.length;
    let chosenIndex = preferred;

    for (let offset = 0; offset < slots.length; offset += 1) {
      const candidate = (preferred + offset) % slots.length;

      if (!taken.has(candidate)) {
        chosenIndex = candidate;
        taken.add(candidate);
        break;
      }
    }

    assignments.set(id, slots[chosenIndex]);
  });

  return assignments;
}

function getRemoteFacing(
  sceneKind: SceneKind,
  slotIndex: number,
  fallback: Facing,
) {
  return getSceneMap(sceneKind).remoteSlotFacings?.[slotIndex] ?? fallback;
}

export function toCanvasRemotePlayers(
  sceneKind: SceneKind,
  members: SceneMemberLike[],
): CanvasRemotePlayer[] {
  const remoteMembers = members.filter((member) => !member.isCurrentUser);
  const slotMap = buildStableRemoteSlotMap(
    sceneKind,
    remoteMembers.map((member) => member.profile.id),
  );

  return remoteMembers.map((member, index) => {
    const slot = slotMap.get(member.profile.id);
    const fallbackFacing =
      member.presence.state === "studying"
        ? "up"
        : index % 2 === 0
          ? "left"
          : "right";

    if (!slot) {
      return {
        id: member.profile.id,
        displayName: member.profile.displayName,
        avatar: member.profile.avatar,
        tileX: 10,
        tileY: 9,
        facing: fallbackFacing,
        state:
          member.presence.state === "offline" ||
          member.presence.state === "away"
            ? "idle"
            : member.presence.state,
        message: member.presence.message,
      };
    }

    return {
      id: member.profile.id,
      displayName: member.profile.displayName,
      avatar: member.profile.avatar,
      tileX: slot.x,
      tileY: slot.y,
      facing:
        member.presence.state === "studying"
          ? getRemoteFacing(
              sceneKind,
              getSceneMap(sceneKind).remoteSlots.findIndex(
                (candidate) => candidate.x === slot.x && candidate.y === slot.y,
              ),
              fallbackFacing,
            )
          : fallbackFacing,
      state:
        member.presence.state === "offline" || member.presence.state === "away"
          ? "idle"
          : member.presence.state,
      message: member.presence.message,
    };
  });
}
