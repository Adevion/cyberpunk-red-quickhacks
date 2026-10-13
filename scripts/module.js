//  Cyberpunk RED QuickHack Imports
import { registerSettings } from "./settings.js";
import { registerEffects } from "./effects.js";
import { buildCompendiums } from "./build-compendiums.js";
import { registerSheetHooks } from "./sheet-hooks.js";
import { getSelfIceCount } from "./neuroport.js";

Hooks.once("init", () => {
  console.log("CPRED Edgerunners QuickHacks | Init");
  registerSettings();
  registerEffects();
});

Hooks.once("ready", async () => {
  registerSheetHooks();
  await buildCompendiums();
  console.log("CPRED Edgerunners QuickHacks | Ready");
  window.cpredqh = { getSelfIceCount };
});

Hooks.on("updateCombat", async (combat, changed) => {
  if (!("round" in changed)) return;
  for (const actor of game.actors) {
    actor.setFlag(
      "cyberpunk-red-quickhacks",
      "quickhacks.targetsThisTurn",
      []
    );
  }
});