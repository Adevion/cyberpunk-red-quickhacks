// Cyberounk RED Core Imports
import * as CPRRolls from  "../../../systems/cyberpunk-red-core/modules/rolls/cpr-rolls.js";

// Quickhack Imports
import { getPasswallDV } from "./neuroport.js";
import { getInterfaceRank } from "./quickhacks.js";
import { postRollCard } from "./quickhack-effects.js";
import { getSocket } from "./socketlib.js";
import { debugLog } from "./gm-utilities.js";

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

  await debugLog( "Luck Anti-Cheat", { actor: actor.name, requestedLuck, currentLuck, appliedLuck: roll.luck } );

  await roll.roll();

  // Luck Deduction
  if (roll.luck > 0) {
    await actor.update({ "system.stats.luck.value": currentLuck - roll.luck });
  }

  const wasCritSuccess = roll.wasCritSuccess?.() ?? false;

  let breachResult = "";
  let resultImage = "";
  let success = false;

  if (roll.resultTotal < dv) {
    ui.notifications.warn( "Breach failed." );
    resultImage = "modules/cyberpunk-red-quickhacks/images/pixel-fail.webp";
  } else {
    const socket = getSocket();

    await socket.executeAsGM( "applyBreach", target.uuid );

    ui.notifications.info( "Breach successful." );
    success = true;

    if (roll.wasCritSuccess?.()) {
      resultImage = Math.random() < 0.5 ? "modules/cyberpunk-red-quickhacks/images/pixel-preem.webp" : "modules/cyberpunk-red-quickhacks/images/pixel-nova.webp";
    } else {
      resultImage = "modules/cyberpunk-red-quickhacks/images/pixel-success.webp";
    }    
  }

  //await roll.toMessage({ flavor: `Breach DV ${dv}` });
  await postRollCard( 
    actor, 
    `Breach`, 
    target.name, 
    breachResult,
    resultImage, 
    roll, 
    "d10",
    interfaceRank
  );

  return success;
}

export async function applyBreach( targetUuid ) {
  const target = await fromUuid(targetUuid);
  await target.setFlag( "cyberpunk-red-quickhacks", "neuroport.firewallBreached", true );

  const alreadyBreached =
    target.effects.some(
      e =>
        e.getFlag(
          "cyberpunk-red-quickhacks",
          "quickhack"
        ) === "breached"
    );

  if (!alreadyBreached) {

    await target.createEmbeddedDocuments(
      "ActiveEffect",
      [{
        name: "Breached",
        img: "modules/cyberpunk-red-quickhacks/icons/svg/whiplash.svg",
        statuses: ["breached"],
        flags: {
          "cyberpunk-red-quickhacks": {
            quickhack: "breached"
          }
        }
      }]
    );
  }
}