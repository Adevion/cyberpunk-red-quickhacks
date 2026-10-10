export const QUICKHACK_EFFECTS = [

{
  id: "quickhacked",
  label: "QuickHacked",
  icon: "icons/svg/lightning.svg"
},

{
  id: "breached",
  label: "Breached",
  icon: "icons/svg/net.svg"
},

{
  id: "sonicShock",
  label: "Sonic Shock",
  icon:
    "icons/magic/sonic/projectile-sound-rings-wave.webp"
},

{
  id: "systemReset",
  label: "System Reset",
  icon: "icons/svg/falling.svg"
},

{
  id: "directConnection",
  label: "Direct Connection",
  icon:
    "icons/commodities/tech/cable-coiled-glowing-blue.webp"
}

];

export function registerEffects() {

  CONFIG.statusEffects.push(
    ...QUICKHACK_EFFECTS
  );
}