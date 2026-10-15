const MODULE_ID = "cyberpunk-red-quickhacks";

export async function buildCompendiums() {
  console.log("CPRED-QH | Building Compendiums");
  const definitions = [
   {
      pack: "quickhacks",
      type: "Item",
      source:
        "modules/cyberpunk-red-quickhacks/data/quickhacks"
    },
    {
      pack: "cyberware",
      type: "Item",
      source:
        "modules/cyberpunk-red-quickhacks/data/cyberware"
    },
    {
      pack: "drugs",
      type: "Item",
      source:
        "modules/cyberpunk-red-quickhacks/data/drugs"
    },
    {
      pack: "net-actions",
      type: "Item",
      source:
        "modules/cyberpunk-red-quickhacks/data/netactions"
    },
    {
      pack: "journals",
      type: "JournalEntry",
      source:
        "modules/cyberpunk-red-quickhacks/data/journals"
    }
  ];
  for (const def of definitions) {await buildPack(def);}
}

async function buildPack(def) {
  const pack = game.packs.get(`${MODULE_ID}.${def.pack}`);

  if (!pack) {
    console.error(`Pack ${def.pack} not found.`);
    return;
  }

  const source = foundry.utils.getRoute(`${def.source}/index.json`);
  const response = await fetch(source);

  if (!response.ok) {
    console.warn(`No index found for ${def.pack}`);
    return;
  }

  const files = await response.json();

  for (const file of files) {
    await importEntry(pack, def, file);
  }

}

async function importEntry(pack, definition, file) {
  const response = await fetch(file);
  if (!response.ok) return;
  const data = await response.json();
  const existing = pack.index.find(
    e => e.name === data.name
  );
  
  if (existing) {
    const doc =
    await pack.getDocument(
      existing._id
    );
    await doc.delete();
  }

  if (existing) return;

  if (definition.type === "Item") {
    await Item.create(
      data,
      {
        pack: pack.collection
      }
    );
  }

  if (definition.type === "JournalEntry") {
    await JournalEntry.create(
      data,
      {
        pack: pack.collection
      }
    );
  }
}