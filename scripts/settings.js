export function registerSettings() {

  game.settings.register(
    "cpred-edgerunners-quickhacks",
    "renameBackdoor",
    {
      name: "Rename Backdoor To Breach",
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
      name: "Enable QuickHack Range Validation",
      scope: "world",
      config: true,
      type: Boolean,
      default: true
    }
  );
}