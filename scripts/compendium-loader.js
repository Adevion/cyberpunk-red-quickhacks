export async function createFolders() {

    const names = [
        "Simple QuickHacks",
        "Standard QuickHacks",
        "Difficult QuickHacks",
        "Advanced QuickHacks"
    ];

    for (const name of names) {
        if ( game.folders.find( f => f.name === name )) continue;
        await Folder.create({ name, type: "Item" });
    }
}