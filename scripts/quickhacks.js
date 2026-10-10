export function getQuickHacks(actor) {

  return actor.items.filter(
    i =>
      i.type === "program" &&
      i.flags?.[
        "cpred-edgerunners-quickhacks"
      ]?.quickhack
  );
}

export async function openQuickHackDialog(actor) {

  const target =
    [...game.user.targets][0]?.actor;

  if (!target) {
    ui.notifications.warn(
      "Select a target."
    );
    return;
  }

  const hacks =
    getQuickHacks(actor);

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

export async function performQuickHack(
  actor,
  target,
  hack
) {

  const dv =
    hack.flags[
      "cpred-edgerunners-quickhacks"
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

  await roll.toMessage({

    flavor:
      `${hack.name} DV ${dv}`

  });

  if (roll.total < dv) {

    ui.notifications.warn(
      `${hack.name} failed`
    );

    return;
  }

  ui.notifications.info(
    `${hack.name} succeeded`
  );

  await applyQuickHack(
    target,
    hack
  );
}

export function getInterfaceRank(
  actor
) {

  const role =
    actor.items.find(

      i =>
        i.type === "role" &&
        i.system.mainRoleAbility ===
        "Interface"

    );

  return role?.system?.rank || 0;

}