const actor = token?.actor;

if (!actor) {
  ui.notifications.warn("Select a token.");
  return;
}

const existing = actor.items.find( i => i.name === "Neuroport" );

if (existing) {
  ui.notifications.warn( `${actor.name} already has a Neuroport.` );
  return;
}

const pack = game.packs.get( "cyberpunk-red-quickhacks.cyberware" );

if (!pack) {
  ui.notifications.error( "Cyberware compendium not found." );
  return;
}

const index = await pack.getIndex();
const entry = index.find( e => e.name === "Neuroport" );

if (!entry) {
  ui.notifications.error( "Neuroport not found in compendium." );
  return;
}

const document = await pack.getDocument( entry._id );
const data = document.toObject();
const created = await actor.createEmbeddedDocuments( "Item", [data] );

const neuroport = created[0];
await neuroport.install();
ui.notifications.info( `Neuroport installed on ${actor.name}.` );