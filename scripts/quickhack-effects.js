// Cyberpunk RED Core Imports
import * as CPRRolls from  "../../../systems/cyberpunk-red-core/modules/rolls/cpr-rolls.js";

import { getSocket } from "./socketlib.js";

// Apply QuickHack Effects
//--------------------------------------------------------------------
// Impair Movement
async function applyImpairMovement( attacker, target ) {
  const penalty = 1;
  const created = await target.createEmbeddedDocuments(
    "ActiveEffect",
    [{
      name: `Impaired Movement`,
      img: "modules/cyberpunk-red-quickhacks/icons/svg/broken_leg.svg",
      statuses: ["impairedMovement"],
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
  await ChatMessage.create({ 
    speaker: ChatMessage.getSpeaker({ actor: attacker }),
    content: `<div class="cpr-evasion-result hit"> ${target.name}'s MOVE is reduced by 1 for 1 minute.</div>`
  });
}

//Overheat
export async function applyOverheat( attacker, target ) {
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

  await ChatMessage.create({ 
    speaker: ChatMessage.getSpeaker({ actor: attacker }),
    content: `<div class="cpr-evasion-result hit"> ${target.name} is on fire. Suffers 4 HP damage each Turn.</div>` });
}

// Slow
async function applySlow( attacker, target ) {
  const roll = new CPRRolls.CPRDamageRoll( "Slow", "1d6", "program" );
 
  await roll.roll();
  let penalty = roll.resultTotal;

  await postRollCard( attacker, "Slow", target.name, `${target.name} suffers -${penalty} MOVE for 1 minute.`, "" ,roll, "d6", "");
    
  const created = await target.createEmbeddedDocuments(
    "ActiveEffect",
    [{
      name: "Slow",
      img: "modules/cyberpunk-red-quickhacks/icons/svg/sticky-boot.svg",
      statuses: ["slow"],
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
}

//Sonic Schock
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
    await ChatMessage.create({ 
      speaker: ChatMessage.getSpeaker({ actor: attacker }),
      content: `<div class="cpr-evasion-result hit"> ${target.name} suffers Sonic Shock for 1 minute.</div>`
   });
  } else {
    await ChatMessage.create({ 
      speaker: ChatMessage.getSpeaker({ actor: attacker }),
      content: `<div class="cpr-evasion-result hit"> ${target.name} already suffers from Damaged Ear Critical Injury.</div>` 
    });
  }
}

// Short Circuit
async function applyShortCircuit( attacker, target) {
  const cyberware = target.items.filter( 
    i => i.type === "cyberware" && 
    ![
      "External (7 Option Slots)",
      "Fashionware (7 Option Slots)",
      "Internal (7 Option Slots)",
      "Cyberarm",
      "Cyberleg",
      "Cybereye",
      "Cyberaudio Suite",
      "Neuralport",
      "Neuralport Cyberdeck" 
    ].includes(i.name)
  );

  const list = cyberware.map(i => `<option value="${i.id}"> ${i.name} </option>`).join("");
  new Dialog({
    title: "Short Circuit ▼",
    content: `
    <form>
    <label>
      Select up to 3 pieces of Cyberware:
    </label>
    <br><br>
    <select multiple id="items" style="width:100%;">
      ${list}
    </select>
    </form>
    <br>
    <p>Target: ${target.name}</p>
    <p>All Cyberware will be disabled for 1 minute.</p>
    `,

    buttons: {
      apply: {
        label: "Disable",
        callback: async html => {
          const selected = html.find("#items").val() ?? [];
          if (selected.length === 0) {
            ui.notifications.warn( "Select at least one Cyberware item." );
            return;
          }

          if (selected.length > 3) {
            ui.notifications.warn( "Select a maximum of 3 Cyberware items." );
            return;
          }
          
          const socket = getSocket();
          await socket.executeAsGM( "applyShortCircuitEffect", attacker.uuid, target.uuid, selected );

        }
      }
    }
  }).render(true);
}

export async function applyShortCircuitEffect( attackerUuid, targetUuid, selectedIds ) {
  const attacker = await fromUuid(attackerUuid);
  const target = await fromUuid(targetUuid);
  if (!attacker || !target) return;
  const disabledNames = [];

  for (const id of selectedIds) {
    const item = target.items.get(id);
    if (!item) continue;
    disabledNames.push(item.name);
  }

  await target.createEmbeddedDocuments(
    "ActiveEffect",
    [{
      name: "Short Circuit",
      img: "modules/cyberpunk-red-quickhacks/icons/svg/sonic-lightning.svg",
      statuses: ["shortCircuit"],
      flags: {
        "cyberpunk-red-quickhacks": {
          quickhack: "shortCircuit",
          selectedIds,
          expiresRound: (game.combat?.round ?? 0) + 20
        }
      }
    }]
  );

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: attacker }),
    content: `
      <div class="cpr-evasion-result hit">
        <h3>Short Circuit</h3>
        <p> ${target.name}'s cyberware disabled: </p>
        <ul>
          ${disabledNames
            .map(name => `<li>${name}</li>`)
            .join("")}
        </ul>
      </div>
    `
  });
}

// Cyberware Malfunction
async function applyCyberwareMalfunction( attacker, target ) {
const cyberware = target.items.filter(
  i => i.type === "cyberware" &&
  ![
    "External (7 Option Slots)",
    "Fashionware (7 Option Slots)",
    "Internal (7 Option Slots)",
    "Neuralport Cyberdeck",
    "Neuralport"
  ].includes(i.name)
  );

  const list = cyberware.map(i => `<option value="${i.id}"> ${i.name} </option>`).join("");
  new Dialog({
    title: "Cyberware Malfunction ▼",
    content: `
      <form>
      <label>
        Select a piece of Cyberware: 
      </label>
      <br><br>
      <select id="items" style="width:100%;">
        ${list}
      </select>
      </form>
      <br>
      <p>Target: ${target.name}</p>
      <p>Cyberware will malfunction for 1 minute.</p>
    `,

    buttons: {
      apply: {
        label: "Disable",
        callback: async html => {
          const selected = html.find("#items").val();
          if (!selected) {
            ui.notifications.warn( "Select a Cyberware item." );
             return;
          }
          
          const item = target.items.get(selected);
          if (!item) return;
          const socket = getSocket();
          await socket.executeAsGM( "applyCyberwareMalfunctionEffect", attacker.uuid, target.uuid, item.id );          
        }
      }
    }
  }).render(true);
}

export async function applyCyberwareMalfunctionEffect( attackerUuid, targetUuid, itemId ) {
  const attacker = await fromUuid(attackerUuid);
  const target = await fromUuid(targetUuid);

  if (!attacker || !target) return;

  const item = target.items.get(itemId);
  if (!item) return;

  // Apply Critical Injury for specific cyberware
  if (item.name === "Cyberaudio Suite") {
    await applyCriticalInjury(
      target,
      "cyberpunk-red-core.core_critical-injuries-head",
      "qRkCxq0KTuBnw2wj"
    );
  }

  if (item.name.includes("Cybereye")) {
    await applyCriticalInjury(
      target,
      "cyberpunk-red-core.core_critical-injuries-body",
      "qoegLCfpEOQifeZq"
    );
  }

  if (item.name.includes("Cyberarm")) {
    await applyCriticalInjury(
      target,
      "cyberpunk-red-core.core_critical-injuries-body",
      "Y65igO9rtakP4qSs"
    );
  }

  if (item.name.includes("Cyberleg")) {
    await applyCriticalInjury(
      target,
      "cyberpunk-red-core.core_critical-injuries-body",
      "yBy9rlhgZeaWGtHh"
    );
  }

  if (item.name.includes("Nasal Filters")) {
    await applyCriticalInjury(
      target,
      "cyberpunk-red-core.core_critical-injuries-body",
      "RAZcouFe0FS1VN1o"
    );
  }

  if (item.name.includes("Subdermal Armor")) {
    await applyCriticalInjury(
      target,
      "cyberpunk-red-core.core_critical-injuries-body",
      "MQpiPgEtPaIe6MJ6"
    );
  }

  await target.createEmbeddedDocuments(
    "ActiveEffect",
    [{
      name: "Cyberware Malfunction",
      img: "modules/cyberpunk-red-quickhacks/icons/svg/skeleton-inside.svg",
      statuses: ["cyberwareMalfunction"],
      flags: {
        "cyberpunk-red-quickhacks": {
          quickhack: "cyberwareMalfunction",
          cyberwareId: item.id,
          cyberwareName: item.name,
          expiresRound:
            (game.combat?.round ?? 0) + 20
        }
      }
    }]
  );

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({
      actor: attacker
    }),
    content: `
      <div class="cpr-evasion-result hit">
        <h3>Cyberware Malfunction</h3>
        <p>
          ${target.name}'s
          <b>${item.name}</b>
          malfunctions for 1 minute.
        </p>
      </div>
    `
  });
}

//Lure
export async function applyLureEffect( attackerUuid, targetUuid, instruction ) {
  const attacker = await fromUuid(attackerUuid);
  const target = await fromUuid(targetUuid);

  if (!attacker || !target) return;

  await target.createEmbeddedDocuments(
    "ActiveEffect",
    [{
      name: "Lure",
      img: "modules/cyberpunk-red-quickhacks/icons/svg/fishing-lure.svg",
      statuses: ["lured"],
      flags: {
        "cyberpunk-red-quickhacks": {
          quickhack: "lure",
          instruction,
          expiresRound:
            (game.combat?.round ?? 0) + 1
        }
      }
    }]
  );

  const gmRecipients = ChatMessage.getWhisperRecipients("GM");

  await ChatMessage.create({
    whisper: gmRecipients.map(u => u.id),
    speaker: ChatMessage.getSpeaker({ actor: attacker }),
    content: `
      <div class="cpr-evasion-result hit">
        <h3>Lure Instruction</h3>
        <p>${target.name} is lured toward:
        <b>${instruction}</b></p>
      </div>
    `
  });

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: attacker }),
    content: `
      <div class="cpr-evasion-result hit">
        Lure successful.
      </div>
    `
  });
}

async function applyLure( attacker, target ) {
  new Dialog({
    title: "Lure",

    content: `
      <form>
        <label>
          ${target.name} is lured toward:
        </label>
        <br><br>
        <input
          id="instruction"
          type="text"
          placeholder="Security terminal"
        >
      </form>
      <br><br>
    `,

    buttons: {
      apply: {
        label: "Lure",
        callback: async html => {
          const instruction = html.find("#instruction").val();
          if (!instruction) {
            ui.notifications.warn( "Enter a destination." );
            return;
          }
          const socket = getSocket();
          await socket.executeAsGM( "applyLureEffect", attacker.uuid, target.uuid, instruction );
        }
      }
    },
    default: "apply"
  }).render(true);
}

//Synapse Burnout
async function applySynapseBurnout( attacker, target ) {
  const roll = new CPRRolls.CPRDamageRoll( "Synapse Burnout", "3d6", "program" );
  
  await roll.roll();
  await postRollCard( attacker, "Synapse Burnout", target.name, `${target.name} suffers ${roll.resultTotal} direct damage.`, "", roll, "d6");

  const hp = target.system?.derivedStats?.hp?.value;
  if (hp !== undefined) {
    let damage = roll.resultTotal;
    if (roll.wasCritSuccess()) { damage += roll.bonusDamage; }
    await target.update({"system.derivedStats.hp.value": Math.max(hp - damage, 0)});
  }
}

//Puppet
async function applyPuppet( attacker, target ) {
  new Dialog({
    title: "Puppet",
    content: `
      <form>
        <label>
          ${target.name} is controled to do:
        </label>
        <br><br>
        <input id="instruction" type="text" placeholder="Security terminal">
      </form>
      <br><br>
    `,
    buttons: {
      apply: {
        label: "Puppet",
        callback: async html => {
          const instruction = html.find("#instruction").val();
          if (!instruction) { ui.notifications.warn( "Enter a action." );
            return;
          }

          const socket = getSocket();
          await socket.executeAsGM( "applyPuppetEffect", attacker.uuid, target.uuid, instruction );
      
        }
      }
    },
    default: "apply"
  }).render(true);
}

export async function applyPuppetEffect( attackerUuid, targetUuid, instruction ) {
  const attacker = await fromUuid(attackerUuid);
  const target = await fromUuid(targetUuid);

  if (!attacker || !target) return;

  await target.createEmbeddedDocuments(
    "ActiveEffect",
    [{
      name: "Puppet",
      img: "modules/cyberpunk-red-quickhacks/icons/svg/puppet.svg",
      statuses: ["controlled"],
      flags: {
        "cyberpunk-red-quickhacks": {
          quickhack: "puppet",
          instruction,
          expiresRound:
            (game.combat?.round ?? 0) + 1
        }
      }
    }]
  );

  const gmRecipients = ChatMessage.getWhisperRecipients("GM");

  await ChatMessage.create({
    whisper: gmRecipients.map(u => u.id),
    speaker: ChatMessage.getSpeaker({
      actor: attacker
    }),
    content: `
      <div class="cpr-evasion-result hit">
        <h3>Command Instruction</h3>
        <p>
          ${target.name} is commanded to:
          <b>${instruction}</b>
        </p>
      </div>
    `
  });

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({
      actor: attacker
    }),
    content: `
      <div class="cpr-evasion-result hit">
        Puppet successful.
      </div>
    `
  });
}

//System Reset
async function applySystemReset( attacker, target ) {
  await target.createEmbeddedDocuments(
    "ActiveEffect",
    [{
      name: "System Reset",
      img: "modules/cyberpunk-red-quickhacks/icons/svg/unconcious.svg",
      statuses: ["systemReset"],
      flags: {
        "cyberpunk-red-quickhacks": {
          quickhack: "systemReset",
          expiresRound:
            (game.combat?.round ?? 0) + 20
        }
      }
    }]
  );

  await target.toggleStatusEffect( "unconscious", { active: true } );
  await target.toggleStatusEffect( "prone", { active: true } );

  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: attacker }),
    content: `
      <div class="cpr-evasion-result hit">
        <h3>System Reset</h3>
        <p> ${target.name} falls unconscious and prone for 1 minute or until damaged. </p>
      </div>
    `
  });
}

//Shard Ejection
async function applyShardEjection(attacker, target) {
  const chipware = target.items.filter(i => {
    if (i.type !== "cyberware") return false;
    return (
      i.name.toLowerCase().includes("chip") ||
      i.system?.type === "chipware" ||
      i.system?.isChipware === true
    );
  });

  if (chipware.length === 0) {
    ui.notifications.warn( `${target.name} has no installed chipware.` );
    return;
  }

  const options = chipware
    .map(item => `<option value="${item.id}"> ${item.name} </option>` )
    .join("");

  new Dialog({
    title: "Shard Ejection ▼",
    content: `
      <form>
        <label>
          Chipware To Eject:
        </label>
        <br><br>
        <select id="chipware" style="width:100%;">
          ${options}
        </select>
      </form>
      <br>
      <p>Target: ${target.name}</p>
      <p> The selected shard will be forcibly ejected. </p>
    `,

    buttons: {
      eject: {
        label: "Eject",
        callback: async html => {
          const itemId = html.find("#chipware").val();
          if (!itemId) return;
        
          const socket = getSocket();
          await socket.executeAsGM( "applyShardEjectionEffect", attacker.uuid, target.uuid, itemId );

        }
      },
      cancel: { label: "Cancel" }
    }
  }).render(true);
}

export async function applyShardEjectionEffect( attackerUuid, targetUuid, itemId ) {
  const attacker = await fromUuid(attackerUuid);
  const target = await fromUuid(targetUuid);
  if (!attacker || !target) return;
  const item = target.items.get(itemId);
  if (!item) return;
  const shardName = item.name;

  await item.uninstall({ skipDialog: true });
  await target.setFlag( "cyberpunk-red-quickhacks", "lastShardEjection", 
    {
      round: game.combat?.round ?? 0,
      shard: shardName
    }
  );

  const gmRecipients = ChatMessage.getWhisperRecipients( "GM" );

  await ChatMessage.create({ whisper: gmRecipients.map( u => u.id ),
    speaker: ChatMessage.getSpeaker({ actor: attacker }),

    content: `
      <div class="cpr-evasion-result hit">
        <h3>Shard Ejection</h3>
        <p>
          <b>${shardName}</b>
          has been forcibly ejected
          from ${target.name}.
        </p>
        <p>
          The shard is airborne and
          lands in an adjacent square.
        </p>
        <p>
          Remove the chip from inventory
          if it is not recovered.
        </p>
      </div>
    `
  });

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: attacker }),

    content: `
      <div class="cpr-evasion-result hit">
        Shard Ejection successful.
      </div>
    `
  });
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

export async function postRollCard( attacker, rollTitle, subTitle, description, resultImage, roll, dieType = "d6", interfaceRank ) {
  const faces = roll.faces ?? roll.terms?.[0]?.results?.map(r => r.result) ?? [];
  const resultTotal = roll.resultTotal ?? roll.total ?? 0;
  const diceClass = faces.length <= 2 ? "d6 d6-60" : "d6 d6-40";
  const wasCritSuccess = roll.wasCritSuccess?.() ?? false;
  const wasCritFail = roll.wasCritFail?.() ?? false;
  const criticalRoll = roll.criticalRoll ?? 0;
  const totalMods = roll.totalMods?.() ?? 0;
  const modifiers = roll.mods ?? [];
  const hasModifiers = modifiers.length > 0 || totalMods !== 0;
  const luck = roll.luck ?? 0;
  const totalModsDisplay = totalMods >= 0 ? `+${totalMods}` : `${totalMods}`;
  const criticalBonus = roll.wasCritSuccess?.() ? (roll.bonusDamage ?? 0) : 0;
  const isD10Roll = dieType === "d10";
  const isD6Roll = dieType === "d6";

  const content =
    await renderTemplate(
      "modules/cyberpunk-red-quickhacks/templates/chat/dice-rollcard.hbs",
      {
        rollTitle,
        subTitle,
        description,
        resultImage,
        faces,
        diceClass,
        dieType,
        resultTotal,

        wasCritSuccess,
        wasCritFail,
        criticalRoll,
        criticalBonus,
        
        hasModifiers,
        modifiers,
        totalMods,
        totalModsDisplay,

        isD10Roll,
        isD6Roll,

        interfaceRank,
        luck
      }
    );

  await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({
      actor: attacker
    }),
    content
  });
}

export async function applyQuickHack( attacker, target, hack ) {
  const dialogDrivenHacks = [ "Lure", "Puppet", "Cyberware Malfunction", "Short Circuit", "Shard Ejection" ];

  if (dialogDrivenHacks.includes(hack.name)) {
    return executeQuickHack( attacker, target,  hack.name );
  }

  // If user can modify the target, execute normally
  if (target.isOwner) { 
    return executeQuickHack( attacker, target, hack.name );
  } else {
    const socket = getSocket();
    await socket.executeAsGM( "executeQuickHack", attacker.uuid, target.uuid, hack.name );
  }
}

export async function executeQuickHackSocket( attackerUuid, targetUuid, hackName ) {
  const attacker = await fromUuid(attackerUuid);
  const target = await fromUuid(targetUuid);

  return executeQuickHack( attacker, target, hackName );
}

export async function executeQuickHack( attacker, target, hackName ) {
  switch (hackName) {
    case "Impair Movement": return applyImpairMovement(attacker, target);
    case "Sonic Shock": return applySonicShock(attacker, target);
    case "Overheat": return applyOverheat(attacker, target);
    case "Short Circuit": return applyShortCircuit(attacker, target);
    case "Cyberware Malfunction": return applyCyberwareMalfunction(attacker, target);
    case "Lure": return applyLure(attacker, target);
    case "Slow": return applySlow(attacker, target);
    case "Synapse Burnout": return applySynapseBurnout(attacker, target);
    case "Puppet": return applyPuppet(attacker, target);
    case "Shard Ejection": return applyShardEjection(attacker, target);
    case "System Reset": return applySystemReset(attacker, target);
    default: ui.notifications.warn( `${hackName} has no automation yet.` );
  }
}