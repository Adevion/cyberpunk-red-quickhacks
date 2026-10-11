export const QUICKHACK_EFFECTS = [
  {
    id: "quickhacked",
    label: "QuickHacked",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/lightning.svg"
  },
  {
    id: "breached",
    label: "Breached",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/whiplash.svg"
  },
  {
    id: "sonicShock",
    label: "Sonic Shock",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/sonic-boom.svg"
  },
  {
    id: "systemReset",
    label: "System Reset",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/unconcious.svg"
  },
  {
    id: "directConnection",
    label: "Direct Connection",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/unplugged.svg"
  },
  {
    id: "slow",
    label: "Slow",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/sticky-boot.svg"
  },
  {
    id: "impairedMovement",
    label: "Impaired Movement",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/broken_leg.svg"
  },
  {
    id: "overheat",
    label: "Overheat",
    icon: "modules/cyberpunk-red-quickhacks/icons/svg/on_fire.svg"
  }
  
];

export function registerEffects() {
  CONFIG.statusEffects.push( ...QUICKHACK_EFFECTS );
}