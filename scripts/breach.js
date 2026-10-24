// Cyberpunk RED Core Imports
import * as CPRRolls from "../../../systems/cyberpunk-red-core/modules/rolls/cpr-rolls.js";

// Quickhack Imports
import { getPasswallDV } from "./neuroport.js";
import { getInterfaceRank } from "./quickhacks.js";
import { getSocket } from "./socketlib.js";
import { debugLog } from "./gm-utilities.js";

export async function performBreach(actor, target) {
  const passwallDV = getPasswallDV(target);
  const interfaceRank = getInterfaceRank(actor);

  const firewallDV = 6;

  let success = true;
  let resultImage = "";
  let neuroportResult = null;
  let selfIceResult = null;

  //
  // NEUROPORT CHECK
  //
  if (interfaceRank >= 3) {
    neuroportResult = { autoSuccess: true };
  } else {
    const firewallRoll = new CPRRolls.CPRInterfaceRoll( "action", "Interface", interfaceRank );
    const keepRolling = await firewallRoll.handleRollDialog( { type: "manual" }, actor );

    if (!keepRolling) {
      return false;
    }

    const currentLuck = Number( actor.system.stats.luck.value ?? 0 );
    const requestedLuck = Number( firewallRoll.luck ?? 0 );

    await debugLog(
      "Luck Anti-Cheat",
      {
        actor: actor.name,
        requestedLuck,
        currentLuck,
        appliedLuck: firewallRoll.luck
      }
    );

    await firewallRoll.roll();

    if (firewallRoll.luck > 0) {
      await actor.update({ "system.stats.luck.value": currentLuck - firewallRoll.luck });
    }

    const fw_faces = firewallRoll.faces ?? firewallRoll.terms?.[0]?.results?.map(r => r.result) ?? [];
    const fw_resultTotal = firewallRoll.resultTotal ?? firewallRoll.total ?? 0;
    const fw_wasCritSuccess = firewallRoll.wasCritSuccess?.() ?? false;
    const fw_wasCritFail = firewallRoll.wasCritFail?.() ?? false;
    const fw_criticalRoll = firewallRoll.criticalRoll ?? 0;
    const fw_totalMods = firewallRoll.totalMods?.() ?? 0;
    const fw_modifiers = firewallRoll.mods ?? [];
    const fw_hasModifiers = fw_modifiers.length > 0 || fw_totalMods !== 0;
    const fw_luck = firewallRoll.luck ?? 0;

    neuroportResult = {
      autoSuccess: false, 
      faces: fw_faces, 
      wasCritSuccess: fw_wasCritSuccess, 
      wasCritFail: fw_wasCritFail, 
      resultTotal: fw_resultTotal,
      criticalRoll: fw_criticalRoll,
      hasModifiers: fw_hasModifiers,
      modifiers: fw_modifiers,
      luck: fw_luck
    };

    if (firewallRoll.resultTotal < firewallDV) {
      success = false;
      resultImage = `modules/cyberpunk-red-quickhacks/images/pixel-fail.webp`;
    } 
  }

  //
  // SELF-ICE CHECK
  //
  if (success && passwallDV > 0) {
    const selfIceRoll = new CPRRolls.CPRInterfaceRoll( "action", "Interface", interfaceRank );
    const keepRolling = await selfIceRoll.handleRollDialog( { type: "manual" }, actor );

    if (!keepRolling) {
      return false;
    }

    const currentLuck = Number( actor.system.stats.luck.value ?? 0 );
    const requestedLuck = Number( selfIceRoll.luck ?? 0 );

    await debugLog(
      "Luck Anti-Cheat",
      {
        actor: actor.name,
        requestedLuck,
        currentLuck,
        appliedLuck: selfIceRoll.luck
      }
    );

    await selfIceRoll.roll();

    if (selfIceRoll.luck > 0) {
      await actor.update({ "system.stats.luck.value": currentLuck - selfIceRoll.luck });
    }

    const ice_faces = selfIceRoll.faces ?? selfIceRoll.terms?.[0]?.results?.map(r => r.result) ?? [];
    const ice_resultTotal = selfIceRoll.resultTotal ?? selfIceRoll.total ?? 0;
    const ice_wasCritSuccess = selfIceRoll.wasCritSuccess?.() ?? false;
    const ice_wasCritFail = selfIceRoll.wasCritFail?.() ?? false;
    const ice_criticalRoll = selfIceRoll.criticalRoll ?? 0;
    const ice_totalMods = selfIceRoll.totalMods?.() ?? 0;
    const ice_modifiers = selfIceRoll.mods ?? [];
    const ice_hasModifiers = ice_modifiers.length > 0 || ice_totalMods !== 0;
    const ice_luck = selfIceRoll.luck ?? 0;

    selfIceResult = { 
      faces: ice_faces, 
      wasCritSuccess: ice_wasCritSuccess, 
      wasCritFail: ice_wasCritFail, 
      resultTotal: ice_resultTotal,
      criticalRoll: ice_criticalRoll,
      hasModifiers: ice_hasModifiers,
      modifiers: ice_modifiers,
      luck: ice_luck
    };

    if (selfIceRoll.resultTotal < passwallDV) { 
      success = false;
      resultImage = `modules/cyberpunk-red-quickhacks/images/pixel-fail.webp`;
    }
  }

  //
  // FINAL RESULT
  //
  if (success) {
    const socket = getSocket();

    await socket.executeAsGM( "applyBreach", target.uuid );
    ui.notifications.info( "Breach successful." );
    resultImage = `modules/cyberpunk-red-quickhacks/images/pixel-success.webp`;
  } else {
    ui.notifications.warn( "Breach failed." );
    resultImage = `modules/cyberpunk-red-quickhacks/images/pixel-fail.webp`;
  }

  await postBreachCard(
    actor,
    target.name,
    interfaceRank,
    neuroportResult,
    selfIceResult,
    resultImage
  );

  return success;
}

export async function applyBreach(targetUuid) {
  const target = await fromUuid(targetUuid);

  await target.setFlag(
    "cyberpunk-red-quickhacks",
    "neuroport.firewallBreached",
    true
  );

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

async function postBreachCard( attacker, targetName, interfaceRank, neuroportResult, selfIceResult, resultImage, description = "" ) {
  const content =
    await renderTemplate(
      "modules/cyberpunk-red-quickhacks/templates/chat/breach-card.hbs",
      {
        rollTitle: "Breach",
        subTitle: targetName,
        interfaceRank,
        neuroport: neuroportResult,
        selfIce: selfIceResult,
        resultImage,
        description
      }
    );

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({
      actor: attacker
    }),
    content
  });
}