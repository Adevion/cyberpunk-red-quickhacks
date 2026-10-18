import { buildCompendiums } from "./build-compendiums.js";

export function registerSettings() {
    game.settings.register( "cyberpunk-red-quickhacks", "debugMode", {
        name: "Debug Mode",
        hint: "Enable verbose debugging and GM audit logging.",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    
    game.settings.registerMenu( "cyberpunk-red-quickhacks", "rebuildCompendiumsMenu", {
        name: "Rebuild Compendiums",
        label: "Rebuild",
        hint: "Rebuild all module compendiums.",
        icon: "fas fa-database",
        type: RebuildCompendiumsMenu,
        restricted: true
    });
}

class RebuildCompendiumsMenu extends FormApplication {
  async _updateObject() {}
  async render(force, options) {

    const confirmed = await Dialog.confirm({ title: "Rebuild Compendiums", content: "<p>Rebuild all module compendiums?</p>" });
    if (!confirmed) return;

    ui.notifications.info( "Rebuilding compendiums..." );
    await buildCompendiums();
    ui.notifications.info( "Compendium rebuild complete." );

    return true;
  }
}