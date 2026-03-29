import { describe, expect, it } from "vitest";
import {
  defaultMissionDefinitions,
  formatMissionDuration,
  getMissionRewardLabel,
} from "@/lib/sanctuary/missions";

describe("mission definitions", () => {
  it("expone misiones por defecto con ids únicos", () => {
    const ids = defaultMissionDefinitions.map((mission) => mission.id);
    expect(new Set(ids).size).toBe(defaultMissionDefinitions.length);
  });

  it("formatea duraciones largas", () => {
    expect(formatMissionDuration(150 * 60)).toBe("2 h 30 min");
  });

  it("resuelve el nombre legible de la recompensa", () => {
    expect(
      getMissionRewardLabel({
        type: "wardrobe",
        field: "upper",
        value: "shirt-02-vneck-longsleeve",
      }),
    ).toContain("Camisa larga 02");
  });
});
