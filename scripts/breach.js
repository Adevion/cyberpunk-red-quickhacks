// Cyberounk RED Core Imports
import * as CPRRolls from  "../../../systems/cyberpunk-red-core/modules/rolls/cpr-rolls.js";

// Quickhack Imports
import { getPasswallDV } from "./neuroport.js";
import { getInterfaceRank } from "./quickhacks.js";
import { postRollCard } from "./quickhack-effects.js";

export async function performBreach(actor, target) {
  const dv = getPasswallDV(target);
  if (dv === 0) {
    ui.notifications.info( "Target has no Self-ICE." );
    return true;
  }

  const interfaceRank = getInterfaceRank(actor);
  const roll = new CPRRolls.CPRInterfaceRoll("action", "Interface", interfaceRank);
  const keepRolling = await roll.handleRollDialog({ type: "manual" }, actor );
  if (!keepRolling) { return false; }

  const currentLuck = Number(actor.system.stats.luck.value ?? 0)
  const requestedLuck = Number(roll.luck ?? 0);

  // TODO:
  // CPR currently allows spending more Luck than available.
  // Roll receives full entered value and then reduces Luck to 0.
  // This behavior also exists in native CPR rolls.
  // Do not alter locally until a CPR-compatible solution is decided.

  console.log("Luck Anti-Cheat");
  console.log("Requested Luck:", requestedLuck);
  console.log("Current Luck:", currentLuck);
  console.log("Applied Luck:", roll.luck);

  await roll.roll();

  // Luck Deduction
  if (roll.luck > 0) {
    await actor.update({ "system.stats.luck.value": currentLuck - roll.luck });
  }

  let breachResult = ""
  let success = false;

  if (roll.resultTotal < dv) {
    ui.notifications.warn( "Breach failed." );
    breachResult = `<img class="quickhack-result-image" src="modules/cyberpunk-red-quickhacks/images/pixel-fail.webp"/>`;
  } else {  
    await target.setFlag(
      "cyberpunk-red-quickhacks",
      "neuroport.firewallBreached",
      true
    );

    ui.notifications.info( "Breach successful." );
    breachResult = `<img class="quickhack-result-image" src="modules/cyberpunk-red-quickhacks/images/pixel-preem.webp"/>`;
    success = true;
  }

  //await roll.toMessage({ flavor: `Breach DV ${dv}` });
  await postRollCard( 
    actor, 
    `Breach`, 
    target.name, 
    breachResult, 
    roll, 
    "d10",
    interfaceRank
  );

  return success;
}