import { registerSettings } from "./settings.js";
import { registerEffects } from "./effects.js";
import { registerSheetHooks } from "./sheet-hooks.js";

Hooks.once("init", () => {
  console.log("CPRED Edgerunners QuickHacks | Init");

  registerSettings();
  registerEffects();
});

Hooks.once("ready", async () => {
  console.log("CPRED Edgerunners QuickHacks | Ready");
});

Hooks.on("combatRound", () => {
  for (const actor of game.actors) {
    actor.setFlag(
      "cpred-edgerunners-quickhacks",
      "quickhacks.targetsThisTurn",
      []
    );
  }
});