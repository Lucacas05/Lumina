import { Flame, MoonStar, Sparkles } from "lucide-react";
import type { AvatarConfig, PresenceState } from "@/lib/sanctuary/store";

interface PixelAvatarProps {
  avatar: AvatarConfig;
  state?: PresenceState;
  name?: string;
  size?: "sm" | "md" | "lg";
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
  escriba: { primary: "#88603c", trim: "#ffb961" },
  alquimista: { primary: "#5b3e63", trim: "#e7bdb1" },
  guardabosques: { primary: "#35523a", trim: "#add0a8" },
} as const;

const stateIcons = {
  idle: MoonStar,
  studying: Flame,
  break: Sparkles,
  offline: MoonStar,
} as const;

const avatarSizes = {
  sm: {
    frame: "h-24 w-[4.5rem]",
    head: "w-8 h-8 top-3",
    body: "w-11 h-11 bottom-6",
    feet: "w-9 h-3 bottom-3",
    accessory: "w-7 h-7",
    label: "text-[9px]",
  },
  md: {
    frame: "w-24 h-32",
    head: "w-10 h-10 top-4",
    body: "w-14 h-14 bottom-8",
    feet: "w-10 h-3 bottom-4",
    accessory: "w-8 h-8",
    label: "text-[10px]",
  },
  lg: {
    frame: "w-40 h-48",
    head: "w-16 h-16 top-5",
    body: "h-24 w-[5.5rem] bottom-10",
    feet: "w-16 h-4 bottom-5",
    accessory: "w-10 h-10",
    label: "text-xs",
  },
} as const;

export function PixelAvatar({
  avatar,
  state = "idle",
  name,
  size = "md",
  highlighted = false,
}: PixelAvatarProps) {
  const palette = outfitTones[avatar.outfit];
  const skin = skinTones[avatar.skinTone];
  const hair = avatar.hairStyle === "capucha" ? palette.trim : hairTones[avatar.hairColor];
  const StateIcon = stateIcons[state];
  const sizes = avatarSizes[size];
  const shoulderWidth =
    avatar.base === "vigia" ? "w-[72%]" : avatar.base === "viajera" ? "w-[60%]" : "w-[66%]";

  return (
    <div className={`relative ${sizes.frame}`}>
      <div className="absolute inset-x-5 bottom-1 h-4 rounded-full bg-black/35 blur-md" />
      <div
        className={[
          "absolute left-1/2 -translate-x-1/2 rounded-[0.35rem] border-[3px] border-surface-container-highest shadow-[0_8px_0_rgba(0,0,0,0.2)]",
          sizes.head,
          highlighted ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ backgroundColor: skin }}
      >
        <div
          className="absolute left-0 top-0 h-[38%] w-full rounded-t-[0.25rem]"
          style={{ backgroundColor: hair }}
        />
        {avatar.hairStyle === "ondas" && (
          <div className="absolute inset-x-1 top-[14%] h-[28%] rounded-full opacity-90" style={{ backgroundColor: hair }} />
        )}
        {avatar.hairStyle === "coleta" && (
          <div className="absolute right-0 top-[26%] h-[52%] w-[18%] rounded-b-sm" style={{ backgroundColor: hair }} />
        )}
        {avatar.hairStyle === "capucha" && (
          <>
            <div className="absolute inset-x-0 top-0 h-[65%] rounded-t-[0.35rem]" style={{ backgroundColor: palette.primary }} />
            <div className="absolute inset-x-[18%] top-[16%] h-[42%] rounded-t-full border-t-2 border-tertiary/30" style={{ backgroundColor: hair }} />
          </>
        )}

        <div className="absolute inset-x-[22%] top-[42%] flex justify-between">
          <span className={`h-1.5 w-1.5 rounded-none ${avatar.expression === "despierto" ? "bg-surface" : "bg-surface/70"}`} />
          <span className={`h-1.5 w-1.5 rounded-none ${avatar.expression === "despierto" ? "bg-surface" : "bg-surface/70"}`} />
        </div>
        <div className="absolute inset-x-[36%] top-[58%] h-[10%] rounded-full bg-surface/50" />
        {avatar.facialHair === "bigote" && (
          <div className="absolute inset-x-[28%] top-[62%] h-[10%] rounded-full" style={{ backgroundColor: hair }} />
        )}
        {avatar.facialHair === "barba-corta" && (
          <div className="absolute inset-x-[22%] top-[64%] h-[18%] rounded-b-[0.3rem]" style={{ backgroundColor: hair }} />
        )}
      </div>

      <div
        className={[
          "absolute left-1/2 -translate-x-1/2 rounded-t-[0.4rem] rounded-b-[0.2rem] border-[3px] border-surface-container-highest",
          sizes.body,
          shoulderWidth,
        ].join(" ")}
        style={{ backgroundColor: palette.primary }}
      >
        <div className="absolute inset-x-[14%] top-2 h-2 rounded-full opacity-85" style={{ backgroundColor: palette.trim }} />
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-black/25" />
        <div className="absolute inset-x-[34%] bottom-0 h-[22%] bg-black/15" />
      </div>

      <div
        className={`absolute left-1/2 -translate-x-1/2 rounded-b-sm border-x-[3px] border-b-[3px] border-surface-container-highest ${sizes.feet}`}
        style={{ backgroundColor: avatar.base === "viajera" ? palette.trim : palette.primary }}
      />

      {avatar.accessory !== "ninguno" && (
        <div
          className={`absolute -right-1 bottom-8 flex items-center justify-center rounded-none border-2 border-surface-container-highest bg-surface-container-low ${sizes.accessory}`}
        >
          {avatar.accessory === "libro" && (
            <div className="relative h-[60%] w-[56%] rounded-[0.1rem] border-2 border-[#3c2412] bg-[#7c4a29]">
              <div className="absolute inset-y-0 left-[18%] w-[2px] bg-[#ffcf93]" />
              <div className="absolute inset-x-[20%] top-[18%] h-[2px] bg-[#ffcf93]/60" />
            </div>
          )}
          {avatar.accessory === "te" && (
            <div className="relative h-[58%] w-[62%]">
              <div className="absolute bottom-0 left-[12%] h-[55%] w-[58%] rounded-b-[0.12rem] border-2 border-[#6c4300] bg-[#d2b98b]" />
              <div className="absolute right-[6%] top-[18%] h-[34%] w-[22%] rounded-r-full border-2 border-[#6c4300]" />
              <div className="absolute left-[28%] top-0 h-[20%] w-[2px] bg-white/60" />
            </div>
          )}
          {avatar.accessory === "pluma" && (
            <div className="relative h-[65%] w-[30%] rotate-12">
              <div className="absolute inset-0 rounded-full bg-[#d8d4df]" />
              <div className="absolute bottom-[-8%] left-1/2 h-[42%] w-[2px] -translate-x-1/2 bg-[#7c4a29]" />
            </div>
          )}
          {avatar.accessory === "linterna" && (
            <div className="relative h-[62%] w-[46%]">
              <div className="absolute inset-x-[14%] top-0 h-[18%] rounded-t-full border-2 border-[#6c4300]" />
              <div className="absolute inset-x-0 top-[18%] bottom-0 rounded-[0.12rem] border-2 border-[#6c4300] bg-[#ffcf93]" />
              <div className="absolute inset-x-[22%] top-[32%] bottom-[12%] bg-[#ffb961]/70" />
            </div>
          )}
        </div>
      )}

      <div className="absolute -left-2 top-1 flex h-7 w-7 items-center justify-center rounded-none border-2 border-surface-container-highest bg-surface-container-low">
        <StateIcon size={14} className={state === "break" ? "text-tertiary" : state === "studying" ? "text-primary" : "text-outline"} />
      </div>

      {name && (
        <div
          className={`absolute -bottom-5 left-1/2 min-w-max -translate-x-1/2 rounded-none border-2 border-surface-container-highest bg-surface px-2 py-1 font-headline font-bold uppercase tracking-widest text-outline ${sizes.label}`}
        >
          {name}
        </div>
      )}
    </div>
  );
}
