export async function createFolders() {

    const names = [
        "Simple Quickhacks",
        "Standard Quickhacks",
        "Difficult Quickhacks",
        "Advanced Quickhacks"
    ];

    for (const name of names) {
        if ( game.folders.find( f => f.name === name )) continue;
        await Folder.create({ name, type: "Item" });
    }
}