Hooks.on("updateCombat", async (combat) => {
  const currentRound = combat.round;

  // Overheat Damage
  const actingActor = combat.combatant?.actor;
  if (actingActor) {
    const overheatEffect =
      actingActor.effects.find(
        e =>
          e.getFlag(
            "cyberpunk-red-quickhacks",
            "quickhack"
          ) === "overheat"
      );

    if (overheatEffect) {
      const hp = actingActor.system?.derivedStats?.hp?.value;
      if (hp !== undefined) {
        await actingActor.update({ "system.derivedStats.hp.value": Math.max(hp - 4, 0) });
        await ChatMessage.create({ 
          speaker: ChatMessage.getSpeaker({ actor: actingActor }),
          content: `<div class="cpr-evasion-result hit">${actingActor.name} suffers 4 damage from Overheat.</div>`
        });
      }
    }
  }

  // Expire effects
  for (const token of canvas.tokens.placeables) {
    const actor = token.actor;
    if (!actor) continue;
    const expired = actor.effects.filter(effect => {
      const expiresRound = effect.getFlag( "cyberpunk-red-quickhacks", "expiresRound" );
      return ( expiresRound !== undefined && currentRound >= expiresRound );
    });

    if (expired.length) {
      await actor.deleteEmbeddedDocuments(
        "ActiveEffect",
        expired.map(e => e.id)
      );
    }
  }
});

// System Reset Damage Interrupt
Hooks.on("preUpdateActor", async (actor, change) => {
  const newHP = change?.system?.derivedStats?.hp?.value;
  if (newHP === undefined) return;
  const oldHP = actor.system?.derivedStats?.hp?.value;
  if (newHP >= oldHP) return;

  const systemResetEffects =
    actor.effects.filter( e => e.getFlag( "cyberpunk-red-quickhacks", "quickhack" ) === "systemReset" );

  if (!systemResetEffects.length) return;

  await actor.deleteEmbeddedDocuments( "ActiveEffect", systemResetEffects.map(e => e.id) );
  await actor.toggleStatusEffect( "unconscious", { active: false } );
  await ChatMessage.create({ content: `<div class="cpr-evasion-result hit"> <b>${actor.name}</b> regains consciousness. </div>` });
});