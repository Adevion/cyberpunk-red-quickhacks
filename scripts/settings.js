export function registerSettings() {
    game.settings.register( "cyberpunk-red-quickhacks", "debugMode",
        {
            name: "Debug Mode",
            hint: "Enable verbose debugging and GM audit logging.",
            scope: "world",
            config: true,
            type: Boolean,
            default: false
        }
    );    
}