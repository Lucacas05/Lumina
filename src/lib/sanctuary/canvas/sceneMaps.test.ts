// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";
import {
  clearPublishedSceneMaps,
  cloneSceneMap,
  getSceneMap,
  PUBLISHED_SCENE_STORAGE_KEY,
  publishSceneMaps,
  refreshPublishedSceneMaps,
  sceneMaps,
} from "@/lib/sanctuary/canvas/sceneMaps";

describe("sceneMaps publicados", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearPublishedSceneMaps();
  });

  it("usa el preset del código cuando no hay una escena publicada", () => {
    expect(getSceneMap("solo-library").spawnLocal).toEqual(
      sceneMaps["solo-library"].spawnLocal,
    );
  });

  it("aplica a la web la escena publicada desde el editor", () => {
    const nextScene = cloneSceneMap(sceneMaps["solo-library"]);
    nextScene.spawnLocal = { x: 3.5, y: 7.5 };
    nextScene.theme.border = "#00ffaa";

    publishSceneMaps({
      "solo-library": nextScene,
    });

    expect(getSceneMap("solo-library").spawnLocal).toEqual({ x: 3.5, y: 7.5 });
    expect(getSceneMap("solo-library").theme.border).toBe("#00ffaa");
    expect(window.localStorage.getItem(PUBLISHED_SCENE_STORAGE_KEY)).toContain(
      "solo-library",
    );
  });

  it("recarga una escena publicada desde el storage y permite volver al preset", () => {
    const nextScene = cloneSceneMap(sceneMaps.garden);
    nextScene.spawnLocal = { x: 9.5, y: 4.5 };

    window.localStorage.setItem(
      PUBLISHED_SCENE_STORAGE_KEY,
      JSON.stringify({ garden: nextScene }),
    );
    refreshPublishedSceneMaps();

    expect(getSceneMap("garden").spawnLocal).toEqual({ x: 9.5, y: 4.5 });

    clearPublishedSceneMaps();

    expect(getSceneMap("garden").spawnLocal).toEqual(
      sceneMaps.garden.spawnLocal,
    );
  });
});
