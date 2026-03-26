import type { AvatarConfig } from "@/lib/sanctuary/store";

interface ItemModelPreviewProps {
  field: keyof AvatarConfig;
  value: string;
}

const swatchTones = {
  archivo: "#7b5231",
  vigia: "#35523a",
  viajera: "#5b3e63",
  marfil: "#f4d2b7",
  miel: "#d9a16a",
  bronce: "#9d6841",
  umbra: "#5e3b27",
  obsidiana: "#22181b",
  castano: "#5d4030",
  cobre: "#9a4d1b",
  plata: "#d1d5db",
  escriba: "#88603c",
  alquimista: "#5b3e63",
  guardabosques: "#35523a",
} as const;

export function ItemModelPreview({ field, value }: ItemModelPreviewProps) {
  if (field === "outfit" || field === "base") {
    return (
      <div className="relative h-16 w-16 rounded-none border-2 border-surface-container-highest bg-surface-container-low">
        <div className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#f4d2b7]" />
        <div
          className="absolute left-1/2 bottom-2 h-8 w-8 -translate-x-1/2 rounded-t-[0.35rem] border-2 border-surface-container-highest"
          style={{ backgroundColor: swatchTones[value as keyof typeof swatchTones] ?? "#88603c" }}
        />
      </div>
    );
  }

  if (field === "accessory") {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-none border-2 border-surface-container-highest bg-surface-container-low">
        {value === "libro" && <div className="h-8 w-6 border-2 border-[#3c2412] bg-[#7c4a29]" />}
        {value === "te" && <div className="relative h-7 w-7 border-2 border-[#6c4300] bg-[#d2b98b]"><div className="absolute -right-2 top-1 h-4 w-3 rounded-r-full border-2 border-[#6c4300]" /></div>}
        {value === "pluma" && <div className="h-8 w-3 rotate-12 rounded-full bg-[#d8d4df]" />}
        {value === "linterna" && <div className="h-8 w-6 border-2 border-[#6c4300] bg-[#ffcf93]" />}
        {value === "ninguno" && <div className="h-8 w-8 border-2 border-dashed border-outline-variant" />}
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-none border-2 border-surface-container-highest bg-surface-container-low">
      <div
        className="h-9 w-9 rounded-none border-2 border-surface-container-highest"
        style={{ backgroundColor: swatchTones[value as keyof typeof swatchTones] ?? "#8d9289" }}
      />
    </div>
  );
}
