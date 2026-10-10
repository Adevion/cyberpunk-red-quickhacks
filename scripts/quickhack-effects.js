export async function applyQuickHack(
  attacker,
  target,
  hack
) {

  const name = hack.name;

  switch (name) {

    case "Impair Movement":
      return applyImpairMovement(
        attacker,
        target
      );

    case "Sonic Shock":
      return applySonicShock(
        attacker,
        target
      );

    case "Overheat":
      return applyOverheat(
        attacker,
        target
      );

    case "Short Circuit":
      return applyShortCircuit(
        attacker,
        target
      );

    case "Cyberware Malfunction":
      return applyCyberwareMalfunction(
        attacker,
        target
      );

    case "Lure":
      return applyLure(
        attacker,
        target
      );

    case "Slow":
      return applySlow(
        attacker,
        target
      );

    case "Synapse Burnout":
      return applySynapseBurnout(
        attacker,
        target
      );

    case "Puppet":
      return applyPuppet(
        attacker,
        target
      );

    case "Shard Ejection":
      return applyShardEjection(
        attacker,
        target
      );

    case "System Reset":
      return applySystemReset(
        attacker,
        target
      );

    default:

      ui.notifications.warn(
        `${name} has no automation yet.`
      );

  }

}

async function applyImpairMovement(
  attacker,
  target
) {

  const effect = {

    name: "QuickHack - Impair Movement",

    icon:
      "icons/magic/time/hourglass-brown.webp",

    duration: {
      rounds: 20
    },

    changes: [
      {
        key:
          "system.stats.move.value",
        mode: 2,
        value: "-1"
      }
    ]
  };

  await target.createEmbeddedDocuments(
    "ActiveEffect",
    [effect]
  );

  await ChatMessage.create({
    content:
      `${target.name}'s MOVE is reduced by 1 for 20 rounds.`
  });

}

async function applySonicShock(
  attacker,
  target
) {

  await target.toggleStatusEffect(
    "sonicShock",
    {
      active:true
    }
  );

  await ChatMessage.create({
    content:
      `${target.name} suffers Sonic Shock and Damaged Ear.`
  });

}

async function applyOverheat(
  attacker,
  target
) {

  await target.setFlag(
    "cyberpunk-red-quickhacks",
    "burning",
    true
  );

  await target.toggleStatusEffect(
    "burning",
    {
      active:true
    }
  );

  await ChatMessage.create({

    content:
      `${target.name} is on fire. Suffers 4 HP damage at the end of each Turn.`

  });

}

async function applyShortCircuit(
  attacker,
  target
) {

  const cyberware =
    target.items.filter(
      i => i.type === "cyberware"
    );

  const list =
    cyberware
      .map(i => `<option value="${i.id}">
      ${i.name}
      </option>`)
      .join("");

  new Dialog({

    title: "Short Circuit",

    content: `

    <form>

    <label>
      Select 3 Cyberware
    </label>

    <select multiple id="items">

      ${list}

    </select>

    </form>
    `,

    buttons: {

      apply: {

        label: "Disable",

        callback: async html => {

          const selected =
            html
              .find("#items")
              .val();

          for (const id of selected) {

            const item =
              target.items.get(id);

            await item.setFlag(
              "cyberpunk-red-quickhacks",
              "disabledUntil",
              game.combat?.round + 20
            );

          }

        }

      }

    }

  }).render(true);

}

async function applyCyberwareMalfunction(
  attacker,
  target
) {

  const cyberware =
    target.items.filter(
      i => i.type === "cyberware"
    );

  let options = "";

  for (const item of cyberware) {

    options += `
    <option value="${item.id}">
      ${item.name}
    </option>
    `;

  }

  new Dialog({

    title:
      "Cyberware Malfunction",

    content: `
      <select id="cyber">
        ${options}
      </select>
    `,

    buttons: {

      apply: {

        label: "Disable",

        callback:
        async html => {

          const id =
            html
              .find("#cyber")
              .val();

          const item =
            target.items.get(id);

          await item.setFlag(

            "cyberpunk-red-quickhacks",

            "disabledUntil",

            game.combat.round + 20

          );

        }

      }

    }

  }).render(true);

}

async function applyLure(
  attacker,
  target
) {

  await target.setFlag(
    "cyberpunk-red-quickhacks",
    "lured",
    true
  );

  await ChatMessage.create({

    content:
`Lure successful.
GM: Move ${target.name}
at the start of their next Turn.`

  });

}

async function applySlow(
  attacker,
  target
) {

  const roll =
    await new Roll(
      "1d6"
    ).roll();

  const penalty =
    roll.total;

  await roll.toMessage();

  const effect = {

    name:
      "QuickHack - Slow",

    icon:
      "icons/magic/time/hourglass-brown.webp",

    duration: {
      rounds: 20
    },

    changes: [
      {
        key:
          "system.stats.move.value",
        mode: 2,
        value:
          `-${penalty}`
      }
    ]

  };

  await target.createEmbeddedDocuments(
    "ActiveEffect",
    [effect]
  );

}

async function applySynapseBurnout(
  attacker,
  target
) {

  const roll =
    await new Roll(
      "3d6"
    ).roll();

  await roll.toMessage({

    flavor:
      `Synapse Burnout on ${target.name}`

  });

  const hp =
target.system?.derivedStats?.hp?.value;

  if (hp !== undefined) {

    await target.update({

      "system.derivedStats.hp.value":
      Math.max(
        hp - roll.total,
        0
      )

    });

  }

}

async function applyPuppet(attacker, target) {

  await target.setFlag(

    "cyberpunk-red-quickhacks",

    "puppeted",

    true

  );

  await ChatMessage.create({

content:
`Puppet successful.

GM/Netrunner controls:

• Move Action
• Action

during the target's next Turn.`

  });

}

async function applySystemReset(
  attacker,
  target
) {

  await target.toggleStatusEffect(
    "systemReset",
    {
      active:true
    }
  );

  const effect = {

    name:
      "System Reset",

    icon:
      "icons/svg/falling.svg",

    duration: {
      rounds: 20
    }

  };

  await target.createEmbeddedDocuments(
    "ActiveEffect",
    [effect]
  );

  await ChatMessage.create({

content:
`${target.name}
falls unconscious and prone
for 20 rounds or until damaged.`

  });

}

async function applyShardEjection(
  attacker,
  target
) {

  const chipware = target.items.filter(i => {

    if (i.type !== "cyberware") return false;

    return (
      i.name.toLowerCase().includes("chip") ||
      i.system?.type === "chipware" ||
      i.system?.isChipware === true
    );

  });

  if (chipware.length === 0) {

    ui.notifications.warn(
      `${target.name} has no installed chipware.`
    );

    return;

  }

  let options = "";

  for (const item of chipware) {

    options += `
      <option value="${item.id}">
        ${item.name}
      </option>
    `;

  }

  new Dialog({

    title: "Shard Ejection",

    content: `
      <form>
        <div class="form-group">
          <label>Chipware To Eject</label>
          <select id="chipware">
            ${options}
          </select>
        </div>
      </form>
    `,

    buttons: {

      eject: {

        label: "Eject",

        callback: async html => {

          const itemId =
            html.find("#chipware").val();

          const item =
            target.items.get(itemId);

          if (!item) return;

          /*
           * Create a dropped copy
           * for recovery later.
           */

          const droppedData =
            foundry.utils.deepClone(
              item.toObject()
            );

          droppedData.name =
            `${item.name} (Ejected)`;

          await Item.create(
            droppedData,
            {
              temporary: false
            }
          );

          /*
           * Remove
           * from target.
           */

          await item.delete();

          /*
           * Mark target.
           */

          await target.setFlag(
            "cyberpunk-red-quickhacks",
            "lastShardEjection",
            {
              round:
                game.combat?.round ?? 0,
              shard:
                item.name
            }
          );

          ChatMessage.create({

            speaker: {
              actor: attacker
            },

            content: `
              <h2>Shard Ejection</h2>

              <p>
              ${attacker.name}
              forcibly ejected
              <b>${item.name}</b>
              from
              ${target.name}.
              </p>

              <p>
              The shard lands in an
              adjacent square.
              </p>
            `

          });

        }

      },

      cancel: {
        label: "Cancel"
      }

    }

  }).render(true);

}