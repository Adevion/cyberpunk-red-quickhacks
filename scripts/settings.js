export function registerSettings() {

  game.settings.register(
    "cpred-edgerunners-quickhacks",
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
    "cpred-edgerunners-quickhacks",
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

export function registerSettingsMenu() {
  
  game.settings.registerMenu( "cyberpunk-red-quickhacks", "quickhackSettings",
    {
      name: "Cyberpunk RED - QuickHacks",
      label: "Configure",
      hint: "Configure QuickHack module settings.",
      icon: "fas fa-network-wired",
      type: FormApplication,
      restricted: true
    }
  );
}