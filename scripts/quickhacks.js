import { applyQuickHack } from "./quickhack-effects.js";
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
      <label>Quickhack</label>
      <select id="hack">
        ${options}
      </select>
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
  const roll = await new Roll( "1d10 + @rank", { rank: interfaceRank } ).roll();
  const initialRoll = roll.terms[0].results[0].result;
  const success = roll.total >= dv;

  const content =
    await renderTemplate( "modules/cyberpunk-red-quickhacks/templates/chat/quickhack-rollcard.hbs",
      {
        rollTitle: hack.name,
        targetName: target.name,
        dv,
        initialRoll,
        resultTotal: roll.total,
        interfaceRank,
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