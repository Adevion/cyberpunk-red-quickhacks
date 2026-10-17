const actor = canvas.tokens.controlled[0]?.actor;

if (!actor) {
  ui.notifications.warn("Select a token.");
  return;
}

const selfIceCount = actor.items.filter( i => i.name === "Self-ICE" ).length;

if (selfIceCount >= 3) {
  ui.notifications.warn( `${actor.name} already has the maximum of 3 Self-ICE installations.` );
  return;
}

const pack = game.packs.get( "cyberpunk-red-quickhacks.cyberware" );

if (!pack) {
  ui.notifications.error( "Cyberware compendium not found." );
  return;
}

const index = await pack.getIndex();
const entry = index.find( e => e.name === "Self-ICE" );

if (!entry) {
  ui.notifications.error( "Self-ICE not found in compendium." );
  return;
}

const document = await pack.getDocument( entry._id );
const created = await actor.createEmbeddedDocuments( "Item", [document.toObject()] );

await created[0].install();
const newCount = selfIceCount + 1;
ui.notifications.info( `Installed Self-ICE (${newCount}/3) on ${actor.name}.` );
