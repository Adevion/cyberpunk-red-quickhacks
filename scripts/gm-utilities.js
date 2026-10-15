import { getSocket } from "./socketlib.js";

export async function removeAllQuickHackEffects( actor ) {
  //const actor = await fromUuid( actorUuid );
  if (!actor) return;

  const quickhackEffects = actor.effects.filter( effect => effect.getFlag( "cyberpunk-red-quickhacks", "quickhack" ) !== undefined );

  if (quickhackEffects.length) { await actor.deleteEmbeddedDocuments( "ActiveEffect", quickhackEffects.map(e => e.id) ); }

  // Clean module flags
  await actor.unsetFlag( "cyberpunk-red-quickhacks", "slow" );
  await actor.unsetFlag( "cyberpunk-red-quickhacks", "impairedMovement" );
  await actor.unsetFlag( "cyberpunk-red-quickhacks", "lastShardEjection" );
  await actor.unsetFlag( "cyberpunk-red-quickhacks", "cyberwareMalfunction" );
  await actor.unsetFlag( "cyberpunk-red-quickhacks", "puppet" );
  await actor.unsetFlag( "cyberpunk-red-quickhacks", "lure" );
  await actor.unsetFlag( "cyberpunk-red-quickhacks", "overheat" );
  await actor.unsetFlag( "cyberpunk-red-quickhacks", "shortCircuit" );
  await actor.unsetFlag( "cyberpunk-red-quickhacks", "sonicShock" );
  await actor.unsetFlag( "cyberpunk-red-quickhacks", "systemReset" );

  // Reset breach state
  await actor.setFlag( "cyberpunk-red-quickhacks", "neuroport.firewallBreached", false );

  // Remove CPR status effects that may remain
  await actor.toggleStatusEffect( "unconscious", { active: false } );
  await actor.toggleStatusEffect( "prone", { active: false } );

  ui.notifications.info( `${actor.name}: all QuickHack effects removed.` );
  await ChatMessage.create({ content: `<div class="cpr-evasion-result hit"> <b>${actor.name}</b> has been cleared of all QuickHack effects. </div>` });
}

export async function removeQuickHackEffect( actorUuid, quickhackName ) {
  const actor = await fromUuid(actorUuid);
  if (!actor) return;

  const effects = actor.effects.filter( e => e.getFlag( "cyberpunk-red-quickhacks", "quickhack" ) === quickhackName );

  if (!effects.length) {
    ui.notifications.warn( `${actor.name} has no ${quickhackName} effect.` );
    return;
  }

  switch (quickhackName) {
    case "slow":
      await actor.unsetFlag( "cyberpunk-red-quickhacks", "slow" );
    break;

  case "impairedMovement":
    await actor.unsetFlag( "cyberpunk-red-quickhacks", "impairedMovement" );
    break;

  case "systemReset":
    await actor.toggleStatusEffect( "unconscious", { active: false } );

    await actor.toggleStatusEffect(
      "prone", { active: false } );
    break;
}

  await actor.deleteEmbeddedDocuments( "ActiveEffect", effects.map(e => e.id) );

  ChatMessage.create({
    content: `
      <div class="cpr-evasion-result hit">
        <b>${quickhackName}</b> removed from ${actor.name}.
      </div>
    `
  });
}

export async function debugLog(...args) {
  if ( !game.settings.get( "cyberpunk-red-quickhacks", "debugMode" ) ) {
    return;
  }

  console.log( "[CPRED-QH]", ...args );
  if (!game.user.isGM) {
    const socket = getSocket();
    await socket.executeAsGM( "gmDebugLog", game.user.name, args );
  }
}

export async function gmDebugLog( userName, args ) {
  console.log( `[CPRED-QH][${userName}]`, ...args );
}