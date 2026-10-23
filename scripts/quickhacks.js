// Cyberpunk RED Core Imports
import * as CPRRolls from  "../../../systems/cyberpunk-red-core/modules/rolls/cpr-rolls.js";

// Quickhack Imports
import { applyQuickHack } from "./quickhack-effects.js";
import { debugLog } from "./gm-utilities.js";
import "./quickhack-expiration.js";

const QUICKHACKS = [
  "Impair Movement",
  "Sonic Shock",
  "Overheat",
  "Short Circuit",
  "Cyberware Malfunction",
  "Lure",
  "Slow",
  "Synapse Burnout",
  "Puppet",
  "Shard Ejection",
  "System Reset"
];

export function getQuickHacks(actor) {
  return actor.items.filter(
    i =>
      i.type === "program" &&
      QUICKHACKS.includes(i.name)
  );
}

export async function openQuickHackDialog( actor ) {
  const target = [...game.user.targets][0]?.actor;

  if (!target) {
    ui.notifications.warn(
      "Select a target."
    );
    return;
  }

const allPrograms = actor.items.filter( i => i.type === "program" );
const hacks = getQuickHacks(actor);

let options = "";

for (const h of hacks) {
  options += `
    <option value="${h.id}">
      ${h.name}
    </option>
  `;
}

const content = `
  <form>
    <div>
      Target: ${target.name}
    </div>

    <div class="form-group">
      <label>Quickhack</label>
      <select id="hack">
        ${options}
      </select>
    </div>

    <hr/>

    <div class="text-small">
      Select a Quickhack and press Execute.
    </div>
  </form>
  `;

  new Dialog({
    title: "Perform Quickhack",
    content,
    buttons: {
      apply: {
        label: "Execute",
        callback: async html => {
          const id =
            html.find("#hack").val();
          const hack =
            actor.items.get(id);
          await performQuickHack(
            actor,
            target,
            hack
          );
        }
      }
    }
  }).render(true);
}

export async function performQuickHack( actor, target, hack) {
  const dv = hack.flags[ "cyberpunk-red-quickhacks" ].dv;
  const interfaceRank = getInterfaceRank(actor);
  const roll = new CPRRolls.CPRInterfaceRoll("action", "Quickhack", interfaceRank);
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

  const initialRoll = roll.initialRoll ?? 0;
  const resultTotal = roll.resultTotal ?? roll.total ?? 0;
  const success = roll.resultTotal >= dv;

  const wasCritSuccess = roll.wasCritSuccess?.() ?? false;
  const wasCritFail = roll.wasCritFail?.() ?? false;
  const criticalRoll = roll.criticalRoll ?? 0;

  let resultImage;

  if (!success) { resultImage = "modules/cyberpunk-red-quickhacks/images/pixel-fail.webp"; }
  else if (wasCritSuccess) { resultImage = Math.random() < 0.5 ? "modules/cyberpunk-red-quickhacks/images/pixel-preem.webp" : "modules/cyberpunk-red-quickhacks/images/pixel-nova.webp"; }
  else { resultImage = "modules/cyberpunk-red-quickhacks/images/pixel-success.webp"; }

  const totalMods = roll.totalMods?.() ?? 0;
  const modifiers = roll.mods ?? [];
  const hasModifiers = modifiers.length > 0 || totalMods !== 0;
  const luck = roll.luck ?? 0;
  const totalModsDisplay = totalMods >= 0 ? `+${totalMods}` : `${totalMods}`;
 
  const content =
    await renderTemplate( "modules/cyberpunk-red-quickhacks/templates/chat/quickhack-rollcard.hbs",
      {
        rollTitle: hack.name,
        targetName: target.name,
        dv,
        initialRoll,
        resultTotal,
        interfaceRank,

        wasCritSuccess,
        wasCritFail,
        criticalRoll,
        resultImage,

        hasModifiers,
        modifiers,
        totalMods,
        totalModsDisplay,

        luck,

        success
      }
    );
    
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content });

  if (!success) {
    return;
  }

  await applyQuickHack( actor, target, hack );
}

export function getInterfaceRank( actor ) {

  const role = actor.items.find(
      i =>
        i.type === "role" &&
        i.system.mainRoleAbility ===
        "Interface"
    );
  return role?.system?.rank || 0;
}

export async function runQuickHackFromHotbar( actor, target, hackName ) {
  if (!actor) {
    ui.notifications.warn( "Select your Netrunner token or assign a character to your user." );
    return;
  }

  if (!target) {
    ui.notifications.warn( "Target a token first." );
    return;
  }

  const hack = actor.items.find(
    item => item.type === "program" && item.name === hackName
  );

  if (!hack) {
    ui.notifications.warn( `${actor.name} does not have ${hackName} installed.` );
    return;
  }

  return performQuickHack( actor, target, hack );
}