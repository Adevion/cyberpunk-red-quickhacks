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
  console.log( "Hack:", h.name, h.id, h._id );
  options += `
    <option value="${h.id}">
      ${h.name}
    </option>
  `;
}

const content = `
  <form>
    <div>
      <label>QuickHack</label>
      <select id="hack">
        ${options}
      </select>
    </div>
  </form>
  `;

  new Dialog({
    title: "Perform QuickHack",
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
  const dv =
    hack.flags[
      "cyberpunk-red-quickhacks"
    ].dv;

  const interfaceRank =
    getInterfaceRank(actor);

  const roll =
    await new Roll(
      "1d10 + @rank",
      {
        rank: interfaceRank
      }
    ).roll();

  await roll.toMessage({ flavor: `${hack.name} DV ${dv}` });

  if (roll.total < dv) {
    ui.notifications.warn(
      `${hack.name} failed`
    );
    return;
  }

  ui.notifications.info( `${hack.name} succeeded` );

  await applyQuickHack(
    actor,
    target,
    hack
  );
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