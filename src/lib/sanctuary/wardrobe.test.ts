import { describe, expect, it } from "vitest";
import {
  formatWardrobeDuration,
  getWardrobeUnlockSummary,
  isWardrobeItemUnlocked,
} from "@/lib/sanctuary/wardrobe";

describe("wardrobe unlocks", () => {
  it("desbloquea las prendas base desde el inicio", () => {
    expect(isWardrobeItemUnlocked("upper", "shirt-01-longsleeve", 0)).toBe(
      true,
    );
    expect(isWardrobeItemUnlocked("socks", "socks-01-ankle", 0)).toBe(true);
  });

  it("mantiene bloqueadas las piezas avanzadas hasta cumplir el tiempo", () => {
    expect(
      isWardrobeItemUnlocked("accessory", "sugarloaf-simple", 10 * 3600),
    ).toBe(false);
    expect(
      isWardrobeItemUnlocked("accessory", "sugarloaf-simple", 28 * 3600),
    ).toBe(true);
  });

  it("calcula el siguiente desbloqueo pendiente", () => {
    const summary = getWardrobeUnlockSummary(3600);

    expect(summary.unlockedCount).toBeGreaterThan(0);
    expect(summary.nextUnlock?.label).toBe("Camisa larga 02");
    expect(summary.nextUnlock?.remainingFocusSeconds).toBe(3600);
  });

  it("formatea duraciones largas de forma legible", () => {
    expect(formatWardrobeDuration(90 * 60)).toBe("1 h 30 min");
  });
});
