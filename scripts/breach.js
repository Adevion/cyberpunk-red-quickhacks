import { getPasswallDV } from "./neuroport.js";
import { getInterfaceRank } from "./quickhacks.js";

export async function performBreach(actor, target) {
  const dv = getPasswallDV(target);
  if (dv === 0) {
    ui.notifications.info( "Target has no Self-ICE." );
    return true;
  }

  const interfaceRank = getInterfaceRank(actor);
  const roll = await new Roll( "1d10 + @rank", { rank: interfaceRank }).roll();

  await roll.toMessage({ flavor: `Breach DV ${dv}` });
  if (roll.total < dv) {
    ui.notifications.warn( "Breach failed." );
    return false;
  }
   
  await target.setFlag(
    "cyberpunk-red-quickhacks",
    "neuroport.firewallBreached",
    true
  );
    
  ui.notifications.info( "Breach successful." );
  return true;
}