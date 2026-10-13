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
  //const roll = await new Roll( "1d10 + @rank", { rank: interfaceRank }).roll();
  const roll = new CPRRolls.CPRInterfaceRoll("action", "Interface", interfaceRank);
  const keepRolling = await roll.handleRollDialog({ type: "manual" }, actor );
  if (!keepRolling) { return false; }

  await roll.roll();

  console.log("CPR Roll", roll);

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
    "d10"
  );

  return success;
}