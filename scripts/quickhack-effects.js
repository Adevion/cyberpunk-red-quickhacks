// Apply QuickHack Effects
async function applyImpairMovement( attacker, target ) {
  const penalty = 1;
  const created = await target.createEmbeddedDocuments(
    "ActiveEffect",
    [{
      name: `Impaired Movement`,
      img: "modules/cyberpunk-red-quickhacks/icons/svg/broken_leg.svg",
      changes: [{
        key: "system.stats.move.value",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: String(-penalty),
        priority: 20
      }],
      flags: {
        "cyberpunk-red-core": {
          changes: {
            cats: {
              0: "stat"
            },
            situational: {
              0: {
                isSituational: false,
                onByDefault: false
              }
            }
          }
        },
        "cyberpunk-red-quickhacks": {
          quickhack: "impairedMovement",
          expiresRound: (game.combat?.round ?? 0) + 20
        }
      }
    }]
  );

  await target.setFlag("cyberpunk-red-quickhacks", "impairedMovement", true );
  await ChatMessage.create({ content: `${target.name}'s MOVE is reduced by 1 for 1 minute.` });
}

async function applyOverheat( attacker, target ) {
  const created = await target.createEmbeddedDocuments(
    "ActiveEffect",
    [{
      name: "Overheat",
      img: "modules/cyberpunk-red-quickhacks/icons/svg/on_fire.svg",
      statuses: ["overheat"],
      flags: {
        "cyberpunk-red-quickhacks": {
          quickhack: "overheat",
          expiresRound: (game.combat?.round ?? 0) + 20
        }
      }
    }]
  );

  await ChatMessage.create({ content: `${target.name} is on fire. Suffers 4 HP damage at the end of each Turn.` });
}

async function applySlow( attacker, target ) {
  const roll = await new Roll("1d6").roll();
  await roll.toMessage();

  const penalty = roll.total;
  
  const created = await target.createEmbeddedDocuments(
    "ActiveEffect",
    [{
      name: `Slow`,
      img: "modules/cyberpunk-red-quickhacks/icons/svg/sticky-boot.svg",
      changes: [{
        key: "system.stats.move.value",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: String(-penalty),
        priority: 20
      }],
      flags: {
        "cyberpunk-red-core": {
          changes: {
            cats: {
              0: "stat"
            },
            situational: {
              0: {
                isSituational: false,
                onByDefault: false
              }
            }
          }
        },
        "cyberpunk-red-quickhacks": {
          quickhack: "slow",
          expiresRound: (game.combat?.round ?? 0) + 20
        }
      }
    }]
  );

  await target.setFlag( "cyberpunk-red-quickhacks", "slow", penalty );
  await ChatMessage.create({ content: `${target.name} suffers -${penalty} MOVE for 1 minute.` });
}

async function applySonicShock( attacker, target ) {
  // Apply Sonic Shock effect
  await target.createEmbeddedDocuments(
    "ActiveEffect",
    [{
      name: "Sonic Shock",
      img: "modules/cyberpunk-red-quickhacks/icons/svg/sonic-boom.svg",

      statuses: ["sonicShock"],

      flags: {
        "cyberpunk-red-core": {
          changes: {
            cats: {},
            situational: {}
          }
        },

        "cyberpunk-red-quickhacks": {
          quickhack: "sonicShock",
          expiresRound:
            (game.combat?.round ?? 0) + 20
        }
      }
    }]
  );

  // Apply Damaged Ear if not already present
  const alreadyHasInjury = target.itemTypes.criticalInjury.some( i => i.name === "Damaged Ear" );

  if (!alreadyHasInjury) {
    await applyCriticalInjury( target, "cyberpunk-red-core.core_critical-injuries-head", "qRkCxq0KTuBnw2wj" );
    await ChatMessage.create({ content: `${target.name} suffers Sonic Shock for 1 minute.` });
  } else {
    await ChatMessage.create({ content: `${target.name} already suffers from Damaged Ear Critical Injury.` });
  }
}

async function applyShortCircuit( attacker, target) {
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

async function applyCyberwareMalfunction( attacker, target ) {
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

async function applyLure( attacker, target ) {
  await target.setFlag( "cyberpunk-red-quickhacks", "lured", true );
  await ChatMessage.create({ content: `Lure successful. GM: Move ${target.name}  at the start of their next Turn.` });
}

async function applySynapseBurnout( attacker, target ) {
  const roll = await new Roll("3d6").roll();
  await roll.toMessage({ flavor: `Synapse Burnout on ${target.name}` });

  const hp = target.system?.derivedStats?.hp?.value;
  if (hp !== undefined) {
    await target.update({"system.derivedStats.hp.value": Math.max(hp - roll.total, 0)});
  }
}

async function applyPuppet( attacker, target ) {
  await target.setFlag("cyberpunk-red-quickhacks", "puppeted", true);
  await ChatMessage.create({content:`Puppet successful. GM/Netrunner controls: • Move Action • Action during the target's next Turn.` });
}

async function applySystemReset( attacker, target ) {
  await target.toggleStatusEffect("systemReset",  { active:true } );
  await ChatMessage.create({ content: `${target.name} falls unconscious and prone for 20 rounds or until damaged.` });
}

async function applyShardEjection( attacker, target ) {

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
            speaker: { actor: attacker },

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

// Remove QuickHack Effects

async function removeSlow( target ) {
  const slowEffects = target.effects.filter(
    e =>
      e.getFlag(
        "cyberpunk-red-quickhacks",
        "quickhack"
      ) === "slow"
  );

  if (slowEffects.length === 0) {
    ui.notifications.warn( `${target.name} has no Slow effects.` );
    return;
  }

  await target.deleteEmbeddedDocuments( "ActiveEffect", slowEffects.map(e => e.id) );
  await target.unsetFlag( "cyberpunk-red-quickhacks", "slow" );
  ChatMessage.create({ content: `${target.name} is no longer affected by Slow.` });
}

async function impairedMovement( target ) {
  const impairedMovementEffects = target.effects.filter(
    e =>
      e.getFlag(
        "cyberpunk-red-quickhacks",
        "quickhack"
      ) === "impairedMovement"
  );

  if (impairedMovementEffects.length === 0) {
    ui.notifications.warn( `${target.name} has no Impaired Movement effects.` );
    return;
  }

  await target.deleteEmbeddedDocuments( "ActiveEffect", impairedMovementEffects.map(e => e.id) );
  await target.unsetFlag( "cyberpunk-red-quickhacks", "impairedMovement" );
  ChatMessage.create({ content: `${target.name} is no longer affected by Impaired Movement.` });
}

// Helper Functions
async function applyCriticalInjury( actor, packName, injuryId ) {
  const pack = game.packs.get(packName);
  if (!pack) return;
  const injury = await pack.getDocument(injuryId);
  if (!injury) return;

  const alreadyHasInjury =
    actor.itemTypes.criticalInjury.some(
      i => i.name === injury.name
    );

  if (alreadyHasInjury) return;

  await actor.createEmbeddedDocuments(
    "Item",
    [{
      name: injury.name,
      type: injury.type,
      img: injury.img,
      system: foundry.utils.duplicate(
        injury.system
      ),
      effects: foundry.utils.duplicate(
        injury.effects
      )
    }]
  );
}

export async function applyQuickHack( attacker, target, hack ) {
  console.log( "Applying QuickHack:", hack.name, "to", target.name );

  const name = hack.name;
  switch (name) {
    case "Impair Movement":
      return applyImpairMovement( attacker, target );
    case "Sonic Shock":
      return applySonicShock( attacker, target );
    case "Overheat":
      return applyOverheat( attacker, target );
    case "Short Circuit":
      return applyShortCircuit( attacker, target );
    case "Cyberware Malfunction":
      return applyCyberwareMalfunction( attacker, target );
    case "Lure":
      return applyLure( attacker, target );
    case "Slow":
      return applySlow( attacker, target );
    case "Synapse Burnout":
      return applySynapseBurnout( attacker, target );
    case "Puppet":
      return applyPuppet( attacker, target );
    case "Shard Ejection":
      return applyShardEjection( attacker, target );
    case "System Reset":
      return applySystemReset( attacker, target );
    default:
      ui.notifications.warn( `${name} has no automation yet.` );
  }
}