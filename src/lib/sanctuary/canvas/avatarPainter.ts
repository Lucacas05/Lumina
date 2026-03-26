import type { AvatarConfig } from "@/lib/sanctuary/store";
import type { ActorPose, ActorState, Facing } from "@/lib/sanctuary/canvas/types";

interface DrawAvatarOptions {
  avatar: AvatarConfig;
  state: ActorState;
  pose: ActorPose;
  facing: Facing;
  x: number;
  y: number;
  tick: number;
  highlighted?: boolean;
}

const skinTones = {
  marfil: "#f4d2b7",
  miel: "#d9a16a",
  bronce: "#9d6841",
  umbra: "#5e3b27",
} as const;

const hairTones = {
  obsidiana: "#22181b",
  castano: "#5d4030",
  cobre: "#9a4d1b",
  plata: "#d1d5db",
} as const;

const outfitTones = {
  escriba: { primary: "#88603c", trim: "#ffb961", shadow: "#5f3c22" },
  alquimista: { primary: "#5b3e63", trim: "#e7bdb1", shadow: "#36203e" },
  guardabosques: { primary: "#35523a", trim: "#add0a8", shadow: "#223526" },
} as const;

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawAccessory(
  ctx: CanvasRenderingContext2D,
  avatar: AvatarConfig,
  x: number,
  y: number,
  facing: Facing,
  trimColor: string,
) {
  const offsetX = facing === "left" ? -8 : facing === "right" ? 8 : 7;
  const offsetY = facing === "up" ? 1 : 3;
  const baseX = Math.round(x + offsetX);
  const baseY = Math.round(y + offsetY);

  switch (avatar.accessory) {
    case "libro":
      px(ctx, baseX, baseY, 6, 8, "#6d4528");
      px(ctx, baseX + 1, baseY + 1, 1, 6, trimColor);
      px(ctx, baseX + 3, baseY + 1, 2, 1, "#f6d59c");
      break;
    case "te":
      px(ctx, baseX, baseY + 2, 5, 4, "#d4b88a");
      px(ctx, baseX + 4, baseY + 2, 2, 3, "#8c693e");
      px(ctx, baseX + 2, baseY, 1, 2, "#f2efe9");
      break;
    case "pluma":
      px(ctx, baseX + 2, baseY, 2, 7, "#e8e1f0");
      px(ctx, baseX + 1, baseY + 5, 1, 3, "#8a5a38");
      break;
    case "linterna":
      px(ctx, baseX + 1, baseY, 3, 2, "#8a5a38");
      px(ctx, baseX, baseY + 2, 5, 6, "#f7d191");
      px(ctx, baseX + 1, baseY + 3, 3, 3, "#ffbf62");
      break;
    default:
      break;
  }
}

export function drawPixelAvatar(ctx: CanvasRenderingContext2D, options: DrawAvatarOptions) {
  const { avatar, state, pose, facing, x, y, tick, highlighted = false } = options;
  const outfit = outfitTones[avatar.outfit];
  const skin = skinTones[avatar.skinTone];
  const hair = avatar.hairStyle === "capucha" ? outfit.trim : hairTones[avatar.hairColor];
  const bodyWidth = avatar.base === "vigia" ? 11 : avatar.base === "viajera" ? 9 : 10;
  const bodyX = Math.round(x - bodyWidth / 2);
  const bodyY = Math.round(y - (pose === "sitting" ? 14 : 18));
  const headX = Math.round(x - 4);
  const headY = bodyY - 7;
  const stepFrame = Math.round((tick / 160) % 2);
  const walkOffset = pose === "walk" ? (stepFrame === 0 ? -1 : 1) : 0;
  const bob = pose === "walk" ? (stepFrame === 0 ? 0 : 1) : state === "break" ? Math.round(Math.sin(tick / 260) * 0.8) : 0;

  px(ctx, x - 7, y - 1, 14, 3, "rgba(0,0,0,0.32)");

  if (highlighted) {
    px(ctx, x - 9, y + 3, 18, 2, "#ffb961");
  }

  if (pose !== "sitting") {
    px(ctx, x - 4 + walkOffset, y - 7, 3, 7, outfit.shadow);
    px(ctx, x + 1 - walkOffset, y - 7, 3, 7, outfit.shadow);
  } else {
    px(ctx, x - 6, y - 5, 12, 4, "#4a3526");
    px(ctx, x - 4, y - 1, 3, 3, outfit.shadow);
    px(ctx, x + 1, y - 1, 3, 3, outfit.shadow);
  }

  px(ctx, bodyX, bodyY + bob, bodyWidth, pose === "sitting" ? 10 : 12, outfit.primary);
  px(ctx, bodyX + 1, bodyY + bob + 1, bodyWidth - 2, 2, outfit.trim);
  px(ctx, x - 1, bodyY + bob + 2, 2, pose === "sitting" ? 8 : 10, outfit.shadow);

  if (avatar.base === "vigia") {
    px(ctx, bodyX - 1, bodyY + bob + 2, 2, 8, outfit.shadow);
    px(ctx, bodyX + bodyWidth - 1, bodyY + bob + 2, 2, 8, outfit.shadow);
  }

  if (avatar.base === "viajera") {
    px(ctx, bodyX + bodyWidth - 2, bodyY + bob + 10, 2, 2, outfit.trim);
  }

  px(ctx, headX, headY + bob, 8, 8, skin);
  px(ctx, headX, headY + bob, 8, 3, hair);

  if (avatar.hairStyle === "ondas") {
    px(ctx, headX - 1, headY + bob + 2, 2, 4, hair);
    px(ctx, headX + 7, headY + bob + 2, 2, 4, hair);
  }

  if (avatar.hairStyle === "coleta") {
    px(ctx, headX + (facing === "left" ? 0 : 7), headY + bob + 3, 2, 6, hair);
  }

  if (avatar.hairStyle === "capucha") {
    px(ctx, headX - 1, headY + bob, 10, 6, outfit.primary);
    px(ctx, headX + 1, headY + bob + 2, 6, 3, hair);
  }

  const eyeColor = avatar.expression === "despierto" ? "#261a17" : "#4d3a33";
  px(ctx, headX + 2, headY + bob + 4, 1, 1, eyeColor);
  px(ctx, headX + 5, headY + bob + 4, 1, 1, eyeColor);
  px(ctx, headX + 3, headY + bob + 6, 2, 1, avatar.expression === "picaro" ? outfit.trim : "#8a5a38");

  if (avatar.facialHair === "bigote") {
    px(ctx, headX + 2, headY + bob + 5, 4, 1, hair);
  }

  if (avatar.facialHair === "barba-corta") {
    px(ctx, headX + 2, headY + bob + 5, 4, 2, hair);
    px(ctx, headX + 3, headY + bob + 7, 2, 1, hair);
  }

  if (state === "studying") {
    px(ctx, bodyX - 1, bodyY + bob + 5, 1, 5, outfit.shadow);
    px(ctx, bodyX + bodyWidth, bodyY + bob + 5, 1, 5, outfit.shadow);
  }

  drawAccessory(ctx, avatar, x, y - (pose === "sitting" ? 10 : 13), facing, outfit.trim);
}

export function drawSpeechBubble(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  const trimmed = text.trim();
  if (!trimmed) {
    return;
  }

  const label = trimmed.length > 20 ? `${trimmed.slice(0, 20)}…` : trimmed;
  ctx.save();
  ctx.font = "bold 8px monospace";
  const textWidth = Math.ceil(ctx.measureText(label).width);
  const bubbleWidth = textWidth + 10;
  const bubbleHeight = 14;
  const bubbleX = Math.round(x - bubbleWidth / 2);
  const bubbleY = Math.round(y - 32);

  px(ctx, bubbleX, bubbleY, bubbleWidth, bubbleHeight, "#171311");
  px(ctx, bubbleX + 1, bubbleY + 1, bubbleWidth - 2, bubbleHeight - 2, "#efe1cb");
  px(ctx, x - 2, bubbleY + bubbleHeight - 1, 4, 4, "#171311");
  px(ctx, x - 1, bubbleY + bubbleHeight, 2, 3, "#efe1cb");

  ctx.fillStyle = "#2a1d19";
  ctx.fillText(label, bubbleX + 5, bubbleY + 10);
  ctx.restore();
}
