export function registerSettings() {

  game.settings.register(
    "cyberpunk-red-quickhacks",
    "renameBackdoor",
    {
      name: "CPQH.Settings.RenameBackdoor.Name",
      hint: "CPQH.Settings.RenameBackdoor.Hint",
      scope: "world",
      config: true,
      type: Boolean,
      default: false
    }
  );

  game.settings.register(
    "cyberpunk-red-quickhacks",
    "enableRangeAutomation",
    {
      name: "CPQH.Settings.RangeValidation.Name",
      hint: "CPQH.Settings.RangeValidation.Hint",
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    }
  );
}