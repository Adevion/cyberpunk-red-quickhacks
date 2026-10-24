//  Cyberpunk RED Quickhack Imports
import { registerSettings } from "./settings.js";
import { performBreach } from "./breach.js";
import { registerEffects } from "./effects.js";
import { buildCompendiums } from "./build-compendiums.js";
import { registerSheetHooks } from "./sheet-hooks.js";
import { getSelfIceCount } from "./neuroport.js";
import { removeAllQuickhackEffects, removeQuickhackEffect } from "./gm-utilities.js";
import { runQuickhackFromHotbar, openQuickhackDialog } from "./quickhacks.js";
import { registerSocketLib } from "./socketlib.js";

Hooks.once( "socketlib.ready", registerSocketLib );

Hooks.once("init", () => {
  console.log("CPRED Edgerunners Quickhacks | Init");
  registerSettings();
  registerEffects();
});

Hooks.once("ready", async () => {
  registerSheetHooks();

  if (game.user.isGM) {
    await buildCompendiums();
  }
  console.log("CPRED Edgerunners Quickhacks | Ready");
  window.cpredqh = { getSelfIceCount, removeAllQuickhackEffects, removeQuickhackEffect, performBreach, runQuickhackFromHotbar, openQuickhackDialog };
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